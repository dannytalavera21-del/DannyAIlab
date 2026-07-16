# Olive Rentals

Olive Rentals es un servicio independiente para administrar propiedades y unidades rentables dentro de una organización. Está diseñado para integrarse en el futuro con la plataforma Danny AI Lab.

## Qué es Olive Rentals

Olive Rentals modela una jerarquía de organización → property → rentalUnit para ofrecer disponibilidad de unidades en propiedades de renta.

## Jerarquía

- `organization` representa la entidad administrativa.
- `property` agrupa una ubicación física o inmueble.
- `rentalUnit` es una unidad disponible para renta dentro de una propiedad.

## Modalidades de renta

- `by_unit`: la propiedad se renta por unidad individual.
- `whole_property`: la propiedad se renta completa como una sola unidad.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

## Pruebas

```bash
npm test
```

## Qué sigue en la siguiente etapa

- Integración con WhatsApp y Meta webhooks
- Gestión de prospectos
- Pagos y cobros
- Autenticación y dashboard
- Persistencia en base de datos
- Funcionalidades de mantenimiento
- Capacidades de IA

## Etapa 2 — WhatsApp Webhook

1. Copia `.env.example` a `.env`.
2. Completa `VERIFY_TOKEN`.
3. Completa `WHATSAPP_TOKEN`.
4. Completa `PHONE_NUMBER_ID`.
5. Ejecuta `npm run dev`.
6. Prueba `GET /health`.
7. Prueba la verificación manual:

```bash
curl "http://localhost:3002/webhook?hub.mode=subscribe&hub.verify_token=TU_TOKEN&hub.challenge=12345"
```

Debe responder `12345`.

Por ahora, el webhook solo recibe eventos y normaliza mensajes entrantes, pero no responde automáticamente a los usuarios. El siguiente paso será conectar el mensaje normalizado con el motor de conversación.

## Etapa 3 — Menú y disponibilidad por WhatsApp

1. El bot ya responde mensajes de texto.
2. La opción 1 permite navegar:
   - propiedad;
   - unidad rentable.
3. Las opciones 2 a 5 todavía son temporales.
4. Los datos siguen en memoria.
5. Las sesiones se borran al reiniciar.
6. El siguiente paso será registro de prospectos y solicitud de visita.
