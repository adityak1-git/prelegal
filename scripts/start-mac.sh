#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Building Prelegal Docker image..."
docker build -t prelegal "$PROJECT_DIR"

echo "Removing any existing container..."
docker stop prelegal 2>/dev/null || true
docker rm prelegal 2>/dev/null || true

echo "Starting Prelegal container..."
docker run -d \
  --name prelegal \
  -p 8000:8000 \
  --env-file "$PROJECT_DIR/.env" \
  prelegal

echo "Prelegal is running at http://localhost:8000"
