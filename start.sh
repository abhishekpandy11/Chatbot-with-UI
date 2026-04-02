#!/bin/sh

# Railway assigned port ko read karein, ya default 8000 use karein
PORT=${PORT:-8000}

echo "🚀 Starting Uvicorn on port $PORT..."
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
