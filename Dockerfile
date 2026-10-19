# OptiMedia Studio - Production Container Image
# Multi-stage container with FFmpeg for browser-based video optimization

FROM node:20-slim

# Install system dependencies: FFmpeg, FFprobe, curl for healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Upgrade npm to stable 10.9.2 (fixes Arborist 'edgesOut' null property crash present in npm 10.8.2)
RUN npm install -g npm@10.9.2

WORKDIR /app

# Copy package manifests first for efficient Docker layer caching
COPY package.json package-lock.json* tsconfig.json vite.config.ts ./

# Install application dependencies cleanly
RUN npm install

# Copy application source code and assets
COPY server.ts index.html metadata.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY scripts/ ./scripts/

# Build production React SPA bundle
RUN npm run build

# Default environment configuration
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=400"

# Expose server port
EXPOSE 3000

# Container health probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the full-stack server
CMD ["npm", "start"]
