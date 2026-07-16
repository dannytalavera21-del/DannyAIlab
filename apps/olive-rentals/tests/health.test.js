const request = require('supertest');
const app = require('../app');

describe('GET /health', () => {
  it('should return service health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      service: 'olive-rentals',
      version: '0.1.0'
    });
  });
});
