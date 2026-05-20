import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import download, generate

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DepthForge API",
    version="1.0.0",
    description="Image-to-3D generation powered by TripoSR (MIT licensed).",
    docs_url="/docs",
    redoc_url=None,
)

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(generate.router)
app.include_router(download.router)


@app.get("/health")
async def health():
    return {"status": "ok", "model": os.getenv("TRIPOSR_MODEL", "stabilityai/TripoSR")}


@app.on_event("startup")
async def startup():
    logger.info("DepthForge API starting up")
    # Warm up TripoSR model in background
    import asyncio

    async def _warm():
        try:
            from services.triposr_service import get_model
            await asyncio.to_thread(get_model)
            logger.info("TripoSR warm-up complete")
        except Exception as e:
            logger.warning(f"TripoSR warm-up failed (will retry on first request): {e}")

    asyncio.create_task(_warm())
