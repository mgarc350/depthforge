"""
TripoSR image-to-3D generation service.
TripoSR is MIT licensed by Stability AI and Tripo AI.
https://github.com/VAST-AI-Research/TripoSR
"""
import os
import logging
from pathlib import Path
from typing import Callable, Optional

import torch
from PIL import Image

logger = logging.getLogger(__name__)

_model = None
_model_device = os.getenv("TRIPOSR_DEVICE", "cuda")
_model_id = os.getenv("TRIPOSR_MODEL", "stabilityai/TripoSR")


def get_model():
    global _model
    if _model is None:
        logger.info(f"Loading TripoSR from {_model_id} on {_model_device}")
        from tsr.system import TSR  # type: ignore

        _model = TSR.from_pretrained(
            _model_id,
            weight_name="model.ckpt",
            config_name="config.yaml",
        )
        _model = _model.to(_model_device)
        _model.renderer.set_chunk_size(8192)
        logger.info("TripoSR loaded")
    return _model


def _enhance_image(image: Image.Image) -> Image.Image:
    """Basic pre-processing: resize to power-of-2 and increase sharpness."""
    from PIL import ImageEnhance, ImageFilter

    target = 512
    w, h = image.size
    scale = target / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    image = image.resize((new_w, new_h), Image.LANCZOS)

    image = ImageEnhance.Sharpness(image).enhance(1.3)
    image = ImageEnhance.Contrast(image).enhance(1.1)
    return image


def generate_mesh(
    image: Image.Image,
    output_path: Path,
    quality: str = "standard",
    enhance: bool = True,
    progress_cb: Optional[Callable[[int, str], None]] = None,
) -> Path:
    """
    Run TripoSR to generate a 3D mesh from an image.
    Returns the path to the output GLB file.
    """
    def _progress(pct: int, msg: str):
        if progress_cb:
            progress_cb(pct, msg)

    if enhance:
        _progress(15, "Enhancing image")
        image = _enhance_image(image)

    model = get_model()
    _progress(20, "Encoding image")

    mc_resolution_map = {
        "draft": 64,
        "standard": 128,
        "4k": 256,
    }
    mc_resolution = mc_resolution_map.get(quality, 128)

    with torch.no_grad():
        _progress(30, "Running TripoSR")
        scene_codes = model([image], device=_model_device)

        _progress(55, "Extracting mesh")
        meshes = model.extract_mesh(
            scene_codes,
            has_vertex_color=False,
            resolution=mc_resolution,
        )

    mesh = meshes[0]

    glb_path = output_path / "model.glb"
    _progress(80, "Saving GLB")
    mesh.export(str(glb_path))
    logger.info(f"GLB saved to {glb_path}")

    return glb_path
