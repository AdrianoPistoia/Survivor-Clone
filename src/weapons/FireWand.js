import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

export default class FireWand extends WeaponBase {
  get damage() {
    return this.getDamage();
  }

  get cooldown() {
    return this.getCooldown();
  }
  constructor(scene, config = WEAPONS.FIRE_WAND) {
    super(scene, config);
    this.projectileCount = config.COUNT ?? 1;
  }

  fire() {
    // Fire at random enemies
    const enemies = this.scene.enemies.getChildren();
    if (!enemies.length) return;
    for (let i = 0; i < this.projectileCount; i++) {
      const target = enemies[Math.floor(Math.random() * enemies.length)];
      if (!target) continue;
      const player = this.scene.player;
      const px = player.sprite.x;
      const py = player.sprite.y;
      const tx = target.x;
      const ty = target.y;
      const angle = Math.atan2(ty - py, tx - px);
      const projectile = this.scene.projectiles.create(px, py, 'firewand');
      projectile.setData('damage', this.getDamage());
      projectile.body.setAllowGravity(false);
      projectile.setDepth(8);
      projectile.setRotation(angle);
      projectile.setVelocity(
        Math.cos(angle) * (WEAPONS.FIRE_WAND.SPEED),
        Math.sin(angle) * (WEAPONS.FIRE_WAND.SPEED)
      );
      this.scene.time.delayedCall(WEAPONS.FIRE_WAND.LIFETIME, () => {
        if (projectile.active) projectile.destroy();
      });
    }
  }

  upgrade() {
    this.projectileCount += 1;
  }
}
