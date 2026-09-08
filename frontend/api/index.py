import asyncio
import hmac
import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from pymongo.errors import PyMongoError

MONGO_URL = os.environ.get("MONGO_URL", "")
DB_NAME = os.environ.get("DB_NAME", "")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

DB_TIMEOUT_SECONDS = 5
client = (
    AsyncIOMotorClient(
        MONGO_URL,
        serverSelectionTimeoutMS=4000,
        connectTimeoutMS=4000,
        socketTimeoutMS=5000,
    )
    if MONGO_URL
    else None
)
db = client[DB_NAME] if client is not None and DB_NAME else None

app = FastAPI(title="Ackra AI API")

_bearer = HTTPBearer(auto_error=False)


async def _require_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> None:
    if not ADMIN_TOKEN or (
        creds is None
        or not hmac.compare_digest(
            creds.credentials.encode("utf-8"), ADMIN_TOKEN.encode("utf-8")
        )
    ):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"},
        )


def _require_db():
    if db is None:
        raise HTTPException(status_code=503, detail="Service temporarily unavailable")
    return db


async def _db_call(operation):
    try:
        return await asyncio.wait_for(operation, timeout=DB_TIMEOUT_SECONDS)
    except (PyMongoError, asyncio.TimeoutError) as exc:
        # Driver errors can contain connection details; keep them out of responses.
        raise HTTPException(
            status_code=503, detail="Service temporarily unavailable"
        ) from exc


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ackra.ai", "https://www.ackra.ai"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContactSubmissionIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    company: Optional[str] = Field(default=None, max_length=160)
    message: str = Field(..., min_length=1, max_length=4000)
    # Honeypot: real users never fill this hidden field. Bots that do are
    # silently accepted (fake 200) and never written to the database.
    website: Optional[str] = Field(default=None, max_length=200)

    @field_validator("phone", "company", "website")
    @classmethod
    def empty_optional_fields(cls, value):
        return value or None


class ContactSubmission(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    created_at: str


class ContactPage(BaseModel):
    items: List[ContactSubmission]
    total: int
    page: int
    page_size: int


@app.middleware("http")
async def private_api_responses(request, call_next):
    response = await call_next(request)
    if request.url.path == "/api" or request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
    return response


@app.get("/api", include_in_schema=False)
@app.get("/api/")
async def root():
    return {"service": "ackra-ai", "status": "ok"}


@app.get("/api/health")
async def health():
    try:
        await _db_call(_require_db().command("ping"))
    except HTTPException:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unavailable",
                "db": False,
                "time": datetime.now(timezone.utc).isoformat(),
            },
        )
    return {
        "status": "healthy",
        "db": True,
        "time": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/admin/check")
async def admin_check(_: None = Depends(_require_admin)):
    # DB-free token validation for the admin gate.
    return {"ok": True}


@app.post("/api/contact", response_model=ContactSubmission)
async def create_contact(payload: ContactSubmissionIn):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": payload.email,
        "phone": (payload.phone or "").strip() or None,
        "company": (payload.company or "").strip() or None,
        "message": payload.message.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    # Honeypot tripped: pretend success without storing, so bots get no signal.
    if (payload.website or "").strip():
        return ContactSubmission(**doc)
    await _db_call(_require_db().contacts.insert_one(doc))
    doc.pop("_id", None)
    return ContactSubmission(**doc)


@app.get("/api/contact", response_model=List[ContactSubmission])
async def list_contacts(_: None = Depends(_require_admin)):
    cursor = (
        _require_db().contacts.find({}, {"_id": 0})
        .sort([("created_at", -1), ("id", -1)])
        .limit(500)
    )
    items = await _db_call(cursor.to_list(length=500))
    return [ContactSubmission(**i) for i in items]


@app.get("/api/admin/contacts", response_model=ContactPage)
async def page_contacts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
    _: None = Depends(_require_admin),
):
    contacts = _require_db().contacts
    total = await _db_call(contacts.count_documents({}))
    # A deletion can empty the last page. Return the closest remaining page.
    current_page = min(page, max(1, (total + page_size - 1) // page_size))
    cursor = (
        contacts.find({}, {"_id": 0})
        .sort([("created_at", -1), ("id", -1)])
        .skip((current_page - 1) * page_size)
        .limit(page_size)
    )
    items = await _db_call(cursor.to_list(length=page_size))
    return ContactPage(
        items=items, total=total, page=current_page, page_size=page_size
    )


@app.delete("/api/contact/{contact_id}")
async def delete_contact(contact_id: str, _: None = Depends(_require_admin)):
    res = await _db_call(_require_db().contacts.delete_one({"id": contact_id}))
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": contact_id}
