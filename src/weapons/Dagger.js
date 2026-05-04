import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

/**
 * Dagger — fires fast projectiles in the direction the player is moving (or facing).
 * High fire rate, low damage, no pierce. Inspired by VS Knife.
 */
export default class Dagger extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.DAGGER);
  }

  fire(time) {
    const player = this.scene.player;
    const px = player.sprite.x;
    const py = player.sprite.y;
    const dir = player.facing.clone().normalize();

    const projectile = this.scene.projectiles.create(px, py, 'dagger');
    projectile.setData('damage', this.getDamage());
    projectile.setData('pierce', 0);
    projectile.body.setAllowGravity(false);
    projectile.setDepth(8);
    projectile.setRotation(Math.atan2(dir.y, dir.x));

    projectile.setVelocity(
      dir.x * WEAPONS.DAGGER.SPEED,
      dir.y * WEAPONS.DAGGER.SPEED
    );

    // Auto-destroy after lifetime
    this.scene.time.delayedCall(WEAPONS.DAGGER.LIFETIME, () => {
      if (projectile.active) projectile.destroy();
    });
  }
}
