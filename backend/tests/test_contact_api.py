import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8000").rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Health/Root endpoints
def test_root(api):
    r = api.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("service") == "ackra-ai"
    assert data.get("status") == "ok"


def test_health(api):
    r = api.get(f"{BASE_URL}/api/health")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "healthy"
    assert "time" in data


# Contact validation tests
def test_contact_missing_fields(api):
    r = api.post(f"{BASE_URL}/api/contact", json={"name": "x"})
    assert r.status_code == 422


def test_contact_invalid_email(api):
    payload = {"name": "TEST_user", "email": "not-an-email", "message": "hi"}
    r = api.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 422


# CRUD pattern: Create -> List -> Delete -> verify 404
created_ids = []


def test_create_contact_valid(api):
    payload = {
        "name": "TEST_user_pytest",
        "email": "test_pytest@example.com",
        "phone": "+1 555 0100",
        "company": "TEST_co",
        "message": "Hello from pytest"
    }
    r = api.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "id" in data and isinstance(data["id"], str)
    assert "created_at" in data
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert data["message"] == payload["message"]
    assert "_id" not in data
    created_ids.append(data["id"])


def test_list_contacts_contains_created(api):
    r = api.get(f"{BASE_URL}/api/contact")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    # No _id leakage
    for it in items:
        assert "_id" not in it
        assert "id" in it
        assert "created_at" in it
    # sorted desc by created_at
    if len(items) >= 2:
        ts = [i["created_at"] for i in items]
        assert ts == sorted(ts, reverse=True)
    # Created id present
    ids = [i["id"] for i in items]
    assert created_ids[0] in ids


def test_delete_contact_unknown(api):
    r = api.delete(f"{BASE_URL}/api/contact/nonexistent-id-xyz")
    assert r.status_code == 404


def test_delete_contact_existing(api):
    assert created_ids, "Need a created contact"
    cid = created_ids[0]
    r = api.delete(f"{BASE_URL}/api/contact/{cid}")
    assert r.status_code == 200
    # Verify removed
    r2 = api.get(f"{BASE_URL}/api/contact")
    ids = [i["id"] for i in r2.json()]
    assert cid not in ids
    # Second delete should be 404
    r3 = api.delete(f"{BASE_URL}/api/contact/{cid}")
    assert r3.status_code == 404
