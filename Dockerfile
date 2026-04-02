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
COPY --from=builder /install /usr/local
COPY backend/ ./
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# ✅ FORCE HOST 0.0.0.0 FOR EXTERNAL ACCESS
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]