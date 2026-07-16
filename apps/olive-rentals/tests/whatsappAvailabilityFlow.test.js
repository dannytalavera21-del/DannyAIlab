const request = require('supertest');
const app = require('../app');
const whatsappService = require('../channels/whatsapp/whatsappService');
const environment = require('../config/environment');
const processedMessageStore = require('../core/messaging/processedMessageStore');

jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('POST /webhook WhatsApp availability flow', () => {
  beforeEach(() => {
    processedMessageStore.delete('msg-1');
    processedMessageStore.delete('msg-duplicate');
    jest.clearAllMocks();
  });

  it('should call whatsappService.sendTextMessage for a new hola message', async () => {
    const sendSpy = jest.spyOn(whatsappService, 'sendTextMessage').mockResolvedValue({});
    const payload = {
      entry: [
        {
          changes: [
            {
              value: {
                metadata: { phone_number_id: environment.meta.phoneNumberId },
                contacts: [{ profile: { name: 'Usuario' }, wa_id: '5511999999999' }],
                messages: [
                  {
                    id: 'msg-1',
                    from: '5511999999999',
                    timestamp: '1700000000',
                    type: 'text',
                    text: { body: 'hola' }
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    const response = await request(app).post('/webhook').send(payload);
    expect(response.status).toBe(200);

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith({
      to: '5511999999999',
      body: expect.stringContaining('Olive Rentals'),
      receivingPhoneNumberId: environment.meta.phoneNumberId
    });
  });

  it('should not call whatsappService.sendTextMessage for duplicate messages', async () => {
    const sendSpy = jest.spyOn(whatsappService, 'sendTextMessage').mockResolvedValue({});
    processedMessageStore.add('msg-duplicate');

    const payload = {
      entry: [
        {
          changes: [
            {
              value: {
                metadata: { phone_number_id: environment.meta.phoneNumberId },
                contacts: [{ profile: { name: 'Usuario' }, wa_id: '5511999999999' }],
                messages: [
                  {
                    id: 'msg-duplicate',
                    from: '5511999999999',
                    timestamp: '1700000000',
                    type: 'text',
                    text: { body: 'hola' }
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    const response = await request(app).post('/webhook').send(payload);
    expect(response.status).toBe(200);

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should not call whatsappService.sendTextMessage for unknown integration', async () => {
    const sendSpy = jest.spyOn(whatsappService, 'sendTextMessage').mockResolvedValue({});
    const payload = {
      entry: [
        {
          changes: [
            {
              value: {
                metadata: { phone_number_id: 'unknown-phone-id' },
                contacts: [{ profile: { name: 'Usuario' }, wa_id: '5511999999999' }],
                messages: [
                  {
                    id: 'msg-1',
                    from: '5511999999999',
                    timestamp: '1700000000',
                    type: 'text',
                    text: { body: 'hola' }
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    const response = await request(app).post('/webhook').send(payload);
    expect(response.status).toBe(200);

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(sendSpy).not.toHaveBeenCalled();
  });
});
