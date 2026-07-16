# Danny AI Lab Architecture v1

## Visión

Danny AI Lab será una plataforma SaaS multiempresa para construir productos especializados como Olive Rentals, Olive Dispatch, Olive Landscaping y productos futuros. Compartirán infraestructura, pero mantendrán aislada su lógica de negocio.

## Modelo comercial

El cliente no instala software: accede por navegador y sus usuarios interactúan mediante WhatsApp u otros canales. Cada cliente tiene su propia organización y puede conectar su número de WhatsApp. Dashboard y WhatsApp son interfaces de la misma plataforma; la automatización es el producto principal.

## Jerarquía principal

`platform → organization → businessUnit → product → integration → user → business data`

- **platform:** infraestructura y capacidades compartidas.
- **organization:** cliente o tenant aislado.
- **businessUnit:** división, sucursal o línea operativa.
- **product:** solución contratada, como Olive Rentals.
- **integration:** conexión concreta con un canal o sistema externo.
- **user:** persona autorizada dentro de una organización.
- **business data:** datos del negocio, ligados siempre a su tenant.

## Multi-tenant

- Todo dato de negocio debe incluir `organizationId` y, cuando corresponda, `businessUnitId`.
- Ninguna consulta debe mezclar organizaciones.
- `phone_number_id` debe resolver la integración y su `organizationId`.
- El código no asumirá un único cliente ni un único número de WhatsApp.
- Una organización puede tener varios productos y números de WhatsApp.
- Cada número pertenece a una integración concreta.
- Las credenciales se almacenarán cifradas en el futuro.

## Separación apps y packages

`apps/` contiene aplicaciones desplegables y lógica específica, como `olive-rentals` y el futuro `olive-dispatch`. `packages/` contendrá componentes reutilizables sin lógica de producto: `organizations-core`, `auth-core`, `whatsapp-core`, `conversation-engine`, `notifications-core`, `ai-core`, `storage-core`, `billing-core` y `audit-core`.

Si una funcionalidad sirve para varios productos, debe migrarse gradualmente a `packages`. Si solo sirve para uno, debe permanecer en `apps`.

## Arquitectura de canales

WhatsApp es un canal, no el producto:

```text
WhatsApp / Instagram / Web Chat / SMS
→ Channel Adapter → Normalized Message → Organization Resolution
→ Conversation Engine → Product Module → Internal Response → Channel Adapter
```

## Formato de mensaje normalizado

```js
{
  channel,
  organizationId,
  businessUnitId,
  productId,
  integrationId,
  receivingPhoneNumberId,
  contactExternalId,
  contactName,
  messageId,
  type,
  text,
  originalText,
  timestamp,
  rawMetadata
}
```

## Integraciones de WhatsApp

Cada cliente puede tener su propio número:

```text
incoming phone_number_id → whatsapp integration repository → organizationId
→ productId → businessUnitId → product logic → response using same receiving number
```

Se distinguen el número del bot, el teléfono del administrador y los teléfonos de usuarios autorizados; no son roles intercambiables.

## Seguridad

- Secretos solo en `.env` o secret manager; `.env` nunca en Git.
- Validar `X-Hub-Signature-256`; HTTPS obligatorio.
- UFW y Security Group mínimos; SSH restringido y MFA.
- Logs sin secretos, rate limiting y validación de inputs.
- Auditoría futura, tokens cifrados, backups y actualizaciones automáticas.
- No guardar documentos sensibles sin protección.

## Estrategia de despliegue

`Local VS Code + Codex → npm test → git commit → GitHub → git pull en EC2 → npm ci → npm test → pm2 reload → health check`

GitHub es la fuente oficial. El desarrollo ocurre localmente; EC2 solo sirve para despliegue y configuración.

## Ambientes

- **local**; **development**; **staging** (futuro); **production**.

El EC2 de producción no es un entorno de desarrollo.

## Versionamiento

`main` debe permanecer desplegable. Los commits serán descriptivos, sin force push a `main`; cambios grandes usarán ramas en el futuro. Se aplicará versionamiento semántico por aplicación o paquete.

## Convenciones

JavaScript CommonJS; `camelCase` para variables; `PascalCase` para clases; `kebab-case` para carpetas. IDs estables sin depender del nombre visible, fechas ISO 8601, dinero futuro en centavos enteros y zona horaria configurable por organización.

## Estado actual

Solo existe Olive Rentals. Usa almacenamiento en memoria y un único número configurado por `.env`; está preparado conceptualmente para resolver integraciones por `phone_number_id`. Aún no hay autenticación ni base de datos y no está listo para clientes externos.

## Roadmap técnico

- **Fase 1:** seguridad del webhook, despliegue estable, documentación, Elastic IP y UFW.
- **Fase 2:** `organizations-core`, PostgreSQL, modelo multi-tenant e integraciones WhatsApp.
- **Fase 3:** autenticación, roles, dashboard y Olive Rentals MVP completo.
- **Fase 4:** Olive Dispatch sobre el núcleo compartido.
- **Fase 5:** onboarding, billing y primer cliente de pago.
