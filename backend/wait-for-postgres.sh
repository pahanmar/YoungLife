#!/bin/sh
# backend/wait-for-postgres.sh
set -e

host=${1:-postgres}
port=${2:-5432}
timeout=${3:-60}

echo "Waiting for postgres $host:$port (timeout ${timeout}s)..."
start=$(date +%s)

while :
do
  if nc -z "$host" "$port" 2>/dev/null; then
    echo "Postgres is available"
    exit 0
  fi
  now=$(date +%s)
  if [ $((now - start)) -ge "$timeout" ]; then
    echo "Timeout waiting for postgres"
    exit 1
  fi
  sleep 1
done