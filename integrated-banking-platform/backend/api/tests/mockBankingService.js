const mockUsers = [
  { id: 'usr-001', name: 'Test User', accountId: 'acc-001', balance: 1000.00 },
  { id: 'usr-002', name: 'Insurance User', accountId: 'acc-002', balance: 2500.50 }
];

module.exports = {
  getUserBalance: (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    return Promise.resolve({ success: true, balance: user ? user.balance : 0 });
  },

  transferFunds: (fromAccountId, toAccountId, amount) => {
    if (amount <= 0) return Promise.reject(new Error('Invalid amount'));
    return Promise.resolve({
      success: true,
      transactionId: `txn-${Date.now()}`,
      amount
    });
  }
};
