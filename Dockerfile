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

WORKDIR /app

# Copiar únicamente el archivo bundle generado
COPY --from=builder /app/dist/index.js ./dist/index.js
COPY package.json ./

CMD ["node", "dist/index.js"]
