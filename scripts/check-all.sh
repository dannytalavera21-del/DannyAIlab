#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
APP_DIR="$ROOT_DIR/apps/olive-rentals"

[[ -f "$APP_DIR/package.json" ]] || { printf 'ERROR: no se encontró Olive Rentals en %s\n' "$APP_DIR" >&2; exit 1; }
cd "$APP_DIR"

if [[ ! -d node_modules ]]; then
  printf 'Instalando dependencias reproducibles con npm ci...\n'
  npm ci
else
  printf 'node_modules existe; se omite npm ci.\n'
fi

printf 'Ejecutando check...\n'
npm run check
printf 'Ejecutando pruebas...\n'
npm test
printf '\nResumen: check y pruebas finalizaron correctamente.\n'
