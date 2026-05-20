import json
import logging
import os
import shutil
import tempfile
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from models.job import CREDIT_COSTS, FeatureToggles, GenerateSettings
from services import background_removal, supabase_service, triposr_service
from services.clerk_service import get_user_email, is_admin_email

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer()

MAX_IMAGE_BYTES = int(os.getenv("MAX_IMAGE_SIZE_MB", "20")) * 1024 * 1024


@dataclass
class UserContext:
    user_id: str
    email: Optional[str]
    is_admin: bool


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserContext:
    """Verify Clerk JWT and return UserContext with admin flag."""
    import httpx
    from jose import jwt

    token = credentials.credentials
    try:
        issuer = os.environ["CLERK_ISSUER"]
        async with httpx.AsyncClient() as client:
            jwks_res = await client.get(f"{issuer}/.well-known/jwks.json")
            jwks = jwks_res.json()

        payload = jwt.decode(token, jwks, algorithms=["RS256"], options={"verify_aud": False})
        user_id: str = payload["sub"]
    except Exception as e:
        logger.warning(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    email = await get_user_email(user_id)
    return UserContext(user_id=user_id, email=email, is_admin=is_admin_email(email))


@router.post("/generate")
async def generate(
    image_front: UploadFile = File(None),
    image_side: UploadFile = File(None),
    image_back: UploadFile = File(None),
    image_top: UploadFile = File(None),
    settings: str = Form(default="{}"),
    features: str = Form(default="{}"),
    texture_prompt: str = Form(default=""),
    ctx: UserContext = Depends(verify_token),
):
    settings_obj = GenerateSettings(**json.loads(settings))
    features_obj = FeatureToggles(**json.loads(features))

    primary = image_front or image_side or image_back or image_top
    if primary is None:
        raise HTTPException(status_code=400, detail="At least one image is required")

    content = await primary.read()
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image too large (max 20MB)")

    credit_cost = CREDIT_COSTS[settings_obj.quality]
    if features_obj.pbr_textures:
        credit_cost += 1

    # Admins bypass all credit checks — unlimited free generations
    if not ctx.is_admin:
        if not supabase_service.deduct_credits(ctx.user_id, credit_cost):
            raise HTTPException(status_code=402, detail="Insufficient credits")
    else:
        logger.info(f"Admin generation by {ctx.email} — skipping credit deduction")
        credit_cost = 0

    job_id = str(uuid.uuid4())
    supabase_service.create_job(job_id, ctx.user_id, credit_cost)

    import asyncio
    asyncio.create_task(_run_generation(job_id, content, settings_obj, features_obj))

    return {"job_id": job_id}


async def _run_generation(
    job_id: str,
    image_bytes: bytes,
    settings: GenerateSettings,
    features: FeatureToggles,
):
    tmp_dir = Path(tempfile.mkdtemp(prefix=f"depthforge_{job_id}_"))
    try:
        supabase_service.update_job(job_id, status="processing", progress=5, message="Starting")

        from PIL import Image
        import io

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        if features.background_removal:
            supabase_service.update_job(job_id, progress=10, message="Removing background")
            image = background_removal.remove_background(image)
            image = background_removal.to_white_background(image)

        def progress_cb(pct: int, msg: str):
            supabase_service.update_job(job_id, progress=pct, message=msg)

        glb_path = triposr_service.generate_mesh(
            image=image,
            output_path=tmp_dir,
            quality=settings.quality.value,
            enhance=features.image_enhancement,
            progress_cb=progress_cb,
        )

        supabase_service.update_job(job_id, progress=90, message="Uploading model")
        model_url = supabase_service.upload_model(job_id, glb_path)

        supabase_service.update_job(
            job_id,
            status="done",
            progress=100,
            message="Done",
            model_url=model_url,
        )
        logger.info(f"Job {job_id} completed")

    except Exception as e:
        logger.exception(f"Job {job_id} failed: {e}")
        supabase_service.update_job(job_id, status="error", message=str(e))
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        logger.info(f"Temp files deleted for job {job_id}")
