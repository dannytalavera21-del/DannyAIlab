#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="/opt/danny-ai-lab/DannyAIlab"
APP_DIR="$ROOT_DIR/apps/olive-rentals"
APP_NAME="olive-rentals"
HEALTH_URL="http://127.0.0.1:3002/health"

on_error() {
  local exit_code=$?
  printf 'ERROR: fallo en línea %s; comando: %s\n' "$1" "$2" >&2
  exit "$exit_code"
}
trap 'on_error "$LINENO" "$BASH_COMMAND"' ERR

printf 'Inicio: %s\n' "$(date --iso-8601=seconds)"
[[ -d "$ROOT_DIR" ]] || { printf 'ERROR: ROOT_DIR no existe.\n' >&2; exit 1; }
[[ -d "$ROOT_DIR/.git" ]] || { printf 'ERROR: ROOT_DIR no es un repositorio Git.\n' >&2; exit 1; }
[[ -d "$APP_DIR" ]] || { printf 'ERROR: APP_DIR no existe.\n' >&2; exit 1; }
[[ -f "$APP_DIR/package.json" ]] || { printf 'ERROR: falta package.json.\n' >&2; exit 1; }
[[ -f "$APP_DIR/.env" ]] || { printf 'ERROR: falta apps/olive-rentals/.env.\n' >&2; exit 1; }

cd "$ROOT_DIR"
if [[ -n "$(git status --porcelain)" ]]; then
  printf 'ERROR: hay cambios locales sin commit; se conservan intactos.\n' >&2
  exit 1
fi

git fetch origin main
git pull --ff-only origin main
cd "$APP_DIR"
npm ci

if npm run | grep -Eq '^[[:space:]]+check($|[[:space:]])'; then
  npm run check
else
  printf 'Aviso: no existe script check.\n'
fi
npm test

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$ROOT_DIR/ecosystem.config.js" --only "$APP_NAME" --env production --update-env
else
  pm2 start "$ROOT_DIR/ecosystem.config.js" --only "$APP_NAME" --env production
fi

pm2 save
sleep 5
health_response="$(curl --fail --silent --show-error "$HEALTH_URL")"
printf 'Health check: %s\n' "$health_response"
pm2 status "$APP_NAME"
printf 'Despliegue completado: %s\n' "$(date --iso-8601=seconds)"
