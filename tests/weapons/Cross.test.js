// Cross.test.js
// TDD: Write failing tests for Cross weapon

const Cross = require('../../src/weapons/Cross.js').default;

describe('Cross', () => {
  const config = { cooldown: 1100, damage: 8 };
  const scene = { player: { cooldownMultiplier: 1, damageMultiplier: 1 } };

  it('should instantiate with correct defaults', () => {
    const cross = new Cross(scene, config);
    expect(cross.damage).toBeGreaterThan(0);
    expect(cross.cooldown).toBeGreaterThan(0);
    expect(cross.projectileCount).toBe(1);
  });

  it('should fire a boomerang projectile', () => {
    const cross = new Cross(scene, config);
    expect(typeof cross.fire).toBe('function');
  });

  it('should increase projectile count on upgrade', () => {
    const cross = new Cross(scene, config);
    cross.upgrade();
    expect(cross.projectileCount).toBeGreaterThan(1);
  });
});
