# VM deployment guide

Step-by-step guide for deploying this **Next.js frontend** on a Linux VM with Docker.

- App runs on **port 3000** (no Nginx for now)
- `.env` lives **only on the VM** — never committed to Git
- Docker Compose reads `.env` on the VM for build and runtime (values never in Git)

---

## Before you start

You need:

- A Linux VM (Ubuntu 22.04 or 24.04) with a **public IP**
- SSH access (`ubuntu@YOUR_VM_IP`)
- Your repo on GitHub
- Backend API URL for production

---

## Part 1 — One-time VM setup

### Step 1: SSH into the VM

On your laptop:

```bash
ssh ubuntu@YOUR_VM_PUBLIC_IP
```

Opens a remote terminal on the VM.

---

### Step 2: Update the system

```bash
sudo apt update && sudo apt upgrade -y
```

| Command          | Effect                  |
| ---------------- | ----------------------- |
| `apt update`     | Refreshes package lists |
| `apt upgrade -y` | Installs system updates |

---

### Step 3: Install Docker

```bash
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
```

Log out and back in (group change takes effect):

```bash
exit
ssh ubuntu@YOUR_VM_PUBLIC_IP
```

Verify:

```bash
docker --version
docker compose version
```

---

### Step 4: Open firewall ports

```bash
sudo ufw allow OpenSSH
sudo ufw allow 3000/tcp
sudo ufw enable
sudo ufw status
```

Also open **port 3000** (and 22 for SSH) in your cloud provider firewall (AWS Security Group, Azure NSG, etc.).

---

### Step 5: Clone the project

```bash
sudo mkdir -p /opt/ai-chatbot
sudo chown $USER:$USER /opt/ai-chatbot
cd /opt/ai-chatbot
git clone https://github.com/YOUR_USER/AI_Chatbot_Frontend.git .
```

| Command                    | Effect                                       |
| -------------------------- | -------------------------------------------- |
| `mkdir -p /opt/ai-chatbot` | Creates app directory                        |
| `chown $USER:$USER`        | Gives you ownership (no sudo for git/docker) |
| `git clone ... .`          | Clones repo into `/opt/ai-chatbot`           |

---

### Step 6: Create `.env` on the VM

**`.env` is never in Git.** Create it once on the VM:

```bash
nano /opt/ai-chatbot/.env
```

Paste (use your real backend URL):

```env
NEXT_PUBLIC_API_BASE_URL=http://YOUR_BACKEND_IP:8000
```

Examples:

```env
# Backend on another server
NEXT_PUBLIC_API_BASE_URL=http://203.0.113.20:8000

# Backend on same VM
NEXT_PUBLIC_API_BASE_URL=http://YOUR_VM_PUBLIC_IP:8000
```

Save: `Ctrl+O` → Enter → `Ctrl+X`

Lock down permissions:

```bash
chmod 600 /opt/ai-chatbot/.env
```

Only your user can read/write `.env`.

---

### Step 7: First build and run

```bash
cd /opt/ai-chatbot
docker compose build
docker compose up -d
```

| Command                | Effect                                         |
| ---------------------- | ---------------------------------------------- |
| `docker compose build` | Builds image; reads `.env` for `NEXT_PUBLIC_*` |
| `docker compose up -d` | Starts container in background                 |

---

### Step 8: Verify

```bash
docker compose ps
docker compose logs -f frontend
```

Press `Ctrl+C` to stop following logs.

Test from VM:

```bash
curl -I http://localhost:3000
```

Test in browser:

```text
http://YOUR_VM_PUBLIC_IP:3000
```

---

## Part 2 — Every deploy after that

When you push new code to GitHub:

```bash
ssh ubuntu@YOUR_VM_PUBLIC_IP
cd /opt/ai-chatbot
git pull
docker compose build
docker compose up -d
```

`.env` stays on the VM — you do not recreate it each time.

---

## Part 3 — If you change `.env`

`NEXT_PUBLIC_*` is baked in at **build time**. After editing `.env`:

```bash
nano /opt/ai-chatbot/.env
docker compose build --no-cache
docker compose up -d
```

`docker compose restart` alone is **not** enough.

---

## Part 4 — Optional: GitHub Actions auto-deploy

### One-time: deploy SSH key

On your laptop:

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy -N ""
```

On the VM:

```bash
nano ~/.ssh/authorized_keys
```

Paste contents of `github_deploy.pub`, save.

### GitHub secrets

Repo → **Settings → Secrets and variables → Actions**:

| Secret       | Value                                   |
| ------------ | --------------------------------------- |
| `VM_HOST`    | VM public IP                            |
| `VM_USER`    | e.g. `ubuntu`                           |
| `VM_SSH_KEY` | Private key contents of `github_deploy` |

### What happens on push to `master`

GitHub SSHs to the VM and runs:

```bash
cd /opt/ai-chatbot
git fetch origin master
git reset --hard origin/master
docker compose build
docker compose up -d
docker image prune -f
```

CI does **not** touch `.env` — create it on the VM before the first auto-deploy.

---

## How `.env` works (security)

| Location      | File                   | In Git?              |
| ------------- | ---------------------- | -------------------- |
| Local dev     | `.env.local`           | No                   |
| Production VM | `/opt/ai-chatbot/.env` | No                   |
| Template      | `.env.example`         | Yes (no real values) |

`docker-compose.yml` only references the file — no variable names:

```yaml
env_file:
  - .env
```

At **build** time, `.env` is copied into the build context (via `COPY . .` in the Dockerfile). Next.js reads it during `npm run build`, then it is removed from the builder stage.

At **runtime**, Compose loads `.env` into the container via `env_file`.

Create `.env` on the VM before building. Never commit it to Git.

**Note:** `NEXT_PUBLIC_*` is not a secret — it is embedded in the browser bundle. Never put real secrets (API keys, DB passwords) in `NEXT_PUBLIC_*` variables.

---

## Inspect builds and containers

Run these from `/opt/ai-chatbot` unless noted.

### Check built images

```bash
docker images
```

List all images on the VM. Look for `ai-chatbot-frontend` and tag `latest`.

Filter to this project only:

```bash
docker images ai-chatbot-frontend
```

| Column       | Meaning                            |
| ------------ | ---------------------------------- |
| `REPOSITORY` | Image name (`ai-chatbot-frontend`) |
| `TAG`        | Version tag (`latest`)             |
| `IMAGE ID`   | Unique image ID                    |
| `CREATED`    | When the image was built           |
| `SIZE`       | Disk space used                    |

See image build history (Dockerfile layers):

```bash
docker image history ai-chatbot-frontend:latest
```

---

### Check running containers

**Compose (this project only):**

```bash
cd /opt/ai-chatbot
docker compose ps
```

| Column   | Meaning                                |
| -------- | -------------------------------------- |
| `NAME`   | Container name (`ai-chatbot-frontend`) |
| `STATUS` | `running`, `exited`, etc.              |
| `PORTS`  | e.g. `0.0.0.0:3000->3000/tcp`          |

**All containers on the VM:**

```bash
docker ps
```

Running containers only. Add `-a` to include stopped ones:

```bash
docker ps -a
```

Inspect one container in detail:

```bash
docker inspect ai-chatbot-frontend
```

Live resource usage (CPU, memory):

```bash
docker stats ai-chatbot-frontend
```

Press `Ctrl+C` to exit.

---

### Stop containers

**Stop this app (compose — recommended):**

```bash
cd /opt/ai-chatbot
docker compose stop
```

Stops containers but keeps them. Start again with `docker compose start` or `docker compose up -d`.

**Stop and remove containers (compose):**

```bash
docker compose down
```

Removes containers and the compose network. **Does not** delete the image or `.env`.

**Stop one container by name:**

```bash
docker stop ai-chatbot-frontend
```

---

### Delete containers and images

**Remove containers only (keep image):**

```bash
cd /opt/ai-chatbot
docker compose down
```

**Remove containers + project image:**

```bash
docker compose down --rmi local
```

Deletes the `ai-chatbot-frontend:latest` image built by this compose file.

**Force-remove a single container:**

```bash
docker rm -f ai-chatbot-frontend
```

`-f` stops it first if still running.

**Delete an image:**

```bash
docker rmi ai-chatbot-frontend:latest
```

Fails if a container still uses that image — stop/remove the container first.

**Remove unused images (safe cleanup):**

```bash
docker image prune -f
```

Removes dangling/old images not used by any container.

**Remove everything unused (containers, images, networks):**

```bash
docker system prune -f
```

Use carefully on shared VMs — affects all projects, not only this app.

---

## Useful commands (day to day)

```bash
cd /opt/ai-chatbot

# Status
docker compose ps

# Logs
docker compose logs -f frontend

# Restart (no code/env change)
docker compose restart frontend

# Stop app
docker compose down

# Rebuild after code change
docker compose up -d --build

# Disk cleanup
docker image prune -f
```

---

## Troubleshooting

| Problem                         | Fix                                                    |
| ------------------------------- | ------------------------------------------------------ |
| Can't open `http://VM_IP:3000`  | Open port 3000 in cloud firewall + UFW                 |
| Build warning about empty env   | `.env` missing — create `/opt/ai-chatbot/.env`         |
| API calls fail in browser       | Fix `NEXT_PUBLIC_API_BASE_URL` in `.env`, then rebuild |
| Env change had no effect        | `docker compose build --no-cache` then `up -d`         |
| Container not running           | `docker compose logs frontend`                         |
| `husky: not found` during build | Dockerfile sets `HUSKY=0` — pull latest code           |

---

## Checklist

- [ ] Docker installed on VM
- [ ] Port **3000** open (UFW + cloud firewall)
- [ ] Repo cloned to `/opt/ai-chatbot`
- [ ] `.env` created on VM with `NEXT_PUBLIC_API_BASE_URL`
- [ ] `chmod 600 .env`
- [ ] `docker compose build` succeeded
- [ ] `docker compose up -d` running
- [ ] App opens at `http://YOUR_VM_PUBLIC_IP:3000`
- [ ] Backend CORS allows `http://YOUR_VM_PUBLIC_IP:3000`

---

## Summary

| Where      | What                                                         |
| ---------- | ------------------------------------------------------------ |
| **Git**    | Code only — no `.env`                                        |
| **VM**     | `/opt/ai-chatbot/.env` — create manually once                |
| **Deploy** | `git pull` → `docker compose build` → `docker compose up -d` |
| **Access** | `http://YOUR_VM_PUBLIC_IP:3000`                              |
