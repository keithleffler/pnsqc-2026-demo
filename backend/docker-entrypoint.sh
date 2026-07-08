#!/bin/sh
# Entrypoint for the built Medusa server (cwd = /app/.medusa/server).
# Idempotent: safe to run on every container start.
set -e

cd /app/.medusa/server

echo "[entrypoint] Running database migrations..."
npx medusa db:migrate

echo "[entrypoint] Bootstrapping store data (seed-if-empty, US region, pin key)..."
# Compiled script path inside the built server. Non-fatal if it fails so the
# server still starts and the failure is visible in logs.
npx medusa exec ./src/scripts/bootstrap.js \
  || echo "[entrypoint] WARNING: bootstrap step failed; continuing to start server"

echo "[entrypoint] Starting Medusa server on :9000 ..."
exec npm run start
