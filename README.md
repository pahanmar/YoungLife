Веб-приложение YoungLife Russia.

## Документация

| Документ | Описание |
|----------|----------|
| [DOCKER.md](./DOCKER.md) | Локальный запуск в Docker (разработка) |
| [infra/https/README.md](./infra/https/README.md) | Кратко про nginx и Let's Encrypt |

## Быстрый старт (локально)

```bash
docker compose up --build
```

- Фронтенд: http://localhost:5173  
- API: http://localhost:4000  

## Production

Сайт: https://younglife-russia.ru

```bash
cd /opt/YoungLife
git pull
docker compose -f docker-compose.prod.yml up -d --build
```
