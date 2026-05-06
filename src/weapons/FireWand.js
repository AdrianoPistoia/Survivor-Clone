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
    this.tags = ['MAG'];
    this.magDamageBonus = 0;
    this.projectileCountBonus = 0;
    this.projectileCount = config.COUNT ?? 1;
  }

  fire() {
    const enemies = this.scene.enemies.getChildren();
    if (!enemies.length) return;

    for (let i = 0; i < this.projectileCount; i++) {
      const target = enemies[Math.floor(Math.random() * enemies.length)];
      if (!target) continue;

      const player = this.scene.player;
      const px = player.sprite.x;
      const py = player.sprite.y;
      const angle = Math.atan2(target.y - py, target.x - px);

      const projectile = this.scene.projectiles.create(px, py, 'firewand');
      projectile.setData('type', 'firewand');
      projectile.setData('damage', 0); // no direct damage — explosion handles it
      projectile.setData('explosionDamage', this.getDamage());
      projectile.body.setAllowGravity(false);
      projectile.setDepth(20);
      projectile.setRotation(angle);
      projectile.setSize(12, 12);
      projectile.setVelocity(
        Math.cos(angle) * WEAPONS.FIRE_WAND.SPEED,
        Math.sin(angle) * WEAPONS.FIRE_WAND.SPEED
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
