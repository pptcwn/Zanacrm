#!/usr/bin/env bash
set -Eeuo pipefail

REGION="${1:?Usage: bootstrap-vm.sh GCP_REGION}"
APP_DIR="${APP_DIR:-/opt/zanacrm}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

if [[ "$(id -u)" -eq 0 ]]; then
  SUDO=""
else
  SUDO="sudo"
fi

ensure_docker_apt_repo() {
  $SUDO apt-get update
  $SUDO apt-get install -y ca-certificates curl gnupg
  $SUDO install -m 0755 -d /etc/apt/keyrings
  . /etc/os-release
  docker_os="$ID"
  if [[ "$docker_os" != "ubuntu" && "$docker_os" != "debian" ]]; then
    echo "Unsupported OS for Docker apt repository: $docker_os" >&2
    exit 1
  fi
  curl -fsSL "https://download.docker.com/linux/${docker_os}/gpg" | $SUDO gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  $SUDO chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${docker_os} ${VERSION_CODENAME} stable" \
    | $SUDO tee /etc/apt/sources.list.d/docker.list >/dev/null
  $SUDO apt-get update
}

if ! command -v docker >/dev/null 2>&1; then
  ensure_docker_apt_repo
  $SUDO apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

if ! docker compose version >/dev/null 2>&1; then
  ensure_docker_apt_repo
  $SUDO apt-get install -y docker-compose-plugin
fi

if ! command -v gcloud >/dev/null 2>&1; then
  $SUDO apt-get update
  $SUDO apt-get install -y apt-transport-https ca-certificates curl gnupg
  curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg \
    | $SUDO gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
  echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" \
    | $SUDO tee /etc/apt/sources.list.d/google-cloud-sdk.list >/dev/null
  $SUDO apt-get update
  $SUDO apt-get install -y google-cloud-cli
fi

$SUDO install -d -m 0755 "$APP_DIR"
$SUDO install -m 0644 "${REPO_DIR}/docker-compose.prod.yml" "${APP_DIR}/docker-compose.prod.yml"
$SUDO install -m 0755 "${REPO_DIR}/scripts/gcp/deploy.sh" "${APP_DIR}/deploy.sh"

if [[ ! -f "${APP_DIR}/.env.production" ]]; then
  $SUDO tee "${APP_DIR}/.env.production" >/dev/null <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
EOF
  echo "Created ${APP_DIR}/.env.production. Edit it before first deploy."
fi

$SUDO gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

echo "VM bootstrap complete at ${APP_DIR}"
