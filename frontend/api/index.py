import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

MONGO_URL = os.environ.get("MONGO_URL", "")
DB_NAME = os.environ.get("DB_NAME", "")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

client = AsyncIOMotorClient(MONGO_URL) if MONGO_URL else None
db = client[DB_NAME] if client is not None and DB_NAME else None

app = FastAPI(title="Ackra AI API")

_bearer = HTTPBearer(auto_error=False)


async def _require_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> None:
    if ADMIN_TOKEN and (creds is None or creds.credentials != ADMIN_TOKEN):
        raise HTTPException(status_code=401, detail="Unauthorized")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContactSubmissionIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    company: Optional[str] = Field(default=None, max_length=160)
    message: str = Field(..., min_length=1, max_length=4000)


class ContactSubmission(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    created_at: str


@app.get("/api/")
async def root():
    return {"service": "ackra-ai", "status": "ok"}


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "db": bool(db is not None),
        "time": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/contact", response_model=ContactSubmission)
async def create_contact(payload: ContactSubmissionIn):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": payload.email,
        "phone": (payload.phone or "").strip() or None,
        "company": (payload.company or "").strip() or None,
        "message": payload.message.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.contacts.insert_one(doc)
    doc.pop("_id", None)
    return ContactSubmission(**doc)


@app.get("/api/contact", response_model=List[ContactSubmission])
async def list_contacts(_: None = Depends(_require_admin)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    cursor = db.contacts.find({}, {"_id": 0}).sort("created_at", -1).limit(500)
    items = await cursor.to_list(length=500)
    return [ContactSubmission(**i) for i in items]


@app.delete("/api/contact/{contact_id}")
async def delete_contact(contact_id: str, _: None = Depends(_require_admin)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    res = await db.contacts.delete_one({"id": contact_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": contact_id}
