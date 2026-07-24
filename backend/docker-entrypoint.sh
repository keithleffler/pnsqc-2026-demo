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

# Ensure an admin user exists. The CLI errors if the user is already present
# (e.g. on a warm volume), which is expected and swallowed — this keeps the step
# idempotent across restarts.
echo "[entrypoint] Ensuring admin user (${ADMIN_EMAIL:-admin@example.com})..."
npx medusa user -e "${ADMIN_EMAIL:-admin@example.com}" -p "${ADMIN_PASSWORD:-supersecret}" \
  || echo "[entrypoint] admin user already exists (or creation skipped)"

echo "[entrypoint] Starting Medusa server on :9000 ..."
exec npm run start
