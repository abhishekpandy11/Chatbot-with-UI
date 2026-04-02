# Stage 1: Builder
FROM python:3.11-slim as builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Runner
FROM python:3.11-slim

WORKDIR /app

# Copy only the installed dependencies from the builder stage
COPY --from=builder /install /usr/local

# ✅ Copy everything from backend folder into /app 
# (Ensures .env and app/ are correctly placed)
COPY backend/ ./

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# ✅ Ensure it binds to 0.0.0.0 for external access
# Use shell form to correctly expand $PORT
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}