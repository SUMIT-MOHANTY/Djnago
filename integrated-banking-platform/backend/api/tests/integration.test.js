const request = require('supertest');
const app = require('../app'); // Backend app instance

describe('Banking and Insurance Integration Tests', () => {
  let server;

  beforeAll(() => {
    if (typeof app.listen === 'function') {
      server = app.listen(0);
    }
  });

  afterAll((done) => {
    if (server && server.close) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
    });
  });

  describe('GET /api/user/:userId/balance', () => {
    it('should return user balance for banking account', async () => {
      const userId = 'usr-001';
      const response = await request(app).get(`/api/user/${userId}/balance`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('balance');
      expect(typeof response.body.balance).toBe('number');
    });

    it('should handle invalid user ID', async () => {
      const response = await request(app).get('/api/user/invalid-user/balance');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.balance).toBe(0);
    });
  });

  describe('GET /api/user/:userId/policies', () => {
    it('should return user insurance policies', async () => {
      const userId = 'usr-002';
      const response = await request(app).get(`/api/user/${userId}/policies`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('policies');
      expect(Array.isArray(response.body.policies)).toBe(true);
    });

    it('should return empty array for user with no policies', async () => {
      const userId = 'usr-001';
      const response = await request(app).get(`/api/user/${userId}/policies`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.policies).toHaveLength(0);
    });
  });

  describe('POST /api/premium-payment', () => {
    it('should process insurance premium payment', async () => {
      const paymentData = {
        userId: 'usr-002',
        policyId: 'pol-001',
        amount: 150.00
      };

      const response = await request(app)
        .post('/api/premium-payment')
        .send(paymentData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('paymentId');
      expect(response.body.policyId).toBe('pol-001');
    });

    it('should reject invalid payment amount', async () => {
      const paymentData = {
        userId: 'usr-002',
        policyId: 'pol-001',
        amount: -50
      };

      const response = await request(app)
        .post('/api/premium-payment')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle missing required fields', async () => {
      const paymentData = {
        userId: 'usr-002',
        amount: 150.00
      };

      const response = await request(app)
        .post('/api/premium-payment')
        .send(paymentData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
