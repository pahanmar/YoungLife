FROM node:18-bullseye-slim
WORKDIR /app

# системные утилиты, если нужны
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

# если используете dev server:
EXPOSE 5173
CMD ["npm","run","dev"]