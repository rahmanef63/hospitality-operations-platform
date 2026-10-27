# glibc base throughout: bun has no musl build and the dependency layer it
# produces must stay ABI-compatible with the builder and runner stages.
FROM node:22-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS dependencies
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl unzip \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.4.2"
ENV PATH="/root/.bun/bin:${PATH}"
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://example.com
ARG NEXT_PUBLIC_CONVEX_URL=""
ARG PRIMARY_PROPERTY_STREET_ADDRESS=""
ARG PRIMARY_PROPERTY_WHATSAPP_NUMBER=""
ARG PRIMARY_PROPERTY_GOOGLE_MAPS_EMBED_URL=""
ARG PRIMARY_PROPERTY_LATITUDE=""
ARG PRIMARY_PROPERTY_LONGITUDE=""
ARG PRIMARY_PROPERTY_LOCALITY=""
ARG PRIMARY_PROPERTY_DESTINATION=""
ARG PRIMARY_PROPERTY_ADMINISTRATIVE_AREA=""
ARG PRIMARY_PROPERTY_REGION=""
ARG PRIMARY_PROPERTY_POSTAL_CODE=""
ARG PRIMARY_PROPERTY_COUNTRY_CODE=""
ARG PRIMARY_PROPERTY_COUNTRY_NAME=""
ARG PRIMARY_PROPERTY_DISPLAY_ADDRESS=""
ARG PRIMARY_PROPERTY_MAPS_PROFILE_URL=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL \
    PRIMARY_PROPERTY_STREET_ADDRESS=$PRIMARY_PROPERTY_STREET_ADDRESS \
    PRIMARY_PROPERTY_WHATSAPP_NUMBER=$PRIMARY_PROPERTY_WHATSAPP_NUMBER \
    PRIMARY_PROPERTY_GOOGLE_MAPS_EMBED_URL=$PRIMARY_PROPERTY_GOOGLE_MAPS_EMBED_URL \
    PRIMARY_PROPERTY_LATITUDE=$PRIMARY_PROPERTY_LATITUDE \
    PRIMARY_PROPERTY_LONGITUDE=$PRIMARY_PROPERTY_LONGITUDE \
    PRIMARY_PROPERTY_LOCALITY=$PRIMARY_PROPERTY_LOCALITY \
    PRIMARY_PROPERTY_DESTINATION=$PRIMARY_PROPERTY_DESTINATION \
    PRIMARY_PROPERTY_ADMINISTRATIVE_AREA=$PRIMARY_PROPERTY_ADMINISTRATIVE_AREA \
    PRIMARY_PROPERTY_REGION=$PRIMARY_PROPERTY_REGION \
    PRIMARY_PROPERTY_POSTAL_CODE=$PRIMARY_PROPERTY_POSTAL_CODE \
    PRIMARY_PROPERTY_COUNTRY_CODE=$PRIMARY_PROPERTY_COUNTRY_CODE \
    PRIMARY_PROPERTY_COUNTRY_NAME=$PRIMARY_PROPERTY_COUNTRY_NAME \
    PRIMARY_PROPERTY_DISPLAY_ADDRESS=$PRIMARY_PROPERTY_DISPLAY_ADDRESS \
    PRIMARY_PROPERTY_MAPS_PROFILE_URL=$PRIMARY_PROPERTY_MAPS_PROFILE_URL
RUN bun run build

FROM node:22-slim AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
# groupadd/useradd, not addgroup/adduser: Debian's adduser --system ignores
# --gid and would put nextjs in nogroup, so --chown=nextjs:nodejs below would
# grant a group the running user is not in.
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs --no-create-home nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
