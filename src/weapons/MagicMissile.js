import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

export default class MagicMissile extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.MAGIC_MISSILE);
  }

  fire(time) {
    const player = this.scene.player;
    const px = player.sprite.x;
    const py = player.sprite.y;

    // Find nearest enemy
    let nearest = null;
    let nearestDist = Infinity;
    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return;
      const dist = Phaser.Math.Distance.Between(px, py, enemy.x, enemy.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = enemy;
      }
    });

    if (!nearest) return;

    const projectile = this.scene.projectiles.create(px, py, 'projectile');
    projectile.setData('damage', this.getDamage());
    projectile.setData('pierce', WEAPONS.MAGIC_MISSILE.PIERCE);
    projectile.body.setAllowGravity(false);
    projectile.setDepth(8);

    // Move towards target
    this.scene.physics.moveToObject(projectile, nearest, WEAPONS.MAGIC_MISSILE.SPEED);

    // Destroy after lifetime
    this.scene.time.delayedCall(WEAPONS.MAGIC_MISSILE.LIFETIME, () => {
      if (projectile.active) projectile.destroy();
    });
  }
}
