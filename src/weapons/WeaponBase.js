export default class WeaponBase {
  constructor(scene, config) {
    this.scene = scene;
    // Support both camelCase and UPPERCASE constant keys
    this.baseCooldown = config.cooldown ?? config.COOLDOWN;
    this.baseDamage = config.damage ?? config.DAMAGE;
    this.lastFired = 0;
  }

  getCooldown() {
    return this.baseCooldown * this.scene.player.cooldownMultiplier;
  }

  getDamage() {
    return this.baseDamage * this.scene.player.damageMultiplier;
  }

  canFire(time) {
    return time - this.lastFired >= this.getCooldown();
  }

  update(time, delta) {
    if (this.canFire(time)) {
      this.fire(time);
      this.lastFired = time;
    }
  }

  fire(time) {
    // Override in subclasses
  }
}
