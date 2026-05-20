from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum


class ModelType(str, Enum):
    standard = "standard"
    lowpoly = "lowpoly"


class Quality(str, Enum):
    draft = "draft"
    standard = "standard"
    high = "4k"


class Pose(str, Enum):
    none = "none"
    a_pose = "a-pose"
    t_pose = "t-pose"


class JobStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    done = "done"
    error = "error"


class GenerateSettings(BaseModel):
    model_type: ModelType = ModelType.standard
    quality: Quality = Quality.standard
    pose: Pose = Pose.none


class FeatureToggles(BaseModel):
    image_enhancement: bool = True
    pbr_textures: bool = False
    auto_remesh: bool = True
    background_removal: bool = True
    auto_size: bool = True


class GenerateJobRequest(BaseModel):
    settings: GenerateSettings = Field(default_factory=GenerateSettings)
    features: FeatureToggles = Field(default_factory=FeatureToggles)
    texture_prompt: str = Field(default="", max_length=600)


class JobStatusResponse(BaseModel):
    id: str
    status: JobStatus
    progress: int = Field(ge=0, le=100)
    message: str = ""
    model_url: Optional[str] = None
    created_at: str
    credits_used: int = 0


CREDIT_COSTS = {
    Quality.draft: 1,
    Quality.standard: 2,
    Quality.high: 4,
}
