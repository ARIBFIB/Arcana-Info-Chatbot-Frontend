# VM deployment guide (Docker + Nginx + GitHub Actions)

Step-by-step guide for deploying this **Next.js frontend** on a Linux VM with Docker, Nginx, and GitHub CI/CD.

This matches a common **office production pattern**:

- Environment variables live in a **`.env` file on the VM only**
- **`docker-compose.yml` does not hard-code secrets** — it references `${VAR}` and Docker Compose reads values from `.env`
- **GitHub Actions never writes or overwrites `.env`** — CI only pulls code and rebuilds containers
- The `.env` file is created once on the server and maintained by ops, not by the pipeline

---

## Table of contents

1. [Architecture](#1-architecture)
2. [How environment variables work in this app](#2-how-environment-variables-work-in-this-app)
3. [One-time VM setup](#3-one-time-vm-setup)
4. [Project files to add](#4-project-files-to-add)
5. [Configure Nginx](#5-configure-nginx)
6. [First deploy on the VM](#6-first-deploy-on-the-vm)
7. [GitHub Actions (CI/CD)](#7-github-actions-cicd)
8. [Running the backend on the same VM](#8-running-the-backend-on-the-same-vm)
9. [Day-to-day commands reference](#9-day-to-day-commands-reference)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Architecture

```text
Internet
   │
   ▼
┌─────────────────────────────────────────────┐
│  VM (public IP, e.g. 203.0.113.10)          │
│                                             │
│  Nginx on VM host (:80)                     │
│     │                                       │
│     ├── /        ──► Docker frontend :3000
│     └── /api/    ──► Backend :8000 (optional)
└─────────────────────────────────────────────┘
```

| Component              | Role                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nginx (on VM host)** | Public entry point. Installed on the VM, listens on port 80, proxies to `127.0.0.1:3000` where Docker runs the app. Config template: `nginx/default.conf`. |
| **Docker**             | Runs Next.js with `npm run start` on port 3000. `docker-compose.yml` maps `3000:3000`.                                                                     |
| **GitHub Actions**     | On every push to `main`, SSHs into the VM, pulls latest code, rebuilds and restarts containers. Does **not** manage secrets.                               |
| **`.env` on VM**       | Single source of truth for production config. Never committed to Git.                                                                                      |

---

## 2. How environment variables work in this app

This project uses one variable (see `.env.example`):

```env
NEXT_PUBLIC_API_BASE_URL=http://your-backend-url:8000
```

### Local development

| File           | Purpose                                                             |
| -------------- | ------------------------------------------------------------------- |
| `.env.local`   | Your machine-only config. Copy from `.env.example`. Git ignores it. |
| `.env.example` | Template committed to the repo. No real secrets.                    |

### Production (VM)

| File                   | Purpose                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `/opt/ai-chatbot/.env` | Production config. **You create this once on the VM.** GitHub Actions never touches it. |

### Why `NEXT_PUBLIC_*` is special

Variables starting with `NEXT_PUBLIC_` are embedded into the **browser JavaScript bundle at build time**. They are not read when the container starts.

That means:

- Changing `.env` and running `docker compose restart` is **not enough**
- You must run **`docker compose build`** after changing `NEXT_PUBLIC_*`

Docker Compose automatically loads a file named `.env` in the same folder as `docker-compose.yml` and substitutes `${NEXT_PUBLIC_API_BASE_URL}` in the YAML. You do **not** need to duplicate values inside the YAML itself.

---

## 3. One-time VM setup

Assume **Ubuntu 22.04 or 24.04**. Run these on the VM unless noted otherwise.

---

### 3.1 Connect to the VM

```bash
ssh ubuntu@YOUR_VM_PUBLIC_IP
```

| Part                | What it does                          | Effect                                                                           |
| ------------------- | ------------------------------------- | -------------------------------------------------------------------------------- |
| `ssh`               | Secure Shell — encrypted remote login | Opens a terminal session on the VM as if you were sitting at that machine        |
| `ubuntu@`           | Username on the VM                    | Most cloud Ubuntu images use `ubuntu`; yours may differ (`root`, `debian`, etc.) |
| `YOUR_VM_PUBLIC_IP` | The VM's address on the internet      | Your laptop connects to the server through this IP                               |

---

### 3.2 Update the operating system

```bash
sudo apt update && sudo apt upgrade -y
```

| Command          | What it does                                                    | Effect                                                         |
| ---------------- | --------------------------------------------------------------- | -------------------------------------------------------------- |
| `sudo`           | Run as administrator (root)                                     | Required for installing system packages                        |
| `apt update`     | Refresh the list of available packages from Ubuntu repositories | Ensures `apt` knows about the latest package versions          |
| `apt upgrade -y` | Install newer versions of installed packages                    | `-y` auto-confirms prompts; patches security fixes and updates |
| `&&`             | Run the second command only if the first succeeds               | Stops the chain if `update` fails                              |

---

### 3.3 Install Docker

```bash
sudo apt install -y ca-certificates curl gnupg
```

| Package           | What it does                        | Effect                                                            |
| ----------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `ca-certificates` | Trusted SSL certificate authorities | Lets `curl` verify HTTPS downloads (Docker's GPG key, repos)      |
| `curl`            | Download files from URLs            | Used to fetch Docker's signing key                                |
| `gnupg`           | GNU Privacy Guard                   | Verifies that packages really come from Docker, not a fake mirror |

```bash
sudo install -m 0755 -d /etc/apt/keyrings
```

| Part                 | What it does                                  | Effect                                        |
| -------------------- | --------------------------------------------- | --------------------------------------------- |
| `install -m 0755 -d` | Create directory with permissions `rwxr-xr-x` | Prepares a secure folder for APT signing keys |
| `/etc/apt/keyrings`  | Standard location for repository keys         | Ubuntu expects third-party repo keys here     |

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

| Part                              | What it does                                            | Effect                                       |
| --------------------------------- | ------------------------------------------------------- | -------------------------------------------- |
| `curl -fsSL`                      | Download quietly; fail on HTTP errors; follow redirects | Fetches Docker's official GPG public key     |
| `gpg --dearmor`                   | Convert ASCII-armored key to binary                     | Format APT can use to verify packages        |
| `-o /etc/apt/keyrings/docker.gpg` | Save the key file                                       | APT will trust packages signed with this key |

```bash
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

| Part        | What it does                        | Effect                                  |
| ----------- | ----------------------------------- | --------------------------------------- |
| `chmod a+r` | Make the file readable by all users | Non-root APT processes can read the key |

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

| Part                        | What it does                               | Effect                                               |
| --------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| `dpkg --print-architecture` | Detect CPU arch (`amd64`, `arm64`, …)      | Adds the correct Docker repo for your VM             |
| `. /etc/os-release`         | Load Ubuntu version info                   | Gets codename (`jammy`, `noble`, …) for the repo URL |
| `deb [...] stable`          | APT source line for Docker's package index | Tells Ubuntu where to download Docker packages       |
| `tee .../docker.list`       | Write the line to Docker's sources file    | Registers Docker as an installable source            |
| `> /dev/null`               | Suppress duplicate echo output             | Keeps terminal clean                                 |

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

| Package                 | What it does                | Effect                                     |
| ----------------------- | --------------------------- | ------------------------------------------ |
| `docker-ce`             | Docker Engine (daemon)      | Runs containers in the background          |
| `docker-ce-cli`         | `docker` command-line tool  | Lets you build, run, and manage containers |
| `containerd.io`         | Low-level container runtime | Docker Engine uses this under the hood     |
| `docker-buildx-plugin`  | Advanced image builder      | Faster/multi-platform builds               |
| `docker-compose-plugin` | `docker compose` command    | Defines multi-container apps in YAML       |

```bash
sudo usermod -aG docker $USER
```

| Part                 | What it does                      | Effect                               |
| -------------------- | --------------------------------- | ------------------------------------ |
| `usermod -aG docker` | Append user to the `docker` group | Lets you run `docker` without `sudo` |
| `$USER`              | Current logged-in username        | Applies to you (`ubuntu`, etc.)      |

**Log out and back in** so the group change takes effect:

```bash
exit
ssh ubuntu@YOUR_VM_PUBLIC_IP
docker --version
docker compose version
```

| Command                  | What it does                 | Effect                                                            |
| ------------------------ | ---------------------------- | ----------------------------------------------------------------- |
| `exit`                   | Close SSH session            | Required after `usermod` — group membership applies on next login |
| `docker --version`       | Print Docker CLI version     | Confirms Docker installed correctly                               |
| `docker compose version` | Print Compose plugin version | Confirms `docker compose` (v2) is available                       |

---

### 3.4 Configure firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

| Command             | What it does         | Effect                                                    |
| ------------------- | -------------------- | --------------------------------------------------------- |
| `ufw allow OpenSSH` | Allow SSH (port 22)  | Prevents locking yourself out after enabling the firewall |
| `ufw allow 80/tcp`  | Allow HTTP           | Nginx can receive web traffic                             |
| `ufw allow 443/tcp` | Allow HTTPS          | For SSL later (Certbot)                                   |
| `ufw enable`        | Turn on the firewall | Blocks all other incoming ports by default                |
| `ufw status`        | Show active rules    | Verify ports 22, 80, 443 are open                         |

Also open **ports 80 and 443** in your cloud provider's security group (AWS, Azure, etc.). UFW alone is not enough if the cloud firewall blocks traffic first.

---

### 3.5 Install Nginx on the VM

Nginx runs on the **VM host**, not inside Docker. Docker only runs the Next.js app on port 3000.

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx
```

| Command                  | What it does            | Effect                         |
| ------------------------ | ----------------------- | ------------------------------ |
| `apt install nginx`      | Install Nginx on the VM | Reverse proxy on port 80       |
| `systemctl enable nginx` | Start Nginx on boot     | Survives VM reboots            |
| `systemctl start nginx`  | Start Nginx now         | Listens on port 80 immediately |
| `systemctl status nginx` | Show service state      | Should show `active (running)` |

---

## 4. Project files to add

Add these to the repository (not secrets — only structure and templates).

### 4.1 `Dockerfile`

Multi-stage build: install dependencies → build Next.js → run minimal production image.

Key points:

- `ARG NEXT_PUBLIC_API_BASE_URL` receives the value from `docker compose build` (sourced from `.env`)
- `output: "standalone"` in `next.config.ts` produces a small runnable `server.js`

### 4.2 `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

| Setting                | What it does                               | Effect                                          |
| ---------------------- | ------------------------------------------ | ----------------------------------------------- |
| `output: "standalone"` | Next.js bundles only what production needs | Smaller Docker image; run with `node server.js` |

### 4.3 `.dockerignore`

Tells Docker which files to skip when copying into the build context.

| Ignored path          | Why                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `node_modules`        | Reinstalled inside the container — copying local ones is slow and can break cross-platform builds |
| `.next`               | Old build output — rebuilt inside Docker                                                          |
| `.env`, `.env*.local` | Secrets stay on the host; never baked into image layers from your laptop                          |

### 4.4 `docker-compose.yml` (env from `.env` file — office pattern)

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL}
    image: ai-chatbot-frontend:latest
    container_name: ai-chatbot-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
```

| Key                         | What it does                              | Effect                                                          |
| --------------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| `build.context: .`          | Use repo root as build context            | Docker sees `Dockerfile`, source code, etc.                     |
| `build.args`                | Pass build-time variables to `Dockerfile` | `${NEXT_PUBLIC_API_BASE_URL}` is read from `.env` automatically |
| `ports: "3000:3000"`        | Map host port 3000 → container port 3000  | VM Nginx proxies to `127.0.0.1:3000`                            |
| `restart: unless-stopped`   | Auto-restart container                    | App comes back after crash or VM reboot                         |
| **No `environment:` block** | Values are not duplicated in YAML         | Matches office prod: secrets only in `.env`                     |

**How Docker Compose reads `.env`:**

When `docker compose` runs in `/opt/ai-chatbot`, it automatically loads `/opt/ai-chatbot/.env` and substitutes `${VAR}` in the YAML. You never paste secrets into the compose file.

---

## 5. Configure Nginx on the VM

Copy the repo config to the VM and enable it.

### 5.1 Copy and edit config

```bash
sudo cp /opt/ai-chatbot/nginx/default.conf /etc/nginx/sites-available/ai-chatbot
sudo nano /etc/nginx/sites-available/ai-chatbot
```

Replace `YOUR_VM_PUBLIC_IP` with your real public IP or domain.

### 5.2 Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/ai-chatbot /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

| Command                  | What it does    | Effect                                  |
| ------------------------ | --------------- | --------------------------------------- |
| `ln -s`                  | Enable the site | Nginx loads your config                 |
| `nginx -t`               | Test syntax     | Catches typos before reload             |
| `systemctl reload nginx` | Apply changes   | Port 80 now proxies to `127.0.0.1:3000` |

---

## 6. First deploy on the VM

### 6.1 Create app directory

```bash
sudo mkdir -p /opt/ai-chatbot
sudo chown $USER:$USER /opt/ai-chatbot
cd /opt/ai-chatbot
```

| Command             | What it does                        | Effect                                          |
| ------------------- | ----------------------------------- | ----------------------------------------------- |
| `mkdir -p`          | Create directory, including parents | `/opt/ai-chatbot` exists                        |
| `chown $USER:$USER` | Give ownership to your user         | You can `git clone` and run Docker without sudo |
| `cd`                | Change into that directory          | All following commands run from the deploy root |

### 6.2 Clone the repository

```bash
git clone https://github.com/YOUR_USER/AI_Chatbot_Frontend.git .
```

| Part            | What it does                          | Effect                                           |
| --------------- | ------------------------------------- | ------------------------------------------------ |
| `git clone ...` | Download repository history and files | Full project on the VM                           |
| `.` at the end  | Clone into current folder             | Files land in `/opt/ai-chatbot`, not a subfolder |

### 6.3 Create production `.env` (once — never in Git, never in CI)

```bash
nano /opt/ai-chatbot/.env
```

Example contents:

```env
NEXT_PUBLIC_API_BASE_URL=http://203.0.113.10/api
```

Or if backend is on another server:

```env
NEXT_PUBLIC_API_BASE_URL=http://203.0.113.20:8000
```

| Rule                                 | Why                                                      |
| ------------------------------------ | -------------------------------------------------------- |
| No trailing slash                    | Matches project convention in `.env.example`             |
| URL must work in **users' browsers** | `NEXT_PUBLIC_*` runs in the client, not on the server    |
| Edit with `nano` / `vim` on VM only  | Ops controls prod config; pipeline does not overwrite it |

Save in nano: `Ctrl+O`, Enter, then `Ctrl+X`.

### 6.4 Build and start containers

```bash
cd /opt/ai-chatbot
docker compose build --no-cache
```

| Part                   | What it does                  | Effect                                                                 |
| ---------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `docker compose build` | Build image from `Dockerfile` | Runs `npm ci`, `npm run build` with `NEXT_PUBLIC_*` from `.env`        |
| `--no-cache`           | Ignore cached layers          | Ensures env changes are picked up on first build or after `.env` edits |

```bash
docker compose up -d
```

| Part | What it does                | Effect                               |
| ---- | --------------------------- | ------------------------------------ |
| `up` | Create and start containers | Frontend listens on port 3000        |
| `-d` | Detached mode               | Runs in background; terminal is free |

```bash
docker compose ps
```

| What it does                  | Effect                              |
| ----------------------------- | ----------------------------------- |
| List running compose services | Should show `frontend` as `running` |

```bash
docker compose logs -f frontend
```

| Part   | What it does                  | Effect                                     |
| ------ | ----------------------------- | ------------------------------------------ |
| `logs` | Print container stdout/stderr | See Next.js startup messages or errors     |
| `-f`   | Follow (stream)               | Live tail; press `Ctrl+C` to stop watching |

### 6.5 Verify

```bash
curl -I http://localhost:3000
```

| Effect | Confirms the Docker container is running |

```bash
curl -I http://YOUR_VM_PUBLIC_IP
```

| Effect | Confirms VM Nginx → Docker chain works |

Open `http://YOUR_VM_PUBLIC_IP` in a browser.

---

## 7. GitHub Actions (CI/CD)

CI pulls code and rebuilds. **It does not set environment variables** — `.env` on the VM is the source of truth.

### 7.1 Create deploy SSH key (on your laptop)

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy -N ""
```

| Part                      | What it does      | Effect                                                                   |
| ------------------------- | ----------------- | ------------------------------------------------------------------------ |
| `ssh-keygen`              | Generate key pair | Private + public key for automated deploys                               |
| `-t ed25519`              | Key type          | Modern, secure, short keys                                               |
| `-f ~/.ssh/github_deploy` | File path         | Private: `github_deploy`, public: `github_deploy.pub`                    |
| `-N ""`                   | Empty passphrase  | Required for non-interactive GitHub Actions (use a dedicated deploy key) |

### 7.2 Add public key to the VM

On the VM:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```

Paste the contents of `github_deploy.pub`, save, then:

```bash
chmod 600 ~/.ssh/authorized_keys
```

| Permission                 | Why                                                       |
| -------------------------- | --------------------------------------------------------- |
| `700` on `~/.ssh`          | SSH requires restricted directory permissions             |
| `600` on `authorized_keys` | Only owner can read/write — SSH refuses loose permissions |

### 7.3 GitHub repository secrets

**Settings → Secrets and variables → Actions → New repository secret**

| Secret       | Value                                     | Used for                         |
| ------------ | ----------------------------------------- | -------------------------------- |
| `VM_HOST`    | VM public IP                              | SSH target                       |
| `VM_USER`    | e.g. `ubuntu`                             | SSH username                     |
| `VM_SSH_KEY` | Contents of `github_deploy` (private key) | Authenticate GitHub runner to VM |

**Do not add `NEXT_PUBLIC_API_BASE_URL` to GitHub Secrets** if you follow the office `.env`-on-VM pattern. Production config stays in `/opt/ai-chatbot/.env`.

### 7.4 Workflow file: `.github/workflows/deploy.yml`

```yaml
name: Deploy to VM

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy over SSH
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USER }}
          key: ${{ secrets.VM_SSH_KEY }}
          script: |
            set -e
            cd /opt/ai-chatbot
            git fetch origin master
            git reset --hard origin/master
            docker compose build
            docker compose up -d
            docker image prune -f
```

| Line / command                   | What it does                              | Effect                                                   |
| -------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `on: push: branches: [master]`   | Trigger                                   | Runs on every push to `master`                           |
| `runs-on: ubuntu-latest`         | Runner OS                                 | GitHub-hosted Linux VM executes the job                  |
| `appleboy/ssh-action`            | SSH from GitHub to your VM                | No need to install agents on the server                  |
| `set -e`                         | Exit on first error                       | Failed deploy stops immediately instead of half-updating |
| `git fetch origin main`          | Download latest commits                   | Gets new code without merging locally                    |
| `git reset --hard origin/master` | Match VM files exactly to remote `master` | Discards accidental server edits; VM mirrors Git         |
| `docker compose build`           | Rebuild image                             | Picks up code changes; reads `.env` for build args       |
| `docker compose up -d`           | Recreate container if image changed       | Rolling update to new version                            |
| `docker image prune -f`          | Remove unused old images                  | Frees disk space on the VM                               |

**What CI deliberately does not do:**

- Does not create or overwrite `.env`
- Does not inject secrets into YAML
- Does not store app config in GitHub (except SSH access secrets)

**When you change `.env` on the VM:**

```bash
nano /opt/ai-chatbot/.env
docker compose build --no-cache
docker compose up -d
```

Or push any commit to trigger CI — `docker compose build` will read the updated `.env` automatically.

---

## 8. Running the backend on the same VM

Yes — this is a common setup. Both frontend and backend run as Docker containers on one VM; Nginx routes traffic by path.

### 8.1 Layout

```text
Browser  →  Nginx :80
              ├── /      →  frontend :3000
              └── /api/  →  backend  :8000
```

### 8.2 Frontend `.env` when backend is on same VM (via Nginx)

Use the **public path** the browser will call — not `localhost` or Docker service names:

```env
NEXT_PUBLIC_API_BASE_URL=http://YOUR_VM_PUBLIC_IP/api
```

Browsers cannot resolve Docker internal names like `backend:8000`. They only know the VM's public IP or domain.

### 8.3 Extended `docker-compose.yml` (frontend + backend)

If your backend repo has its own Dockerfile, add a second service:

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL}
    image: ai-chatbot-frontend:latest
    container_name: ai-chatbot-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: ai-chatbot-backend:latest
    container_name: ai-chatbot-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - .env
```

| Key                         | What it does                      | Effect                                                                  |
| --------------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| `depends_on: backend`       | Start order                       | Backend starts before frontend (does not wait until backend is "ready") |
| `env_file: .env` on backend | Load all backend vars from `.env` | Database URLs, API keys, etc. stay in one file — office pattern         |
| Separate `context` folders  | Monorepo or sibling dirs          | Each service builds from its own code                                   |

**Example `.env` with both services:**

```env
# Frontend (build arg via compose substitution)
NEXT_PUBLIC_API_BASE_URL=http://203.0.113.10/api

# Backend (runtime via env_file)
DATABASE_URL=postgresql://user:pass@db:5432/chatbot
SECRET_KEY=your-secret-key
DEBUG=false
```

Frontend uses `NEXT_PUBLIC_*` at build time. Backend reads the rest at container start from the same `.env` via `env_file`.

### 8.4 Nginx on VM with frontend + backend

Edit `/etc/nginx/sites-available/ai-chatbot` on the VM and uncomment the `/api/` block:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8000/;
    ...
}
```

Then reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 8.5 Backend CORS

Your backend must allow requests from the frontend origin:

```text
http://YOUR_VM_PUBLIC_IP
```

If CORS is wrong, the browser blocks API calls even when Nginx and Docker are fine.

### 8.6 Alternative: two separate compose projects

Some teams keep repos separate:

```text
/opt/ai-chatbot-frontend/   → docker compose up (port 3000)
/opt/ai-chatbot-backend/    → docker compose up (port 8000)
```

Each folder has its own `.env`. Nginx still routes `/` and `/api/`. Same effect, clearer ownership per repo.

---

## 9. Day-to-day commands reference

### On the VM — application

| Command                                  | What it does                      | Effect                                                           |
| ---------------------------------------- | --------------------------------- | ---------------------------------------------------------------- |
| `cd /opt/ai-chatbot`                     | Go to deploy directory            | Required before compose commands                                 |
| `docker compose ps`                      | Show container status             | Running / exited / unhealthy                                     |
| `docker compose logs -f frontend`        | Stream frontend logs              | Debug startup and runtime errors                                 |
| `docker compose logs --tail=100 backend` | Last 100 backend log lines        | Quick error check                                                |
| `docker compose restart frontend`        | Restart without rebuild           | Picks up non-build config only — **not** `NEXT_PUBLIC_*` changes |
| `docker compose build`                   | Rebuild images from `.env` + code | Required after code or `NEXT_PUBLIC_*` changes                   |
| `docker compose up -d`                   | Start/recreate containers         | Applies new image                                                |
| `docker compose down`                    | Stop and remove containers        | App offline; images and `.env` remain                            |
| `docker compose pull`                    | Pull pre-built images             | Used if you switch to a registry workflow later                  |

### On the VM — after editing `.env`

```bash
nano /opt/ai-chatbot/.env
docker compose build --no-cache
docker compose up -d
```

| Step               | Effect                                              |
| ------------------ | --------------------------------------------------- |
| Edit `.env`        | Change production config on server only             |
| `build --no-cache` | Force fresh build so `NEXT_PUBLIC_*` is re-embedded |
| `up -d`            | Run new container                                   |

### On the VM — Nginx

| Command                                 | What it does           | Effect                                     |
| --------------------------------------- | ---------------------- | ------------------------------------------ |
| `sudo nginx -t`                         | Validate config syntax | Safe check before reload                   |
| `sudo systemctl reload nginx`           | Apply config changes   | No full restart needed                     |
| `sudo systemctl restart nginx`          | Hard restart Nginx     | Use if reload is not enough                |
| `sudo tail -f /var/log/nginx/error.log` | Watch Nginx errors     | 502 usually means Docker container is down |

### On the VM — system

| Command                 | What it does           | Effect                                              |
| ----------------------- | ---------------------- | --------------------------------------------------- |
| `df -h`                 | Disk usage             | Docker images fill disk over time — prune regularly |
| `docker system df`      | Docker disk usage      | See image/container volume sizes                    |
| `docker image prune -f` | Delete dangling images | Free space                                          |
| `sudo ufw status`       | Firewall rules         | Confirm 80/443 open                                 |

### Git — trigger deploy

```bash
git push origin master
```

| Effect | GitHub Actions SSHs to VM, pulls, builds, restarts — `.env` on VM unchanged |

---

## 10. Troubleshooting

| Symptom                     | Likely cause                             | Fix                                                       |
| --------------------------- | ---------------------------------------- | --------------------------------------------------------- |
| Cannot SSH                  | Wrong IP, firewall, or key               | Check cloud security group + `ufw status`                 |
| Nginx default page, not app | Site not enabled or wrong `proxy_pass`   | Check `sites-enabled`, run `nginx -t`                     |
| Nginx 502 Bad Gateway       | Container not running                    | `docker compose ps`, `docker compose logs frontend`       |
| App loads but API fails     | Wrong `NEXT_PUBLIC_API_BASE_URL` or CORS | Fix `.env`, rebuild; fix backend CORS                     |
| Env change had no effect    | `NEXT_PUBLIC_*` needs rebuild            | `docker compose build --no-cache && docker compose up -d` |
| Port already in use         | Another process on 3000                  | `sudo ss -tlnp \| grep 3000`                              |
| Build fails in CI           | VM missing `.env` or wrong path          | Ensure `/opt/ai-chatbot/.env` exists before first CI run  |

---

## Optional: HTTPS with a domain

When you have a domain pointing to the VM:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

| Command           | What it does                     | Effect                                    |
| ----------------- | -------------------------------- | ----------------------------------------- |
| `certbot --nginx` | Obtain Let's Encrypt certificate | Free SSL; auto-configures Nginx for HTTPS |
| Auto-renewal      | Certbot systemd timer            | Certificate renews before expiry          |

Update `.env`:

```env
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

Then rebuild frontend.

---

## Summary checklist

- [ ] VM: Docker, Nginx, UFW, cloud firewall (80, 443, 22)
- [ ] `/opt/ai-chatbot/.env` created on VM — **not in Git, not in CI**
- [ ] `docker-compose.yml` uses `${VAR}` only — no hard-coded secrets
- [ ] Nginx proxies public IP → `127.0.0.1:3000` (and optionally `/api/` → `:8000`)
- [ ] GitHub Secrets: `VM_HOST`, `VM_USER`, `VM_SSH_KEY` only
- [ ] Backend CORS allows frontend origin
- [ ] After any `NEXT_PUBLIC_*` change: `docker compose build` + `up -d`
