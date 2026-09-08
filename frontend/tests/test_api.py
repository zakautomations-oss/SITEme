"""Local API regression tests. MongoDB is replaced before every request.

Run: python -m unittest discover -s frontend/tests -v
"""
import asyncio
import importlib.util
import os
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient
from pymongo.errors import ConfigurationError, NetworkTimeout, OperationFailure, ServerSelectionTimeoutError

with patch.dict(os.environ, {"MONGO_URL": "", "DB_NAME": "", "ADMIN_TOKEN": ""}):
    spec = importlib.util.spec_from_file_location("ackra_api", Path(__file__).parents[1] / "api" / "index.py")
    api = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(api)


def contact(number):
    return {
        "id": f"contact-{number:04}", "name": f"Person {number}",
        "email": "person@example.com", "phone": None, "company": None,
        "message": f"Inquiry {number}", "created_at": "2026-09-08T00:00:00+00:00",
    }


class Cursor:
    def __init__(self, documents):
        self.documents = [dict(document) for document in documents]
        self.offset = 0
        self.maximum = 500

    def sort(self, fields):
        for field, direction in reversed(fields):
            self.documents.sort(key=lambda document: document[field], reverse=direction == -1)
        return self

    def skip(self, offset):
        self.offset = offset
        return self

    def limit(self, maximum):
        self.maximum = maximum
        return self

    async def to_list(self, length):
        return self.documents[self.offset:self.offset + min(length, self.maximum)]


class Contacts:
    def __init__(self, documents=None):
        self.documents = documents or []
        self.writes = 0
        self.reads = 0
        self.error = None

    async def insert_one(self, document):
        if self.error:
            raise self.error
        self.writes += 1
        document["_id"] = "private-mongo-id"
        self.documents.append({key: value for key, value in document.items() if key != "_id"})

    def find(self, query, projection):
        self.reads += 1
        self.last_projection = projection
        if self.error:
            # Real Motor performs I/O when the cursor is consumed.
            class BrokenCursor(Cursor):
                async def to_list(inner, length):
                    raise self.error
            return BrokenCursor([])
        return Cursor(self.documents)

    async def count_documents(self, query):
        self.reads += 1
        if self.error:
            raise self.error
        return len(self.documents)

    async def delete_one(self, query):
        if self.error:
            raise self.error
        for index, document in enumerate(self.documents):
            if document["id"] == query["id"]:
                self.documents.pop(index)
                self.writes += 1
                return SimpleNamespace(deleted_count=1)
        return SimpleNamespace(deleted_count=0)


class Database:
    def __init__(self, documents=None):
        self.contacts = Contacts(documents)
        self.ping_error = None
        self.ping_delay = 0
        self.pings = 0

    async def command(self, name):
        self.pings += 1
        assert name == "ping"
        if self.ping_delay:
            await asyncio.sleep(self.ping_delay)
        if self.ping_error:
            raise self.ping_error
        return {"ok": 1}


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.database = Database()
        self.db_patch = patch.object(api, "db", self.database)
        self.token_patch = patch.object(api, "ADMIN_TOKEN", "test-admin-token")
        self.db_patch.start()
        self.token_patch.start()
        self.addCleanup(self.db_patch.stop)
        self.addCleanup(self.token_patch.stop)
        self.client = TestClient(api.app)
        self.addCleanup(self.client.close)
        self.auth = {"Authorization": "Bearer test-admin-token"}
        self.payload = {"name": "Jane", "email": "jane@example.com", "message": "Help with scheduling"}

    def test_api_root_accepts_both_slash_forms_without_redirecting(self):
        # Vercel removes trailing slashes. FastAPI must not redirect /api back.
        for path in ("/api", "/api/"):
            with self.subTest(path=path):
                response = self.client.get(path, follow_redirects=False)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json(), {"service": "ackra-ai", "status": "ok"})
                self.assertNotIn("location", response.headers)
                self.assertEqual(response.headers["cache-control"], "no-store")

    def test_admin_routes_fail_closed_when_token_is_unconfigured(self):
        with patch.object(api, "ADMIN_TOKEN", ""):
            for headers in ({}, {"Authorization": "Bearer anything"}):
                for method, path in (("GET", "/api/admin/check"), ("GET", "/api/contact"),
                                     ("GET", "/api/admin/contacts"), ("DELETE", "/api/contact/example")):
                    with self.subTest(headers=bool(headers), path=path):
                        response = self.client.request(method, path, headers=headers)
                        self.assertEqual(response.status_code, 401)
                        self.assertEqual(response.headers["www-authenticate"], "Bearer")
        self.assertEqual(self.database.contacts.reads, 0)
        self.assertEqual(self.database.contacts.writes, 0)

    def test_configured_auth_rejects_missing_wrong_and_non_bearer_tokens(self):
        for headers in ({}, {"Authorization": "Bearer wrong"}, {"Authorization": "Basic test-admin-token"}):
            self.assertEqual(self.client.get("/api/admin/check", headers=headers).status_code, 401)
        self.assertEqual(self.client.get("/api/admin/check", headers=self.auth).json(), {"ok": True})
        self.assertEqual(self.database.pings, 0)

    def test_public_contact_trims_validates_and_persists_without_admin_token(self):
        with patch.object(api, "ADMIN_TOKEN", ""):
            response = self.client.post("/api/contact", json={
                **self.payload, "name": "  Jane  ", "message": "  Please help.  ",
                "phone": "   ", "company": " Example Co  ",
            })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Jane")
        self.assertEqual(response.json()["message"], "Please help.")
        self.assertIsNone(response.json()["phone"])
        self.assertEqual(response.json()["company"], "Example Co")
        self.assertNotIn("_id", response.json())
        self.assertEqual(self.database.contacts.writes, 1)

    def test_required_fields_reject_whitespace_and_email_rejects_invalid_values(self):
        for field, value in (("name", " \t "), ("message", "\n  "), ("email", "invalid")):
            with self.subTest(field=field):
                response = self.client.post("/api/contact", json={**self.payload, field: value})
                self.assertEqual(response.status_code, 422)
        self.assertEqual(self.database.contacts.writes, 0)

    def test_length_limits_reject_oversized_fields(self):
        for field, maximum in (("name", 120), ("phone", 40), ("company", 160), ("message", 4000), ("website", 200)):
            with self.subTest(field=field):
                self.assertEqual(self.client.post("/api/contact", json={**self.payload, field: "x" * (maximum + 1)}).status_code, 422)
        self.assertEqual(self.database.contacts.writes, 0)

    def test_honeypot_returns_success_without_database_access(self):
        with patch.object(api, "db", None):
            response = self.client.post("/api/contact", json={**self.payload, "website": "spam"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.database.contacts.writes, 0)

    def test_paginated_inbox_reaches_beyond_500_with_exact_total_and_stable_order(self):
        self.database.contacts.documents = [contact(number) for number in range(501)]
        response = self.client.get("/api/admin/contacts?page=21&page_size=25", headers=self.auth)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual((data["total"], data["page"], data["page_size"]), (501, 21, 25))
        self.assertEqual([item["id"] for item in data["items"]], ["contact-0000"])
        self.assertEqual(self.database.contacts.last_projection, {"_id": 0})
        first_page = self.client.get("/api/admin/contacts", headers=self.auth).json()
        self.assertEqual(len(first_page["items"]), 25)
        self.assertEqual(first_page["items"][0]["id"], "contact-0500")
        self.assertEqual(response.headers["cache-control"], "no-store")

    def test_legacy_contacts_response_remains_an_array(self):
        self.database.contacts.documents = [contact(number) for number in range(501)]
        response = self.client.get("/api/contact", headers=self.auth)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertEqual(len(response.json()), 500)

    def test_paging_rejects_invalid_bounds(self):
        for query in ("page=0", "page=-1", "page_size=0", "page_size=101", "page=abc"):
            with self.subTest(query=query):
                self.assertEqual(self.client.get(f"/api/admin/contacts?{query}", headers=self.auth).status_code, 422)

    def test_empty_and_deleted_last_page_return_valid_page(self):
        empty = self.client.get("/api/admin/contacts?page=99", headers=self.auth).json()
        self.assertEqual(empty, {"items": [], "total": 0, "page": 1, "page_size": 25})
        self.database.contacts.documents = [contact(number) for number in range(26)]
        response = self.client.delete("/api/contact/contact-0000", headers=self.auth)
        self.assertEqual(response.status_code, 200)
        after = self.client.get("/api/admin/contacts?page=2", headers=self.auth).json()
        self.assertEqual((after["page"], after["total"], len(after["items"])), (1, 25, 25))
        self.assertEqual(self.client.delete("/api/contact/missing", headers=self.auth).status_code, 404)

    def test_health_checks_database_and_never_exposes_driver_errors(self):
        healthy = self.client.get("/api/health")
        self.assertEqual(healthy.status_code, 200)
        self.assertTrue(healthy.json()["db"])
        self.assertEqual(self.database.pings, 1)
        self.database.ping_error = OperationFailure("secret-host-and-credentials")
        unavailable = self.client.get("/api/health")
        self.assertEqual(unavailable.status_code, 503)
        self.assertEqual(unavailable.json()["status"], "unavailable")
        self.assertFalse(unavailable.json()["db"])
        self.assertNotIn("secret", unavailable.text)

    def test_unconfigured_database_fails_health_and_real_contact_submission(self):
        with patch.object(api, "db", None):
            self.assertEqual(self.client.get("/api/health").status_code, 503)
            self.assertEqual(self.client.post("/api/contact", json=self.payload).status_code, 503)
            self.assertEqual(self.client.get("/api/admin/contacts", headers=self.auth).status_code, 503)

    def test_database_operations_have_a_bounded_deadline(self):
        self.database.ping_delay = 1
        with patch.object(api, "DB_TIMEOUT_SECONDS", 0.01):
            response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 503)

    def test_driver_failures_return_safe_retryable_status_on_contact_operations(self):
        self.database.contacts.error = OperationFailure("secret-connection-details")
        for method, path, body in (("POST", "/api/contact", self.payload), ("GET", "/api/contact", None),
                                  ("GET", "/api/admin/contacts", None), ("DELETE", "/api/contact/example", None)):
            with self.subTest(path=path, method=method):
                response = self.client.request(method, path, headers=self.auth, json=body)
                self.assertEqual(response.status_code, 503)
                self.assertEqual(response.json(), {"detail": "Service temporarily unavailable"})
                self.assertNotIn("secret", response.text)

    def test_database_logs_classify_failures_without_logging_private_details(self):
        private_detail = "mongodb+srv://private-user:private-password@private-host.example/private-db"
        cases = (
            (OperationFailure("Authentication failed: " + private_detail, code=18), "authentication", 18),
            (ConfigurationError("The DNS query name does not exist: " + private_detail), "dns_not_found", "none"),
            (ConfigurationError("The DNS response does not contain an answer to the question: " + private_detail), "dns_no_answer", "none"),
            (ConfigurationError("The resolution lifetime expired after 4.000 seconds: " + private_detail), "dns_timeout", "none"),
            (ConfigurationError("All nameservers failed to answer the query: REFUSED " + private_detail), "dns_other", "none"),
            (ServerSelectionTimeoutError("SSL handshake failed: " + private_detail), "tls", "none"),
            (NetworkTimeout("Connection timed out: " + private_detail), "network_timeout", "none"),
            (OperationFailure("Unexpected driver failure: " + private_detail, code=12345), "database", 12345),
        )
        for failure, category, code in cases:
            with self.subTest(category=category):
                self.database.ping_error = failure
                with self.assertLogs("ackra.api", level="WARNING") as captured:
                    response = self.client.get("/api/health")
                self.assertEqual(response.status_code, 503)
                self.assertEqual(len(captured.records), 1)
                record = captured.records[0]
                self.assertEqual(
                    record.getMessage(),
                    f"database_unavailable category={category} exception={type(failure).__name__} code={code}",
                )
                self.assertIsNone(record.exc_info)
                self.assertIsNone(record.stack_info)
                self.assertNotIn("private-", " ".join(captured.output))
                self.assertNotIn("mongodb", " ".join(captured.output))
                self.assertNotIn("private-", response.text)

    def test_application_deadline_logs_only_a_sanitized_timeout(self):
        self.database.ping_delay = 1
        with patch.object(api, "DB_TIMEOUT_SECONDS", 0.01):
            with self.assertLogs("ackra.api", level="WARNING") as captured:
                response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(captured.records[0].getMessage(),
                         "database_unavailable category=network_timeout exception=TimeoutError code=none")


if __name__ == "__main__":
    unittest.main()
