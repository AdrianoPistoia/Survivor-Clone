import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

export default class Cross extends WeaponBase {
  get damage() {
    return this.getDamage();
  }

  get cooldown() {
    return this.getCooldown();
  }
  constructor(scene, config = WEAPONS.CROSS) {
    super(scene, config);
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
      projectile.setDepth(8);
      projectile.setRotation(angle);
      // Outward velocity
      projectile.setVelocity(
        Math.cos(angle) * WEAPONS.CROSS.SPEED,
        Math.sin(angle) * WEAPONS.CROSS.SPEED
      );
      // Boomerang effect: reverse after half lifetime
      this.scene.time.delayedCall(WEAPONS.CROSS.LIFETIME / 2, () => {
        if (projectile.active) {
          projectile.setVelocity(
            -projectile.body.velocity.x,
            -projectile.body.velocity.y
          );
        }
      });
      // Destroy after full lifetime
      this.scene.time.delayedCall(WEAPONS.CROSS.LIFETIME, () => {
        if (projectile.active) projectile.destroy();
      });
    }
  }

  upgrade() {
    this.projectileCount += 1;
  }
}
