from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import (
    create_engine, Table, Column, String, Boolean, DateTime, MetaData
)
from sqlalchemy.pool import QueuePool
import os
import logging
import asyncio
import urllib
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid
from datetime import datetime, timezone
import requests

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ── Azure SQL connection ──────────────────────────────────────────────────────
_odbc_str = os.environ['AZURE_SQL_CONNECTION_STRING']
_params = urllib.parse.quote_plus(_odbc_str)
engine = create_engine(
    f"mssql+pyodbc:///?odbc_connect={_params}",
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

metadata = MetaData()

contact_submissions = Table(
    "contact_submissions", metadata,
    Column("id", String(36), primary_key=True),
    Column("name", String(255), nullable=False, default=""),
    Column("email", String(255), nullable=False),
    Column("race", String(255), nullable=False, default=""),
    Column("newsletter", Boolean, nullable=False, default=False),
    Column("email_sent", Boolean, nullable=False, default=False),
    Column("subscribed_to_kit", Boolean, nullable=False, default=False),
    Column("submitted_at", DateTime, nullable=False),
)

status_checks = Table(
    "status_checks", metadata,
    Column("id", String(36), primary_key=True),
    Column("client_name", String(255), nullable=False),
    Column("timestamp", DateTime, nullable=False),
)


def _create_tables():
    metadata.create_all(engine)
    logger.info("Database tables verified / created")


# ── Pydantic models ───────────────────────────────────────────────────────────

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactSubmission(BaseModel):
    name: str = ""
    email: str
    race: str = ""
    newsletter: bool = False


class ContactRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    email: str
    race: str = ""
    newsletter: bool = False
    email_sent: bool = False
    subscribed_to_kit: bool = False
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ── Email / newsletter config ─────────────────────────────────────────────────

SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
EMAIL_TO = os.environ.get("EMAIL_TO", "info@endurancesporttravel.com")
EMAIL_FROM = os.environ.get("EMAIL_FROM", SMTP_USER or "no-reply@endurancesporttravel.com")
KIT_API_KEY = os.environ.get("KIT_API_KEY", "")


# ── Sync DB helpers (called via asyncio.to_thread) ────────────────────────────

def _db_insert_contact(record: ContactRecord) -> str:
    with engine.connect() as conn:
        conn.execute(contact_submissions.insert().values(
            id=record.id,
            name=record.name,
            email=record.email,
            race=record.race,
            newsletter=record.newsletter,
            email_sent=record.email_sent,
            subscribed_to_kit=record.subscribed_to_kit,
            submitted_at=record.submitted_at,
        ))
        conn.commit()
    return record.id


def _db_update_contact(record_id: str, **kwargs):
    with engine.connect() as conn:
        conn.execute(
            contact_submissions.update()
            .where(contact_submissions.c.id == record_id)
            .values(**kwargs)
        )
        conn.commit()


def _db_insert_status(obj: StatusCheck):
    with engine.connect() as conn:
        conn.execute(status_checks.insert().values(
            id=obj.id,
            client_name=obj.client_name,
            timestamp=obj.timestamp,
        ))
        conn.commit()


def _db_get_all_status() -> list:
    with engine.connect() as conn:
        result = conn.execute(status_checks.select())
        return [dict(row._mapping) for row in result]


# ── Sync side-effect helpers ──────────────────────────────────────────────────

def _send_email_sync(msg, smtp_host, smtp_port, smtp_user, smtp_pass):
    server = smtplib.SMTP(smtp_host, smtp_port)
    server.ehlo()
    server.starttls()
    server.ehlo()
    server.login(smtp_user, smtp_pass)
    server.send_message(msg)
    server.quit()


def _subscribe_to_kit(email_address, first_name, api_key):
    requests.post(
        "https://api.kit.com/v4/subscribers",
        headers={"X-Kit-Api-Key": api_key},
        json={
            "email_address": email_address,
            "first_name": first_name or None,
            "fields": {"source": "EST-website"},
        },
        timeout=10,
    )


# ── App + routes ──────────────────────────────────────────────────────────────

app = FastAPI()
api_router = APIRouter(prefix="/api")


@app.on_event("startup")
async def startup():
    await asyncio.to_thread(_create_tables)


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.get("/contact")
async def contact_config():
    return {"status": "active", "endpoint": "/api/contact", "method": "POST"}


@api_router.post("/contact")
async def submit_contact(submission: ContactSubmission):
    record = ContactRecord(
        name=submission.name,
        email=submission.email,
        race=submission.race,
        newsletter=submission.newsletter,
    )

    record_id = await asyncio.to_thread(_db_insert_contact, record)

    if submission.newsletter and KIT_API_KEY:
        try:
            first_name = submission.name.split()[0] if submission.name else None
            await asyncio.to_thread(_subscribe_to_kit, submission.email, first_name, KIT_API_KEY)
            await asyncio.to_thread(_db_update_contact, record_id, subscribed_to_kit=True)
        except Exception as exc:
            logger.error("Failed to subscribe to Kit: %s", exc)

    if not SMTP_USER or not SMTP_PASS:
        logger.warning("SMTP not configured — submission saved to DB only")
        return {"message": "Inbox updated. We will be in touch within one business day."}

    msg = MIMEMultipart()
    msg["From"] = EMAIL_FROM
    msg["To"] = EMAIL_TO
    msg["Subject"] = f"Start Planning: {submission.name} — {submission.race}"
    body = (
        f"Name: {submission.name}\n"
        f"Email: {submission.email}\n"
        f"Race: {submission.race}\n"
        f"Newsletter: {submission.newsletter}\n"
    )
    msg.attach(MIMEText(body, "plain"))

    try:
        await asyncio.to_thread(
            _send_email_sync, msg, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
        )
        await asyncio.to_thread(_db_update_contact, record_id, email_sent=True)
    except Exception as exc:
        logger.error("Failed to send email: %s", exc)

    return {"message": "Inbox updated. We will be in touch within one business day."}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    obj = StatusCheck(client_name=input.client_name)
    await asyncio.to_thread(_db_insert_status, obj)
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await asyncio.to_thread(_db_get_all_status)
    return [StatusCheck(**row) for row in rows]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
