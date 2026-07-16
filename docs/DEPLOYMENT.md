# Despliegue

## Arquitectura actual

`GitHub → EC2 → Nginx → PM2 → Olive Rentals`

## Rutas

- Repositorio: `/opt/danny-ai-lab/DannyAIlab`
- Aplicación: `/opt/danny-ai-lab/DannyAIlab/apps/olive-rentals`

## Despliegue manual seguro

Desde local:

```bash
git status
git add .
git commit
git push
```

Desde EC2:

```bash
bash /opt/danny-ai-lab/DannyAIlab/scripts/deploy-olive-rentals.sh
```

## Primera configuración PM2

```bash
pm2 start ecosystem.config.js --only olive-rentals --env production
pm2 save
pm2 startup
```

El comando generado por `pm2 startup` debe revisarse y ejecutarse manualmente.

## Archivos no versionados

- `apps/olive-rentals/.env`, certificados SSL, configuración Nginx, logs y datos persistentes.

## Rollback manual

1. Identificar el commit estable anterior.
2. Crear una rama temporal o hacer checkout explícito de ese commit.
3. Instalar dependencias y ejecutar pruebas.
4. Publicar la corrección por el flujo normal y volver a desplegar.
5. No automatizar `git reset --hard` ni borrar cambios locales.

## Health checks

```bash
curl http://127.0.0.1:3002/health
curl https://rentals-api.olivedispatchservices.com/health
```

## Troubleshooting

```bash
pm2 status
pm2 logs olive-rentals --lines 100
sudo nginx -t
sudo systemctl status nginx
sudo lsof -i :3002
curl -H "Host: rentals-api.olivedispatchservices.com" http://127.0.0.1/health
```

`EADDRINUSE` indica que otro proceso escucha en 3002. Identifíquelo con `lsof`, confirme si pertenece a PM2 y revise estado y logs. Detenga o recargue mediante su supervisor; no use `kill -9` como primera opción.
