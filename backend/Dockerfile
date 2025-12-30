# backend/Dockerfile
FROM node:18-bullseye-slim

WORKDIR /app

# Установим системные зависимости (netcat нужен для entrypoint wait)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    ca-certificates \
    netcat-openbsd \
    libssl1.1 \
 && rm -rf /var/lib/apt/lists/*

# Копируем package.json и package-lock.json и ставим зависимости (включая dev deps — нужны prisma & миграции)
COPY backend/package*.json ./
RUN npm ci

# Копируем entrypoint (должен быть в проекте: backend/docker-entrypoint.sh)
COPY backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Копируем исходники (включая prisma/schema.prisma и migrations)
COPY backend/ ./

# Сгенерируем Prisma Client на этапе сборки (ускорит старт)
RUN npx prisma generate || echo "prisma generate failed (continuing)"

ENV NODE_ENV=production
EXPOSE 4000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]