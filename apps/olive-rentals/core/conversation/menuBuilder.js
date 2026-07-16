function buildMainMenu() {
  return `🏠 Olive Rentals

¡Hola! Gracias por comunicarte.

Selecciona una opción:

1. Ver propiedades disponibles
2. Programar una visita
3. Enviar comprobante de pago
4. Reportar mantenimiento
5. Hablar con administración

Responde con el número de la opción.`;
}

function buildHelpMessage() {
  return `Puedes escribir:
- menú, para regresar al inicio;
- cancelar, para cancelar una operación;
- 1, para ver disponibilidad.`;
}

function buildCancelMessage() {
  return `La operación fue cancelada.`;
}

module.exports = {
  buildMainMenu,
  buildHelpMessage,
  buildCancelMessage
};
