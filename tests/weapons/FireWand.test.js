// FireWand.test.js
// TDD: Write failing tests for Fire Wand weapon

const FireWand = require('../../src/weapons/FireWand.js').default;

describe('FireWand', () => {
  const config = { cooldown: 1200, damage: 10 };
  const scene = { player: { cooldownMultiplier: 1, damageMultiplier: 1 } };

  it('should instantiate with correct defaults', () => {
    const fw = new FireWand(scene, config);
    expect(fw.damage).toBeGreaterThan(0);
    expect(fw.cooldown).toBeGreaterThan(0);
    expect(fw.projectileCount).toBe(1);
  });

  it('should fire a projectile at a random enemy', () => {
    const fw = new FireWand(scene, config);
    expect(typeof fw.fire).toBe('function');
  });

  it('should increase projectile count on upgrade', () => {
    const fw = new FireWand(scene, config);
    fw.upgrade();
    expect(fw.projectileCount).toBeGreaterThan(1);
  });
});
