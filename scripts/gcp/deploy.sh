#!/usr/bin/env bash
set -Eeuo pipefail

IMAGE="${1:?Usage: deploy.sh IMAGE}"
APP_DIR="${APP_DIR:-/opt/zanacrm}"
HOST_PORT="${ZANACRM_HOST_PORT:-3000}"
CONTAINER_NAME="${ZANACRM_CONTAINER_NAME:-zanacrm-web}"

cd "$APP_DIR"

if [[ ! -f ".env.production" ]]; then
  echo "Missing $APP_DIR/.env.production" >&2
  exit 1
fi

previous_image="$(docker inspect --format='{{.Config.Image}}' "$CONTAINER_NAME" 2>/dev/null || true)"

cat > .env <<EOF
ZANACRM_IMAGE=$IMAGE
ZANACRM_HOST_PORT=$HOST_PORT
EOF

echo "Pulling $IMAGE"
docker compose -f docker-compose.prod.yml pull web

echo "Starting $CONTAINER_NAME"
docker compose -f docker-compose.prod.yml up -d web

echo "Waiting for health check"
for attempt in {1..20}; do
  if curl -fsS "http://127.0.0.1:${HOST_PORT}/api/health" >/dev/null; then
    docker image prune -f >/dev/null || true
    echo "Deployment healthy"
    exit 0
  fi
  sleep 3
done

echo "Deployment failed health check" >&2

if [[ -n "$previous_image" && "$previous_image" != "$IMAGE" ]]; then
  echo "Rolling back to $previous_image" >&2
  cat > .env <<EOF
ZANACRM_IMAGE=$previous_image
ZANACRM_HOST_PORT=$HOST_PORT
EOF
  docker compose -f docker-compose.prod.yml up -d web
fi

exit 1
