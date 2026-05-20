import os
import logging
from datetime import datetime, timezone
from pathlib import Path

from supabase import create_client, Client

logger = logging.getLogger(__name__)

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        _client = create_client(url, key)
    return _client


BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "models")


def create_job(job_id: str, user_id: str, credits_used: int) -> None:
    sb = get_client()
    sb.table("jobs").insert({
        "id": job_id,
        "user_id": user_id,
        "status": "queued",
        "progress": 0,
        "message": "Queued",
        "credits_used": credits_used,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }).execute()


def update_job(job_id: str, **fields) -> None:
    sb = get_client()
    sb.table("jobs").update(fields).eq("id", job_id).execute()


def get_job(job_id: str) -> dict | None:
    sb = get_client()
    res = sb.table("jobs").select("*").eq("id", job_id).single().execute()
    return res.data


def upload_model(job_id: str, glb_path: Path) -> str:
    """Upload GLB to Supabase Storage and return public URL."""
    sb = get_client()
    storage_path = f"{job_id}/model.glb"

    with open(glb_path, "rb") as f:
        sb.storage.from_(BUCKET).upload(
            path=storage_path,
            file=f,
            file_options={"content-type": "model/gltf-binary"},
        )

    res = sb.storage.from_(BUCKET).get_public_url(storage_path)
    logger.info(f"Uploaded GLB to {res}")
    return res


def deduct_credits(user_id: str, amount: int) -> bool:
    """Deduct credits from user. Returns False if insufficient balance."""
    sb = get_client()
    res = sb.rpc("deduct_credits", {"p_user_id": user_id, "p_amount": amount}).execute()
    return res.data is True
