const { add, multiply } = require('../src/math');

describe('Math Functions', () => {
  test('add should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('multiply should multiply two numbers correctly', () => {
    expect(multiply(4, 5)).toBe(20);
  });

  test('add should handle negative numbers', () => {
    expect(add(-5, 3)).toBe(-2);
  });

  test('multiply should handle zero', () => {
    expect(multiply(5, 0)).toBe(0);
  });
});
