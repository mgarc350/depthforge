"""
RunPod serverless handler for DepthForge GPU jobs.
Deploy this as a RunPod Serverless endpoint.
"""
import base64
import io
import json
import logging
import os
import shutil
import tempfile
import uuid
from pathlib import Path

import runpod
from PIL import Image

from services import background_removal, supabase_service, triposr_service
from models.job import CREDIT_COSTS, FeatureToggles, GenerateSettings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def handler(event: dict) -> dict:
    """
    RunPod job handler. Expects event["input"] with:
      - image_b64: base64-encoded image
      - job_id: UUID string
      - settings: dict
      - features: dict
    """
    job_input = event.get("input", {})
    job_id = job_input.get("job_id", str(uuid.uuid4()))

    tmp_dir = Path(tempfile.mkdtemp(prefix=f"depthforge_{job_id}_"))

    try:
        # Decode image
        image_b64 = job_input["image_b64"]
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        settings = GenerateSettings(**job_input.get("settings", {}))
        features = FeatureToggles(**job_input.get("features", {}))

        supabase_service.update_job(job_id, status="processing", progress=5, message="Starting")

        # Background removal
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

        return {"job_id": job_id, "status": "done", "model_url": model_url}

    except Exception as e:
        logger.exception(f"Job {job_id} failed: {e}")
        supabase_service.update_job(job_id, status="error", message=str(e))
        return {"job_id": job_id, "status": "error", "error": str(e)}

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        logger.info(f"Temp files deleted for job {job_id}")


if __name__ == "__main__":
    runpod.serverless.start({"handler": handler})
