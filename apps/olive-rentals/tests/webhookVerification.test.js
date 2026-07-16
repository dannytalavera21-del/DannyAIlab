const request = require('supertest');
const app = require('../app');
const environment = require('../config/environment');

describe('GET /webhook', () => {
  it('should return challenge when token is correct', async () => {
    const response = await request(app)
      .get('/webhook')
      .query({
        'hub.mode': 'subscribe',
        'hub.verify_token': environment.meta.verifyToken,
        'hub.challenge': '12345'
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe('12345');
  });

  it('should return 403 when token is incorrect', async () => {
    const response = await request(app)
      .get('/webhook')
      .query({
        'hub.mode': 'subscribe',
        'hub.verify_token': 'bad-token',
        'hub.challenge': '12345'
      });

    expect(response.status).toBe(403);
  });
});
