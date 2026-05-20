import logging
import tempfile
from pathlib import Path

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from services.export_service import CONTENT_TYPES, EXPORT_FUNCTIONS
from services.supabase_service import get_job

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer()

ALLOWED_FORMATS = {"glb", "obj", "stl", "fbx", "blend"}


@router.get("/status/{job_id}")
async def get_status(job_id: str):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/download/{job_id}/{fmt}")
async def download_model(job_id: str, fmt: str):
    if fmt not in ALLOWED_FORMATS:
        raise HTTPException(status_code=400, detail=f"Unsupported format. Use: {', '.join(ALLOWED_FORMATS)}")

    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["status"] != "done":
        raise HTTPException(status_code=400, detail="Job not complete")

    model_url = job.get("model_url")
    if not model_url:
        raise HTTPException(status_code=404, detail="Model URL not found")

    tmp_dir = Path(tempfile.mkdtemp(prefix=f"depthforge_dl_{job_id}_"))
    try:
        # Download GLB from Supabase Storage
        glb_path = tmp_dir / "model.glb"
        async with httpx.AsyncClient() as client:
            res = await client.get(model_url)
            res.raise_for_status()
            glb_path.write_bytes(res.content)

        if fmt == "glb":
            return FileResponse(
                path=str(glb_path),
                media_type=CONTENT_TYPES["glb"],
                filename=f"depthforge_{job_id[:8]}.glb",
                background=None,
            )

        export_fn = EXPORT_FUNCTIONS[fmt]
        out_path = export_fn(glb_path, tmp_dir)

        return FileResponse(
            path=str(out_path),
            media_type=CONTENT_TYPES[fmt],
            filename=f"depthforge_{job_id[:8]}.{fmt}",
        )
    except Exception as e:
        logger.exception(f"Download/export failed for job {job_id}: {e}")
        raise HTTPException(status_code=500, detail="Export failed")
