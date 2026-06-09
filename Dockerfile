# --- Stage 1: Build ---
FROM node:22-slim AS builder

# Habilitar pnpm nativamente
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar configuraciones de dependencias y lockfile de pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Instalar dependencias exactas usando el lockfile
RUN pnpm install --frozen-lockfile

# Copiar archivos fuentes
COPY index.ts tsconfig.json build.js ./

# Compilar el bundle dist/index.js con esbuild
RUN pnpm build

# --- Stage 2: Runtime (Lanzamiento Final) ---
FROM node:22-slim AS runner

# Evitar que puppeteer descargue otra copia de Chromium y forzar ruta al de sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

# Instalar Google Chrome oficial de forma estable (instala automáticamente todas sus dependencias de Linux)
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    gnupg \
    ca-certificates \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.pub' \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Copiar únicamente el archivo bundle generado
COPY --from=builder /app/dist/index.js ./dist/index.js
COPY package.json ./

CMD ["pnpm", "start"]
