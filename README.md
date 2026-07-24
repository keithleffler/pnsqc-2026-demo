# Medusa anchor app

A minimal Medusa v2 store (backend + Next.js starter storefront) used as the
neutral, open-source "system under test" for the PNSQC paper's author-created
examples. Scope is deliberately thin: the **product card** (store listing) and the
**product-detail page**. Cart, checkout, account, and admin flows are out of scope
for the paper's figures.

- Backend: `medusa-starter-default` (Medusa **2.16.0**)
- Storefront: `nextjs-starter-medusa` (Next.js 15)
- Package manager: **yarn 4.12.0** (pinned per project via `.yarn/releases`, `nodeLinker: node-modules`)
- Node: **20.19.5** (Medusa v2 supports Node 20/22; do **not** use the host's Node 24)

There are two ways to run it:

1. **[Docker stack](#running-with-docker-the-deployable-stack)** — one command, fully
   containerized (Postgres + backend + storefront). This is what deploys to odinforge.
2. **[Local host dev](#running-locally-host-dev)** — `yarn dev` against a Postgres
   container. Faster iteration, hot reload.

Both seed the same demo catalog and default to the **United States** region (USD).

---

## Running with Docker (the deployable stack)

`docker-compose.yml` builds and runs all three services. Everything the browser and
the containers need — ports, URLs, secrets, the publishable API key — is a variable
in `.env`, so the stack can be re-homed without editing compose.

```bash
docker compose up --build -d
```

On first boot the backend entrypoint (`backend/docker-entrypoint.sh`) is idempotent:
it runs DB migrations, then `src/scripts/bootstrap.ts` which **seeds the catalog only
if empty**, ensures the **United States** region exists, and **pins the publishable
key** to `MEDUSA_PUBLISHABLE_KEY` so the pre-built storefront (which baked the same
value at build time) can talk to the API. It then **creates the admin user**
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`) if it doesn't already exist. Re-running `up` is safe.

Log into the admin at http://localhost:9001/app with `admin@example.com` /
`supersecret` (change via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`).

### Ports (from `.env`)

| Service     | Default URL               | Port var          | In-container |
| ----------- | ------------------------- | ----------------- | ------------ |
| Postgres    | `localhost:5444`          | `POSTGRES_PORT`   | 5432         |
| Backend API | http://localhost:9001     | `BACKEND_PORT`    | 9000         |
| Admin       | http://localhost:9001/app | —                 | 9000         |
| Storefront  | http://localhost:8011     | `STOREFRONT_PORT` | 8010         |

These defaults are chosen **not** to collide with the local host-dev demo
(5442 / 9000 / 8010). Change them in `.env` for any other host.

### Key pages for the paper

- Product-card grid: http://localhost:8011/us/store
- Product-detail page: http://localhost:8011/us/products/t-shirt
  (also `sweatpants`, `sweatshirt`, `shorts`)

Prices display in USD (e.g. `$15.00`); the price element carries
`data-testid="price"`.

### ⚠️ Shell env vars override `.env`

Docker Compose gives **shell environment variables precedence over the `.env`
file**. If your shell exports any var that also appears in `.env`, compose uses the
*shell* value. The local host-dev demo exports `POSTGRES_PORT` / `BACKEND_PORT` /
`STOREFRONT_PORT` (5442 / 9000 / 8010) **and** `POSTGRES_DB` (`medusa_anchor`), so a
bare `up` gets port collisions and the wrong DB name. Either run in a shell that
doesn't export them, or unset them for the command:

```bash
env -u POSTGRES_PORT -u BACKEND_PORT -u STOREFRONT_PORT -u POSTGRES_DB \
  docker compose up --build -d
```

On odinforge (where those vars aren't set) plain `docker compose up --build -d` works.

### Teardown

```bash
docker compose down           # stop, keep data
docker compose down -v        # also wipe the Postgres volume (fresh reseed next up)
```

---

## Deploying to odinforge

odinforge already runs other Docker stacks (including Postgres), so pick ports that
are free there.

1. Copy the project to the host (git clone or rsync). `.env`, `backend/.env`, and
   `storefront/.env.local` are git-ignored — copy or recreate `.env` on the host.
2. Edit `.env`:
   - Set `POSTGRES_PORT` / `BACKEND_PORT` / `STOREFRONT_PORT` to free ports.
   - Set `PUBLIC_BACKEND_URL` / `PUBLIC_STOREFRONT_URL` to how a browser reaches the
     host, e.g. `http://odinforge:<BACKEND_PORT>` / `http://odinforge:<STOREFRONT_PORT>`
     (or the real domain behind a reverse proxy). These feed CORS **and** are baked
     into the storefront build, so they must be correct **before** `--build`.
   - **Rotate the secrets**: `JWT_SECRET`, `COOKIE_SECRET`, and
     `MEDUSA_PUBLISHABLE_KEY` (any `pk_` + 64 hex chars).
3. Build & start:
   ```bash
   docker compose up --build -d
   ```
4. Verify: `curl http://<host>:<BACKEND_PORT>/health` → `200`, then open
   `http://<host>:<STOREFRONT_PORT>/us/store`.

The stack's only external dependency is the bundled Postgres container; it does not
use the host's shared Postgres. Point `DATABASE_URL` at the shared instance in
`docker-compose.yml` if you'd rather reuse it.

---

## Running locally (host dev)

Faster iteration with hot reload; runs the apps on the host against a Postgres
container. All app commands need Node 20 on PATH:

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"   # or: nvm use 20
```

Host-dev ports: Postgres **5442**, backend **9000**, storefront **8010**.

### 1. Database

```bash
docker compose up -d postgres     # or an existing local Postgres on 5442
```

> Note: bare `docker compose up -d` now brings up the **full stack** (see above),
> not just Postgres. For host dev, start only the `postgres` service as shown.

### 2. Backend (first time: install, migrate, seed, US region, admin user)

```bash
cd backend
yarn install
yarn medusa db:migrate
yarn seed
yarn medusa exec ./src/scripts/add-us-region.ts   # adds the USD United States region
yarn medusa user -e admin@example.com -p supersecret
yarn dev                          # http://localhost:9000  (admin at /app)
```

### 3. Storefront

```bash
cd storefront
yarn install
yarn dev                          # http://localhost:8010/us
```

> If `yarn` isn't found under Node 20, invoke the pinned release directly:
> `node .yarn/releases/yarn-4.12.0.cjs dev`, or run `corepack enable`.

> Run the dev servers in the **foreground** (or log *outside* this directory).
> Medusa's file watcher restarts endlessly if a log file is written inside the tree.

---

## Credentials & keys (demo only — rotate before any real deployment)

- Admin login: `admin@example.com` / `supersecret`
- Docker stack publishable key: `MEDUSA_PUBLISHABLE_KEY` in `.env`
- Host-dev publishable key: `storefront/.env.local`

## Regions

The seed creates a **Europe** region (EUR; `dk,fr,de,it,es,se,gb`).
`src/scripts/add-us-region.ts` (run by bootstrap in the Docker stack) adds a
**United States** region (USD; `us`), which is the storefront's default
(`STOREFRONT_DEFAULT_REGION` / `NEXT_PUBLIC_DEFAULT_REGION`).

## Notes / gotchas baked into this setup

- **Migration pool size** — Medusa runs every module's migrations concurrently, each
  holding a DB connection. The default Knex pool (max 10) is smaller than the module
  count, so on a fresh DB migrations deadlock (`KnexTimeoutError: pool is probably
  full`). `backend/medusa-config.ts` raises `databaseDriverOptions.pool.max` to 40.
- **PDP must be dynamic** — the product page reads `searchParams` (`v_id`) and shows
  live pricing. It's marked `export const dynamic = "force-dynamic"`; otherwise
  `generateStaticParams` opts it into static rendering and it throws
  `DYNAMIC_SERVER_USAGE` in a production build (the backend isn't reachable while the
  storefront image builds, so `generateStaticParams` returns `[]`).
- **Fixed publishable key** — the storefront bakes `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
  at build time while the backend pins the matching token in the DB at boot, so both
  always agree and `docker compose up --build` is a true one-command deploy.
