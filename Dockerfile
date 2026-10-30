FROM node:22-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

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
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL \
    PRIMARY_PROPERTY_STREET_ADDRESS=$PRIMARY_PROPERTY_STREET_ADDRESS \
    PRIMARY_PROPERTY_WHATSAPP_NUMBER=$PRIMARY_PROPERTY_WHATSAPP_NUMBER \
    PRIMARY_PROPERTY_GOOGLE_MAPS_EMBED_URL=$PRIMARY_PROPERTY_GOOGLE_MAPS_EMBED_URL \
    PRIMARY_PROPERTY_LATITUDE=$PRIMARY_PROPERTY_LATITUDE \
    PRIMARY_PROPERTY_LONGITUDE=$PRIMARY_PROPERTY_LONGITUDE
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
