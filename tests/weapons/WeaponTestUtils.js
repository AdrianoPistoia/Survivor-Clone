// WeaponTestUtils.js
// Utility functions and mocks for weapon TDD

export function mockPlayer() {
  return {
    x: 100,
    y: 100,
    scene: {},
    damageMultiplier: 1,
    cooldownMultiplier: 1,
    speedMultiplier: 1,
    // Add more as needed for tests
  };
}

export function mockEnemy() {
  return {
    x: 200,
    y: 200,
    hp: 10,
    takeDamage: jest.fn(),
  };
}
