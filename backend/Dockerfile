FROM runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04

WORKDIR /app

# Install Blender for FBX/BLEND export
RUN apt-get update && apt-get install -y \
    blender \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies individually to isolate failures
RUN pip install --no-cache-dir fastapi==0.111.0 uvicorn[standard]==0.30.1 python-multipart==0.0.9 python-jose[cryptography]==3.3.0 httpx==0.27.0 pydantic==2.7.4 pydantic-settings==2.3.3
RUN pip install --no-cache-dir torch==2.2.0 torchvision==0.17.2
RUN pip install --no-cache-dir git+https://github.com/VAST-AI-Research/TripoSR.git
RUN pip install --no-cache-dir rembg==2.0.57 onnxruntime==1.18.0
RUN pip install --no-cache-dir trimesh==4.4.0 pymeshlab pillow==10.3.0 numpy==1.26.4 scipy==1.13.1 pygltflib==1.16.2
RUN pip install --no-cache-dir supabase==2.5.1 boto3==1.34.144 runpod==1.6.2

# Copy application code
COPY . .

# Pre-download TripoSR model weights during build (optional — can also lazy-load)
# RUN python -c "from services.triposr_service import get_model; get_model()"

ENV TRIPOSR_DEVICE=cuda
ENV TEMP_DIR=/tmp/depthforge
ENV PYTHONUNBUFFERED=1

# For RunPod serverless
CMD ["python", "runpod_handler.py"]

# For local FastAPI development, override with:
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
