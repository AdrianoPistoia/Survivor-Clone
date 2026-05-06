import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

export default class Cross extends WeaponBase {
  update(time, delta) {
    if (this.canFire(time)) {
      this.fire(time);
      this.lastFired = time;
    }
  }
  get damage() {
    return this.getDamage();
  }

  get cooldown() {
    return this.getCooldown();
  }
  constructor(scene, config = WEAPONS.CROSS) {
    super(scene, config);
    // Weapon tags and multipliers
    this.tags = ['PHY'];
    this.physDamageBonus = 0;
    this.projectileCountBonus = 0;
    this.projectileCount = config.COUNT ?? 1;
  }

  fire() {
    // Fire boomerang projectiles
    const player = this.scene.player;
    const px = player.sprite.x;
    const py = player.sprite.y;
    for (let i = 0; i < this.projectileCount; i++) {
      // Spread angle for multiple projectiles
      const spread = (Math.PI / 8) * (i - (this.projectileCount - 1) / 2);
      const dir = player.facing.clone().normalize();
      const angle = Math.atan2(dir.y, dir.x) + spread;
      const projectile = this.scene.projectiles.create(px, py, 'cross');
      projectile.setData('damage', this.getDamage());
      projectile.body.setAllowGravity(false);
      projectile.setDepth(20); // bring to front
      projectile.setRotation(angle);
      // Outward velocity
      projectile.setVelocity(
        Math.cos(angle) * WEAPONS.CROSS.SPEED,
        Math.sin(angle) * WEAPONS.CROSS.SPEED
      );
      // Set body size to match texture
      if (projectile.body && projectile.setSize) {
        projectile.setSize(32, 32);
      }
      projectile.setAlpha(1);
      this.scene.time.delayedCall(WEAPONS.CROSS.LIFETIME / 2, () => {
        if (projectile.active) {
          projectile.setVelocity(
            -projectile.body.velocity.x,
            -projectile.body.velocity.y
          );
        }
      });
      this.scene.time.delayedCall(WEAPONS.CROSS.LIFETIME, () => {
        if (projectile.active) projectile.destroy();
      });
    }
  }

  upgrade() {
    this.projectileCount += 1;
  }
}
