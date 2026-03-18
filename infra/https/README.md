# HTTPS для `younglife-russia.ru` (nginx + Let’s Encrypt)

## 1) Nginx конфиг
Шаблон конфигурации лежит в `infra/https/nginx-younglife-russia.ru.conf`.

Его нужно скопировать в окружение Nginx так, чтобы он стал активным для `server_name younglife-russia.ru`
(например, в `/etc/nginx/sites-available/` + символическая ссылка в `sites-enabled/`, либо в `/etc/nginx/conf.d/`).

Далее:
- `nginx -t`
- `systemctl reload nginx`

Конфиг ожидает, что на хосте docker-приложения доступны так:
- frontend: `http://127.0.0.1:5173`
- backend: `http://127.0.0.1:4000`

## 2) Сертификат и автопродление
Скрипт выпуска сертификата через `certbot` и включает авто-продление:

`infra/https/setup-certbot-younglife-russia.sh`

Запуск (на вашей машине, с которой есть SSH к серверу):
```bash
EMAIL="you@example.com" ./infra/https/setup-certbot-younglife-russia.sh
```

Он подключится к `root@2a03:6f01:1:2::1:dc31`, установит `certbot` (если нужно),
запустит `certbot --nginx` и сделает `renew --dry-run`.

Certbot обычно ставит systemd timer `certbot.timer` автоматически; это отвечает за автопродление.

## Важно
- Для HTTP-01 challenge должны быть открыты `80/tcp` извне.
- Проверьте, что AAAA/A запись домена `younglife-russia.ru` указывает на `2a03:6f01:1:2::1:dc31`.

