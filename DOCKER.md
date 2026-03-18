# Запуск YoungLife в Docker

Краткая инструкция: как поднять сайт в Docker с готовой БД и администратором.

## Требования

- [Docker](https://docs.docker.com/get-docker/) и [Docker Compose](https://docs.docker.com/compose/install/) (или Docker Desktop с Compose).

## Запуск

В корне репозитория:

```bash
docker compose up --build
```

При первом запуске:

1. **PostgreSQL** поднимается с базой `younglife_db` (пользователь `younglife`, пароль `younglifepass`).
2. **Backend** ждёт готовности БД, применяет миграции Prisma и выполняет сид.
3. **Сид** создаёт пользователя с правами админа, если его ещё нет.

## Админ-пользователь по умолчанию

После первого запуска в БД есть администратор:

| Параметр | Значение |
|----------|----------|
| **Email** | `admin@younglife.local` |
| **Пароль** | `admin123` |

Изменить логин/пароль админа можно переменными в `docker-compose.yml` (секция `backend` → `environment`):

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PWD`

Либо задать их в `.env` в корне проекта (для подстановки в compose):  
`SEED_ADMIN_EMAIL=...` и `SEED_ADMIN_PWD=...`.

## Доступ к сервисам

| Сервис   | URL |
|----------|-----|
| Фронтенд | http://localhost:5173 |
| API      | http://localhost:4000 |
| PostgreSQL | localhost:5432 (логин `younglife`, БД `younglife_db`) |

В production, при включенном HTTPS через nginx, фронтенд и API будут доступны по одному домену: `https://younglife-russia.ru`.

## Остановка

```bash
docker compose down
```

Данные БД сохраняются в volume `pgdata`. Чтобы удалить и их:

```bash
docker compose down -v
```

## Переменные окружения (опционально)

В корне проекта можно создать файл `.env` (он не в git) и задать, например:

- `JWT_SECRET` — секрет для JWT (в production обязательно сменить).
- `FRONTEND_URL` — URL фронта для CORS.
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PWD` — учётные данные админа при сиде.

В `docker-compose.yml` для backend уже заданы значения по умолчанию, поэтому запуск возможен и без `.env`.

Для локальной разработки backend без Docker скопируйте `backend/.env.example` в `backend/.env` и настройте `DATABASE_URL` и остальное при необходимости.

## Проблемы при сборке

**Ошибка `TLS handshake timeout` при загрузке образа `node:18-bullseye-slim`** — Docker не может достучаться до Docker Hub (сеть, VPN, файрвол). Что сделать:

- Повторить сборку позже или с другой сети.
- Отключить VPN/прокси и снова запустить `docker compose up --build`.
- Проверить доступ к реестру: `docker pull node:18-bullseye-slim`.
- Если есть корпоративное зеркало Docker Hub — указать его в Docker Desktop (Settings → Docker Engine → `registry-mirrors`).
