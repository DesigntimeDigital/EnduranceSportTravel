from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
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

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


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


SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
EMAIL_TO = os.environ.get("EMAIL_TO", "info@endurancesporttravel.com")
EMAIL_FROM = os.environ.get("EMAIL_FROM", SMTP_USER or "no-reply@endurancesporttravel.com")
KIT_API_KEY = os.environ.get("KIT_API_KEY", "")


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
    doc = record.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    insert_result = await db.contact_submissions.insert_one(doc)
    record_id = insert_result.inserted_id

    if submission.newsletter and KIT_API_KEY:
        try:
            first_name = submission.name.split()[0] if submission.name else None
            await asyncio.to_thread(
                _subscribe_to_kit, submission.email, first_name, KIT_API_KEY
            )
            await db.contact_submissions.find_one_and_update(
                {"_id": record_id}, {"$set": {"subscribed_to_kit": True}}
            )
        except Exception as exc:
            logger.error("Failed to subscribe to Kit: %s", exc)

    if not SMTP_USER or not SMTP_PASS:
        logger.warning("SMTP not configured — submission saved to DB only")
        return {"message": "Inbox updated. We will be in touch within one business day."}

    msg = MIMEMultipart()
    msg["From"] = EMAIL_FROM
    msg["To"] = EMAIL_TO
    msg["Subject"] = f"Start Planning: {submission.name} — {submission.race}"
    body = f"""Name: {submission.name}
Email: {submission.email}
Race: {submission.race}
Newsletter: {submission.newsletter}
"""
    msg.attach(MIMEText(body, "plain"))

    try:
        await asyncio.to_thread(
            _send_email_sync, msg, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
        )
        await db.contact_submissions.find_one_and_update(
            {"_id": record_id}, {"$set": {"email_sent": True}}
        )
    except Exception as exc:
        logger.error("Failed to send email: %s", exc)

    return {"message": "Inbox updated. We will be in touch within one business day."}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
