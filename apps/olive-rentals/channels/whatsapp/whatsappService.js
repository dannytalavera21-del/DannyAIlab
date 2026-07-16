const { createClient } = require('./whatsappClient');

function sendTextMessage({ to, body, receivingPhoneNumberId, client }) {
  const whatsappClient = createClient(client);

  if (!to || typeof to !== 'string' || !to.trim()) {
    throw new Error('Recipient phone number is required');
  }

  if (!body || typeof body !== 'string' || !body.trim()) {
    throw new Error('Message body is required');
  }

  if (!receivingPhoneNumberId || typeof receivingPhoneNumberId !== 'string') {
    throw new Error('Receiving phone number ID is required');
  }

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body
    }
  };

  return whatsappClient.sendMessage(payload);
}

module.exports = {
  sendTextMessage
};
