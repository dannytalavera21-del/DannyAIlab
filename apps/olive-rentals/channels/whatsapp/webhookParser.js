const parseTextMessage = (message) => {
  const originalText = message.text?.body || '';
  return {
    type: 'text',
    text: originalText.trim(),
    originalText
  };
};

const parseMediaMessage = (message) => {
  const mediaType = message.type;
  const payload = message[mediaType] || {};

  return {
    type: mediaType,
    mediaId: payload.id || payload.media_id || null,
    mimeType: payload.mime_type || payload.mimeType || null,
    filename: payload.filename || null,
    caption: payload.caption || null
  };
};

const parseLocationMessage = (message) => {
  return {
    type: 'location',
    title: message.location?.name || null,
    latitude: message.location?.latitude || null,
    longitude: message.location?.longitude || null,
    address: message.location?.address || null
  };
};

const parseInteractiveMessage = (message) => {
  return {
    type: 'interactive',
    interactive: message.interactive || null
  };
};

const parseButtonMessage = (message) => {
  return {
    type: 'button',
    button: message.button || null
  };
};

function normalizeMessage(value, integration, contact, message) {
  const contactName = contact?.profile?.name || 'unknown';
  const contactExternalId = contact?.wa_id || message.from || 'unknown';
  const base = {
    channel: 'whatsapp',
    organizationId: integration.organizationId,
    businessUnitId: integration.businessUnitId,
    productId: integration.productId,
    integrationId: integration.integrationId,
    receivingPhoneNumberId: value.metadata?.phone_number_id || integration.receivingPhoneNumberId,
    contactExternalId,
    contactName,
    messageId: message.id,
    timestamp: message.timestamp,
    rawMetadata: {
      messageId: message.id,
      from: message.from,
      metadata: value.metadata
    }
  };

  if (message.type === 'text') {
    const textPayload = parseTextMessage(message);
    return {
      ...base,
      type: 'text',
      text: textPayload.text,
      originalText: textPayload.originalText
    };
  }

  if (['image', 'document', 'audio', 'video'].includes(message.type)) {
    const mediaPayload = parseMediaMessage(message);
    return {
      ...base,
      type: message.type,
      ...mediaPayload,
      text: message.caption || null,
      originalText: null
    };
  }

  if (message.type === 'location') {
    const locationPayload = parseLocationMessage(message);
    return {
      ...base,
      ...locationPayload,
      text: null,
      originalText: null
    };
  }

  if (message.type === 'interactive') {
    const interactivePayload = parseInteractiveMessage(message);
    return {
      ...base,
      ...interactivePayload,
      text: null,
      originalText: null
    };
  }

  if (message.type === 'button') {
    const buttonPayload = parseButtonMessage(message);
    return {
      ...base,
      ...buttonPayload,
      text: null,
      originalText: null
    };
  }

  return {
    ...base,
    type: 'unknown',
    text: null,
    originalText: null
  };
}

function parse(value, integration) {
  const messages = Array.isArray(value.messages) ? value.messages : [];
  const contacts = Array.isArray(value.contacts) ? value.contacts : [];
  const contact = contacts[0] || null;

  if (!messages.length) {
    return [];
  }

  return messages.map(message => normalizeMessage(value, integration, contact, message));
}

module.exports = {
  parse
};
