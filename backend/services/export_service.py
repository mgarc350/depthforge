"""
Export GLB mesh to OBJ, STL, FBX, and BLEND formats.
Uses trimesh for GLB/OBJ/STL and Blender subprocess for FBX/BLEND.
"""
import subprocess
import logging
import shutil
from pathlib import Path

import trimesh

logger = logging.getLogger(__name__)


def export_obj(glb_path: Path, output_dir: Path) -> Path:
    mesh = trimesh.load(str(glb_path), force="mesh")
    out = output_dir / "model.obj"
    mesh.export(str(out), file_type="obj")
    logger.info(f"OBJ exported: {out}")
    return out


def export_stl(glb_path: Path, output_dir: Path) -> Path:
    mesh = trimesh.load(str(glb_path), force="mesh")
    out = output_dir / "model.stl"
    mesh.export(str(out), file_type="stl")
    logger.info(f"STL exported: {out}")
    return out


def export_fbx(glb_path: Path, output_dir: Path) -> Path:
    """Export to FBX via Blender headless. Requires Blender installed."""
    out = output_dir / "model.fbx"
    blender_script = f"""
import bpy
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"{glb_path}")
bpy.ops.export_scene.fbx(
    filepath=r"{out}",
    use_selection=False,
    embed_textures=True,
    path_mode='COPY',
)
"""
    script_path = output_dir / "_export_fbx.py"
    script_path.write_text(blender_script)

    result = subprocess.run(
        ["blender", "--background", "--python", str(script_path)],
        capture_output=True,
        text=True,
        timeout=120,
    )

    script_path.unlink(missing_ok=True)

    if result.returncode != 0:
        logger.error(f"Blender FBX export failed: {result.stderr}")
        raise RuntimeError("FBX export failed")

    logger.info(f"FBX exported: {out}")
    return out


def export_blend(glb_path: Path, output_dir: Path) -> Path:
    """Export to BLEND via Blender headless."""
    out = output_dir / "model.blend"
    blender_script = f"""
import bpy
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=r"{glb_path}")
bpy.ops.wm.save_as_mainfile(filepath=r"{out}")
"""
    script_path = output_dir / "_export_blend.py"
    script_path.write_text(blender_script)

    result = subprocess.run(
        ["blender", "--background", "--python", str(script_path)],
        capture_output=True,
        text=True,
        timeout=120,
    )

    script_path.unlink(missing_ok=True)

    if result.returncode != 0:
        logger.error(f"Blender BLEND export failed: {result.stderr}")
        raise RuntimeError("BLEND export failed")

    logger.info(f"BLEND exported: {out}")
    return out


EXPORT_FUNCTIONS = {
    "glb": lambda glb, out: glb,
    "obj": export_obj,
    "stl": export_stl,
    "fbx": export_fbx,
    "blend": export_blend,
}

CONTENT_TYPES = {
    "glb": "model/gltf-binary",
    "obj": "text/plain",
    "stl": "model/stl",
    "fbx": "application/octet-stream",
    "blend": "application/octet-stream",
}
