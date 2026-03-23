const express = require('express');
const app = express();
const mockBanking = require('./tests/mockBankingService');
const mockInsurance = require('./tests/mockInsuranceService');

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// User balance endpoint
app.get('/api/user/:userId/balance', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await mockBanking.getUserBalance(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User policies endpoint
app.get('/api/user/:userId/policies', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await mockInsurance.getUserPolicies(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Premium payment endpoint
app.post('/api/premium-payment', async (req, res) => {
  try {
    const { policyId, amount } = req.body;

    if (!policyId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const result = await mockInsurance.processPremiumPayment(policyId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
