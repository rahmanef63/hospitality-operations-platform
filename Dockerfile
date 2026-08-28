FROM node:22-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://kamynaliving.com
ARG RUMA_KAMYNA_STREET_ADDRESS=""
ARG RUMA_KAMYNA_WHATSAPP_NUMBER=""
ARG RUMA_KAMYNA_GOOGLE_MAPS_EMBED_URL=""
ARG RUMA_KAMYNA_LATITUDE=""
ARG RUMA_KAMYNA_LONGITUDE=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    RUMA_KAMYNA_STREET_ADDRESS=$RUMA_KAMYNA_STREET_ADDRESS \
    RUMA_KAMYNA_WHATSAPP_NUMBER=$RUMA_KAMYNA_WHATSAPP_NUMBER \
    RUMA_KAMYNA_GOOGLE_MAPS_EMBED_URL=$RUMA_KAMYNA_GOOGLE_MAPS_EMBED_URL \
    RUMA_KAMYNA_LATITUDE=$RUMA_KAMYNA_LATITUDE \
    RUMA_KAMYNA_LONGITUDE=$RUMA_KAMYNA_LONGITUDE
RUN npm run build

FROM node:22-alpine AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
