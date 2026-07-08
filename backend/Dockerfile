# syntax=docker/dockerfile:1

# ── Build stage: install full deps and produce .medusa/server ────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Native build deps for modules that compile on install
RUN apk add --no-cache python3 make g++

# Install using the project's pinned yarn (invoked directly so it is independent
# of any global yarn version)
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN node .yarn/releases/yarn-4.12.0.cjs install --immutable

COPY . .
RUN node .yarn/releases/yarn-4.12.0.cjs build

# ── Runtime stage: run the built server from .medusa/server ───────────────────
FROM node:20-alpine AS runner
WORKDIR /app/.medusa/server
ENV NODE_ENV=production

# Native deps needed again to install the built server's production dependencies
RUN apk add --no-cache python3 make g++

# The built server is a self-contained app with its own package.json
COPY --from=builder /app/.medusa/server ./
RUN npm install

COPY docker-entrypoint.sh /usr/local/bin/backend-entrypoint.sh
RUN chmod +x /usr/local/bin/backend-entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["/usr/local/bin/backend-entrypoint.sh"]
