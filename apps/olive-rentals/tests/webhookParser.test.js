const whatsappParser = require('../channels/whatsapp/webhookParser');

const integration = {
  integrationId: 'wa-default-rentals',
  organizationId: 'org-daniel-rentals',
  businessUnitId: 'business-unit-main',
  productId: 'olive-rentals',
  receivingPhoneNumberId: '1234567890',
  status: 'active'
};

describe('whatsappParser', () => {
  it('should normalize a text message', () => {
    const payload = {
      metadata: { phone_number_id: '1234567890' },
      contacts: [{ profile: { name: 'Usuario' }, wa_id: '5511999999999' }],
      messages: [
        {
          id: 'msg-1',
          from: '5511999999999',
          timestamp: '1700000000',
          type: 'text',
          text: { body: ' Hola mundo ' }
        }
      ]
    };

    const result = whatsappParser.parse(payload, integration);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      channel: 'whatsapp',
      organizationId: 'org-daniel-rentals',
      businessUnitId: 'business-unit-main',
      productId: 'olive-rentals',
      integrationId: 'wa-default-rentals',
      receivingPhoneNumberId: '1234567890',
      contactExternalId: '5511999999999',
      contactName: 'Usuario',
      messageId: 'msg-1',
      type: 'text',
      text: 'Hola mundo',
      originalText: ' Hola mundo '
    });
  });

  it('should normalize an image message without downloading', () => {
    const payload = {
      metadata: { phone_number_id: '1234567890' },
      contacts: [{ profile: { name: 'Usuario' }, wa_id: '5511999999999' }],
      messages: [
        {
          id: 'msg-2',
          from: '5511999999999',
          timestamp: '1700000000',
          type: 'image',
          image: {
            id: 'media-1',
            mime_type: 'image/jpeg',
            caption: 'Foto de prueba'
          }
        }
      ]
    };

    const result = whatsappParser.parse(payload, integration);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: 'image',
      mediaId: 'media-1',
      mimeType: 'image/jpeg',
      caption: 'Foto de prueba'
    });
  });

  it('should return empty array when payload has no messages', () => {
    const payload = {
      metadata: { phone_number_id: '1234567890' },
      contacts: [{ profile: { name: 'Usuario' }, wa_id: '5511999999999' }]
    };

    const result = whatsappParser.parse(payload, integration);

    expect(result).toEqual([]);
  });
});
