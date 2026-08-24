# syntax=docker/dockerfile:1

# 1. Install dependencies only when needed
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

# Copy lockfile and package.json
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build time
ARG DATABASE_URL
ARG DIRECT_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

# Garde-fou : les variables NEXT_PUBLIC_* sont inlinées dans le bundle client au
# moment du build. Si elles n'arrivent pas jusqu'ici (build-arg non transmis par
# la plateforme de déploiement), le build réussit quand même mais produit un
# bundle inutilisable — panne silencieuse, visible seulement dans le navigateur.
# On échoue tôt, avec un message qui dit quoi corriger.
RUN set -e; \
    for v in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY; do \
      eval "val=\$$v"; \
      if [ -z "$val" ]; then \
        echo "ERREUR: $v est vide au moment du build."; \
        echo "  Cette variable doit etre transmise en --build-arg."; \
        echo "  Sur Coolify : Environment Variables > cocher 'Build Variable' pour $v."; \
        exit 1; \
      fi; \
    done; \
    echo "Build avec NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"

# Build application
RUN pnpm exec prisma generate
RUN pnpm run build

# Verification post-build, informative uniquement (n'echoue jamais le build) :
# indique quelle instance Supabase le bundle client reference réellement. Permet
# de reperer dans les logs de deploiement le cas d'une couche Docker en cache
# reutilisee malgre un changement de valeur.
RUN host=$(printf '%s' "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's#^https?://##; s#/.*##'); \
    if grep -raqF "$host" .next 2>/dev/null; then \
      echo "OK: le bundle reference bien $host"; \
    else \
      echo "ATTENTION: '$host' est introuvable dans .next."; \
      echo "  Le bundle ne pointe peut-etre pas sur l'instance attendue."; \
      echo "  En cas de doute, relancer le deploiement avec force=true."; \
    fi; \
    echo "--- hotes Supabase presents dans le bundle ---"; \
    grep -rahoE 'https://[a-z0-9.-]+\.supabase\.(co|com)|https://supabase\.[a-z0-9.-]+' .next 2>/dev/null \
      | sort -u | head -5 || true

# 3. Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]

