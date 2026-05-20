FROM runpod/pytorch:2.3.1-py3.11-cuda12.1.1-devel-ubuntu22.04

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

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

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
