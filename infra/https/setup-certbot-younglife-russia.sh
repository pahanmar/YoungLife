#!/usr/bin/env bash
set -euo pipefail

# Выпускает Let's Encrypt сертификат для younglife-russia.ru и включает автопродление через certbot.
#
# Требования на сервере:
# - домен `younglife-russia.ru` должен резолвиться на этот сервер
# - на сервере должен быть доступен Nginx (порты 80/443 в интернет)
# - у вас есть SSH-доступ (обычно root) к хосту
#
# Использование:
#   EMAIL="you@example.com" ./setup-certbot-younglife-russia.sh
#

DOMAIN="${DOMAIN:-younglife-russia.ru}"
EMAIL="${EMAIL:-}"
SSH_TARGET="${SSH_TARGET:-root@2a03:6f01:1:2::1:dc31}"

if [[ -z "$EMAIL" ]]; then
  echo "Missing EMAIL. Usage: EMAIL=\"you@example.com\" $0"
  exit 1
fi

echo "==> Connecting to $SSH_TARGET"

ssh -o StrictHostKeyChecking=accept-new "$SSH_TARGET" "bash -lc '
set -euo pipefail

echo \"==> Installing certbot (if needed) for domain: $DOMAIN\"
apt-get update -y
apt-get install -y certbot python3-certbot-nginx

echo \"==> Requesting/issuing certificate via nginx plugin\"
certbot --nginx \
  -d \"$DOMAIN\" \
  -m \"$EMAIL\" \
  --agree-tos \
  --no-eff-email \
  --redirect

echo \"==> Dry-run renewal check\"
certbot renew --dry-run

echo \"==> Certbot timers (best effort)\"
systemctl list-timers --all | grep -i certbot || true
'"

echo "==> Done"

