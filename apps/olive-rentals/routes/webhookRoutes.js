const express = require('express');
const environment = require('../config/environment');
const whatsappService = require('../channels/whatsapp/whatsappService');
const whatsappParser = require('../channels/whatsapp/webhookParser');
const integrationRepository = require('../integrations/whatsapp/inMemoryWhatsAppIntegrationRepository');
const processedMessageStore = require('../core/messaging/processedMessageStore');
const conversationEngine = require('../core/conversation/conversationEngine');

const router = express.Router();

function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return 'unknown';
  }
  const lastDigits = phoneNumber.slice(-4);
  return `******${lastDigits}`;
}

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === environment.meta.verifyToken) {
    return res.status(200).send(challenge);
  }

  return res.status(403).send('Forbidden');
});

router.post('/webhook', (req, res) => {
  res.sendStatus(200);

  const payload = req.body;
  const entries = Array.isArray(payload.entry) ? payload.entry : [];

  entries.forEach(entry => {
    const changes = Array.isArray(entry.changes) ? entry.changes : [];

    changes.forEach(change => {
      const value = change.value || {};
      const phoneNumberId = value.metadata && value.metadata.phone_number_id;

      if (!phoneNumberId) {
        console.warn('Received webhook without phone_number_id, skipping event');
        return;
      }

      const integration = integrationRepository.findByReceivingPhoneNumberId(phoneNumberId);

      if (!integration) {
        console.warn(`No WhatsApp integration found for receivingPhoneNumberId=${phoneNumberId}`);
        return;
      }

      const messages = whatsappParser.parse(value, integration);

      messages.forEach(message => {
        if (processedMessageStore.has(message.messageId)) {
          return;
        }

        processedMessageStore.add(message.messageId);

        const safeLog = {
          type: message.type,
          messageId: message.messageId,
          contactName: message.contactName || 'unknown',
          contactExternalId: maskPhoneNumber(message.contactExternalId),
          receivingPhoneNumberId: message.receivingPhoneNumberId
        };

        console.log('WhatsApp message received', safeLog);

        setImmediate(async () => {
          try {
            const response = conversationEngine.handleMessage(message);
            if (response && response.type === 'text' && response.text) {
              await whatsappService.sendTextMessage({
                to: message.contactExternalId,
                body: response.text,
                receivingPhoneNumberId: message.receivingPhoneNumberId
              });
            }
          } catch (error) {
            console.error('Error processing WhatsApp message', error.message || error);
          }
        });
      });
    });
  });
});

module.exports = router;
