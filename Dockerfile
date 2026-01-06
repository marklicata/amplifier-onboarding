# Multi-stage build for Next.js app with Python support

# Stage 1: Dependencies
FROM node:20-bullseye-slim AS deps

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install Node.js dependencies
RUN npm ci

# Copy Python requirements and install
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt


# Stage 2: Builder
FROM node:20-bullseye-slim AS builder

# Install Python
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /usr/local/lib/python3.9/dist-packages /usr/local/lib/python3.9/dist-packages

# Copy application files
COPY . .

# Set environment variable for build
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js app
RUN npm run build


# Stage 3: Runner
FROM node:20-bullseye-slim AS runner

# Install Python runtime
RUN apt-get update && apt-get install -y \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Copy Python dependencies
COPY --from=builder /usr/local/lib/python3.9/dist-packages /usr/local/lib/python3.9/dist-packages

# Copy Python script and config files
COPY --chown=nextjs:nodejs lib ./lib
COPY --chown=nextjs:nodejs requirements.txt ./

USER nextjs

EXPOSE 3001

ENV PORT 3001

CMD ["npm", "start"]
