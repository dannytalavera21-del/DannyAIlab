# Seguridad inicial

## Estado actual

El sistema es experimental; aún no debe guardar datos sensibles de clientes ni considerarse listo para clientes externos.

## Controles ya existentes

- HTTPS, Nginx, Security Group, SSH restringido, `.env` ignorado, PM2 y Elastic IP.

Estos controles deben verificarse periódicamente.

## Controles pendientes prioritarios

1. Verificación `X-Hub-Signature-256`.
2. UFW.
3. Rate limiting.
4. Helmet.
5. Actualizaciones automáticas.
6. Rotación de logs.
7. Backups y restauraciones probadas.
8. MFA.
9. IAM de mínimo privilegio.
10. Monitoreo y alertas.
11. PostgreSQL con aislamiento multi-tenant.
12. Secret manager o cifrado de tokens.

## Secretos

Nunca guardar en Git `WHATSAPP_TOKEN`, `META_APP_SECRET`, `VERIFY_TOKEN`, `DATABASE_URL`, claves privadas ni credenciales AWS. Usar `.env` protegido o secret manager y evitar secretos en logs.

## Respuesta a incidentes

1. Detener o aislar tráfico.
2. Rotar tokens.
3. Revisar logs.
4. Revocar credenciales.
5. Restaurar un backup verificado.
6. Documentar el incidente.

## Checklist antes de vender

- Autenticación, roles y auditoría.
- Backups probados y pruebas de restauración.
- Cifrado, firma Meta y rate limiting.
- Privacidad, términos y retención de datos.
- Aislamiento probado entre organizaciones.
