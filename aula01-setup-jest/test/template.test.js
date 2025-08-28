import { it } from '@jest/globals'

function sum(a,b) {
  return a + b
}
it('sum two values', () => {
  expect(sum(1,1)).toBe(2)
})