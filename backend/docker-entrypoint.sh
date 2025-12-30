#!/usr/bin/env bash
set -e

# default host/port
: "${POSTGRES_HOST:=postgres}"
: "${POSTGRES_PORT:=5432}"

echo "[entrypoint] waiting for Postgres at ${POSTGRES_HOST}:${POSTGRES_PORT}..."
until nc -z ${POSTGRES_HOST} ${POSTGRES_PORT}; do
  sleep 0.5
done
echo "[entrypoint] Postgres is up"

# generate Prisma client
echo "[entrypoint] prisma generate..."
npx prisma generate || echo "[entrypoint] prisma generate failed (continuing)"

# apply migrations if any
echo "[entrypoint] applying migrations..."
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  npx prisma migrate deploy || echo "[entrypoint] migrate deploy returned non-zero (continuing)"
else
  echo "[entrypoint] no migrations folder or empty — skipping migrate deploy"
fi

# run seed: prefer `npx prisma db seed`, fallback to prisma/seed.js or npm run seed
echo "[entrypoint] running seed..."
if npx prisma db seed 2>/dev/null; then
  echo "[entrypoint] prisma db seed executed"
else
  if [ -f "./prisma/seed.js" ]; then
    node ./prisma/seed.js || echo "[entrypoint] node prisma/seed.js returned non-zero (continuing)"
  elif npm run | grep -q " seed"; then
    npm run seed || echo "[entrypoint] npm run seed returned non-zero (continuing)"
  else
    echo "[entrypoint] no seed found — skipping seed"
  fi
fi

echo "[entrypoint] starting app..."
exec "$@"