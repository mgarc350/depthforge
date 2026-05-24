FROM runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir fastapi==0.111.0 uvicorn[standard]==0.30.1 python-multipart==0.0.9 python-jose[cryptography]==3.3.0 httpx==0.27.0 pydantic==2.7.4 pydantic-settings==2.3.3

RUN git clone https://github.com/VAST-AI-Research/TripoSR.git /app/TripoSR
RUN apt-get update && apt-get install -y cmake build-essential && pip install --no-cache-dir git+https://github.com/tatsy/torchmcubes.git
ENV PYTHONPATH=/app/TripoSR:$PYTHONPATH
RUN pip install --no-cache-dir einops omegaconf transformers accelerate diffusers huggingface_hub safetensors

RUN pip install --no-cache-dir rembg==2.0.57 onnxruntime==1.18.0

RUN pip install --no-cache-dir trimesh==4.4.0 pymeshlab pillow==10.3.0 numpy==1.26.4 scipy==1.13.1 pygltflib==1.16.2

RUN pip install --no-cache-dir supabase==2.5.1 boto3==1.34.144 runpod==1.6.2

COPY . .

ENV TRIPOSR_DEVICE=cuda
ENV TEMP_DIR=/tmp/depthforge
ENV PYTHONUNBUFFERED=1

CMD ["python", "runpod_handler.py"]
# v5
