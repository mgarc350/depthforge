from PIL import Image
from rembg import remove, new_session
import io
import logging

logger = logging.getLogger(__name__)

_session = None


def get_session():
    global _session
    if _session is None:
        _session = new_session("u2net")
    return _session


def remove_background(image: Image.Image) -> Image.Image:
    """Remove background from PIL image, returning RGBA image."""
    session = get_session()
    img_bytes = io.BytesIO()
    image.save(img_bytes, format="PNG")
    img_bytes.seek(0)

    result_bytes = remove(img_bytes.read(), session=session)
    result = Image.open(io.BytesIO(result_bytes)).convert("RGBA")
    logger.info(f"Background removed: {result.size}")
    return result


def to_white_background(image: Image.Image) -> Image.Image:
    """Composite RGBA image onto white background for models that require RGB."""
    if image.mode != "RGBA":
        return image
    bg = Image.new("RGBA", image.size, (255, 255, 255, 255))
    bg.paste(image, mask=image.split()[3])
    return bg.convert("RGB")
