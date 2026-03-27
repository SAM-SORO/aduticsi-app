# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app

# Prisma + Next build ont besoin que ces variables existent au moment du build.
# Coolify injectera les vraies valeurs en runtime, mais pour la construction on met des defaults non sensibles.
ARG DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ARG DIRECT_URL="postgresql://user:pass@localhost:5432/db"
ARG NEXT_PUBLIC_SUPABASE_URL="https://example.supabase.co"
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY="anon-placeholder"
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY="turnstile-placeholder"
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

RUN apk add --no-cache libc6-compat

COPY package.json pnpm-lock.yaml ./

RUN corepack enable \
  && corepack prepare pnpm@10.28.2 --activate

RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app

ARG DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ARG DIRECT_URL="postgresql://user:pass@localhost:5432/db"
ARG NEXT_PUBLIC_SUPABASE_URL="https://example.supabase.co"
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY="anon-placeholder"
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY="turnstile-placeholder"
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable \
  && corepack prepare pnpm@10.28.2 --activate

# Génère le client Prisma (se base sur la schema, sans exiger une connexion DB).
RUN pnpm exec prisma generate

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm exec next build

# Retire les dépendances dev pour la phase runtime.
RUN pnpm prune --prod

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN apk add --no-cache libc6-compat \
  && addgroup -S nodejs && adduser -S app -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER app

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec next start --hostname 0.0.0.0 --port ${PORT:-3000}"]

