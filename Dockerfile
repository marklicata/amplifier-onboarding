# Simple Next.js + Python Docker image
FROM node:20-bookworm-slim

# Install Python, git, curl, and build tools (needed for pip install from GitHub and uv)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    git \
    curl \
    build-essential \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && ln -sf /usr/bin/pip3 /usr/bin/pip \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /usr/lib/python3*/EXTERNALLY-MANAGED

# Install uv (Python package manager required by amplifier-core)
# Using the standalone installer and ensuring it's in PATH
RUN curl -LsSf https://astral.sh/uv/install.sh | sh && \
    ln -sf /root/.local/bin/uv /usr/local/bin/uv && \
    ln -sf /root/.local/bin/uvx /usr/local/bin/uvx

# Configure uv to work with system Python and allow system package modifications
ENV UV_SYSTEM_PYTHON=1
ENV UV_PROJECT_ENVIRONMENT=/usr/local

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* requirements.txt ./

# Install Node.js dependencies
RUN npm ci

# Install Python dependencies from GitHub
# Use UV_CACHE_DIR to ensure uv has a writable cache directory
ENV UV_CACHE_DIR=/tmp/uv-cache
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy application code
COPY . .

# Validate all dependencies are installed correctly
RUN python3 lib/amplifier/python/validate-deps.py

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Set production environment
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
