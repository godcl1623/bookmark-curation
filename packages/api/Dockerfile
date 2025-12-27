# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./
COPY packages/api/package.json ./packages/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY packages/api ./packages/api
COPY packages/shared ./packages/shared
COPY prisma ./prisma
COPY tsconfig.json ./

# Generate Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build API (shared package는 소스 그대로 사용)
RUN npm run build -w @linkvault/api

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json* ./
COPY packages/api/package.json ./packages/api/
COPY packages/shared/package.json ./packages/shared/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/shared/src ./packages/shared/src
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy entrypoint script
COPY packages/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3006

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/entrypoint.sh"]
