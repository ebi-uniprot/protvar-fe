
const sum = require('../../src/sample-module');

test('adding 1 + 1 should equal to 2', () => {
  expect(sum(1, 1)).toBe(2);
});
