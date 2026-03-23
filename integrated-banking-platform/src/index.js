const { add, multiply } = require('./math');

console.log('Integration Testing Platform loaded');
console.log('Testing add:', add(1, 2));
console.log('Testing multiply:', multiply(3, 4));

module.exports = {
  add,
  multiply
};
