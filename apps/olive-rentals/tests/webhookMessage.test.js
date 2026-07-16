const request = require('supertest');
const app = require('../app');
const environment = require('../config/environment');
const processedMessageStore = require('../core/messaging/processedMessageStore');

jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('POST /webhook', () => {
  beforeEach(() => {
    processedMessageStore.delete('msg-1');
    processedMessageStore.delete('msg-duplicate');
  });

  it('should respond 200 without messages', async () => {
    const payload = { entry: [] };
    const response = await request(app).post('/webhook').send(payload);
    expect(response.status).toBe(200);
  });

  it('should ignore duplicate message IDs', async () => {
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
                    text: { body: 'test' }
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    processedMessageStore.add('msg-duplicate');

    const response = await request(app).post('/webhook').send(payload);
    expect(response.status).toBe(200);
  });

  it('should not process messages for unknown integration', async () => {
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
                    text: { body: 'test' }
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
  });
});
