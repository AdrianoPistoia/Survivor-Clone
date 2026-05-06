export default class WeaponBase {
  constructor(scene, config) {
    this.scene = scene;
    // Support both camelCase and UPPERCASE constant keys
    this.baseCooldown = config.cooldown ?? config.COOLDOWN;
    this.baseDamage = config.damage ?? config.DAMAGE;
    this.lastFired = 0;

    // --- Relic/Upgrade multipliers (Phase 3) ---
    this.magDamageBonus = 0;         // flat additive multiplier for magic
    this.physDamageBonus = 0;        // flat additive multiplier for physical
    this.areaMultiplier = 1;         // area size multiplier
    this.rangeMultiplier = 1;        // range multiplier
    this.orbitRadiusMultiplier = 1;  // orbit radius multiplier
    this.orbitSpeedMultiplier = 1;   // orbit speed multiplier
    this.projectileCountBonus = 0;   // extra projectiles from relics/upgrades
    this.tags = [];                  // weapon tags, set by subclass
  }

  getCooldown() {
    return this.baseCooldown * this.scene.player.cooldownMultiplier;
  }

  getDamage() {
    const player = this.scene.player;
    let tagBonus = 0;
    if (this.tags.includes('MAG')) tagBonus += player.magDamageBonus;
    if (this.tags.includes('PHY')) tagBonus += player.physDamageBonus;
    return this.baseDamage * player.damageMultiplier * (1 + tagBonus);
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
