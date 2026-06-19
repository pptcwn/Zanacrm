# Deploy ZanaCRM to Google Compute Engine

This project deploys as a Dockerized Next.js standalone app.

## Recommended VM

Start production with:

- Machine type: `e2-standard-2`
- CPU/RAM: 2 vCPU, 8 GB RAM
- Disk: 30 GB minimum; 40-50 GB balanced persistent disk is more comfortable for long-running production
- OS: Ubuntu 24.04 LTS
- Region: `asia-east1` for the current Taiwan VM
- Firewall: allow public `80` and `443`; keep app port `3000` bound to `127.0.0.1`

Current VM:

```text
name=zana-vm-taiwan
machine_type=e2-standard-2
zone=asia-east1-a
boot_disk_size=30GB
boot_disk_type=pd-standard
```

Smaller staging/demo VM:

- `e2-medium`, 2 shared vCPU, 4 GB RAM, 30 GB disk

Scale up when needed:

- `e2-standard-4`, 4 vCPU, 16 GB RAM

## Runtime Shape

GitHub Actions:

1. Runs tests.
2. Runs `next build`.
3. Builds a Docker image.
4. Pushes the image to Google Artifact Registry.
5. SSHes into the VM.
6. Runs `/opt/zanacrm/deploy.sh IMAGE`.

The VM runs:

- Docker Engine and Docker Compose plugin
- `/opt/zanacrm/docker-compose.prod.yml`
- `/opt/zanacrm/.env.production`
- `/opt/zanacrm/deploy.sh`
- Optional Caddy or Nginx reverse proxy from `:443` to `127.0.0.1:3000`

## GCP Setup

Create an Artifact Registry Docker repository:

```bash
gcloud artifacts repositories create zanacrm \
  --repository-format=docker \
  --location=asia-east1
```

Create or choose a deploy service account. It needs:

- `roles/artifactregistry.writer` for GitHub Actions image push
- `roles/compute.osLogin` if using OS Login
- permission to SSH to the target VM

The VM service account needs:

- `roles/artifactregistry.reader`

Prefer Workload Identity Federation for GitHub authentication. Do not store a long-lived GCP JSON key in GitHub.

## GitHub Variables

Set these repository or environment variables:

```text
GCP_PROJECT_ID=your-gcp-project-id
GCP_REGION=asia-east1
GCP_ARTIFACT_REGISTRY_REPOSITORY=zanacrm
GCE_INSTANCE_NAME=zana-vm-taiwan
GCE_ZONE=asia-east1-a
GCE_SSH_USERNAME=deploy
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

`NEXT_PUBLIC_*` values are GitHub Variables, not Secrets, because they are embedded into the browser bundle by Next.js.

## GitHub Secrets

Set these secrets:

```text
GCP_WORKLOAD_IDENTITY_PROVIDER=projects/.../locations/global/workloadIdentityPools/.../providers/...
GCP_SERVICE_ACCOUNT=github-deploy@your-gcp-project-id.iam.gserviceaccount.com
GCE_SSH_PRIVATE_KEY=<private key for the deploy user>
```

## VM Bootstrap

Copy or clone this repo onto the VM once, then run:

```bash
chmod +x scripts/gcp/bootstrap-vm.sh scripts/gcp/deploy.sh
./scripts/gcp/bootstrap-vm.sh asia-east1
```

Edit production environment values:

```bash
sudo nano /opt/zanacrm/.env.production
```

Required app values:

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

The bootstrap script configures Docker, installs the Google Cloud CLI if missing, copies deploy files to `/opt/zanacrm`, and configures Docker auth for Artifact Registry.

## Reverse Proxy

Keep the app bound to localhost and terminate TLS with Caddy or Nginx.

Example Caddyfile:

```text
crm.example.com {
  reverse_proxy 127.0.0.1:3000
}
```

## First Deploy

Push to `main`, or run the `Deploy to Google Compute Engine` workflow manually.

The workflow deploys image tags like:

```text
asia-east1-docker.pkg.dev/<project>/<repo>/zanacrm:<commit-sha>
```

## Health Check

The app exposes:

```text
/api/health
```

The deploy script waits for this endpoint after each release. If the new image fails health checks and a previous image exists, it rolls back automatically.

## Lint Status

The CI workflow currently gates on:

- `npm test`
- `npm run build`
- Docker image build

It intentionally does not gate on `npm run lint` yet because the current codebase still has lint debt such as explicit `any`, `@ts-ignore`, and strict React hook lint errors.
