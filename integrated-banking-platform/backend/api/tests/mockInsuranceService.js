const mockPolicies = [
  { id: 'pol-001', userId: 'usr-002', policyType: 'life', premium: 150.00, active: true },
  { id: 'pol-002', userId: 'usr-002', policyType: 'auto', premium: 200.00, active: true }
];

module.exports = {
  getUserPolicies: (userId) => {
    const policies = mockPolicies.filter(p => p.userId === userId);
    return Promise.resolve({ success: true, policies });
  },

  processPremiumPayment: (policyId, amount) => {
    if (!policyId || !amount) return Promise.reject(new Error('Missing required fields'));
    return Promise.resolve({
      success: true,
      paymentId: `pay-${Date.now()}`,
      policyId,
      amount
    });
  }
};
