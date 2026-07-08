# syntax=docker/dockerfile:1

# ── Build stage: bake NEXT_PUBLIC_* values and run `next build` ────────────────
# NEXT_PUBLIC_* vars are inlined by Next at build time, so they must be present
# here (not just at runtime). generateStaticParams tolerates the backend being
# unreachable during build (it returns []), so no backend is required to build.
FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DEFAULT_REGION=us
ARG MEDUSA_BACKEND_URL=http://backend:9000
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION \
    MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL \
    NEXT_TELEMETRY_DISABLED=1

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN node .yarn/releases/yarn-4.12.0.cjs install --immutable

COPY . .
RUN node .yarn/releases/yarn-4.12.0.cjs build

# ── Runtime stage: `next start` ───────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app ./

EXPOSE 8010
CMD ["node", ".yarn/releases/yarn-4.12.0.cjs", "start"]
