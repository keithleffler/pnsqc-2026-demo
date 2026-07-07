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

## Ports & services

Ports are variables in `.env` so the stack can be re-homed (e.g. onto odinforge)
without colliding with services already running there.

| Service     | URL                          | Port var          | Notes                                  |
| ----------- | ---------------------------- | ----------------- | -------------------------------------- |
| Postgres    | `localhost:5442`             | `POSTGRES_PORT`   | Dedicated container (`docker-compose.yml`); host 5432/5433 already in use |
| Backend API | http://localhost:9000        | `BACKEND_PORT`    | Runs on host via yarn                  |
| Admin       | http://localhost:9000/app    | —                 | Served by the backend                  |
| Storefront  | http://localhost:8010/gb     | `STOREFRONT_PORT` | 8010 because host port 8000 is taken   |

### Key pages for the paper

- Product-card grid: http://localhost:8010/gb/store
- Product-detail page: http://localhost:8010/gb/products/t-shirt (also `sweatpants`, `sweatshirt`, `shorts`)

The seed creates a single **Europe** region (EUR, countries `gb,de,dk,se,fr,es,it`),
so the storefront's default region is `gb` and prices display in EUR.

## Credentials & keys

- Admin login: `admin@example.com` / `supersecret`
- Publishable API key (storefront): stored in `storefront/.env.local`
  (`pk_31d2b9615e4f37a9a1632eb9a7f109400c95965f3e25f7593294ac0a0bfb010f`)
- These are demo-only secrets; rotate before any non-local deployment.

## Running it

All app commands need Node 20 on PATH:

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"   # or: nvm use 20
```

### 1. Database

```bash
docker compose up -d          # starts Postgres on ${POSTGRES_PORT}
```

### 2. Backend (first time: install, migrate, seed, create admin)

```bash
cd backend
yarn install
yarn medusa db:migrate
yarn seed
yarn medusa user -e admin@example.com -p supersecret
yarn dev                      # http://localhost:9000  (admin at /app)
```

### 3. Storefront

```bash
cd storefront
yarn install
yarn dev                      # http://localhost:8010/gb
```

> If the `yarn` command isn't found under Node 20, invoke the pinned release
> directly, e.g. `node .yarn/releases/yarn-4.12.0.cjs dev`, or run `corepack enable`.

> Run the dev servers in the **foreground** (or log outside this directory).
> Medusa's file watcher restarts endlessly if a log file is written *inside* the
> project tree.

## Teardown

```bash
docker compose down           # keep data
docker compose down -v        # also wipe the Postgres volume
```
