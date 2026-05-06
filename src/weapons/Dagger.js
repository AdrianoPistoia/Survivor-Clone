import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

/**
 * Dagger — fires fast projectiles in the direction the player is aiming (right-click).
 * High fire rate, low damage, no pierce. Works as the basic attack.
 */
export default class Dagger extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.DAGGER);
    // Weapon tags and multipliers
    this.tags = ['PHY'];
    this.physDamageBonus = 0;
    this.rangeMultiplier = 1;
    this.projectileCountBonus = 0;
  }

  findClosestEnemy() {
    const player = this.scene.player;
    const enemies = this.scene.enemies.getChildren();
    if (enemies.length === 0) return null;
    
    let closest = null;
    let minDist = Infinity;
    
    for (const enemy of enemies) {
      const dx = enemy.x - player.sprite.x;
      const dy = enemy.y - player.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < minDist) {
        minDist = dist;
        closest = enemy;
      }
    }
    
    return closest;
  }

  fire(time) {
    const player = this.scene.player;
    const px = player.sprite.x;
    const py = player.sprite.y;
    
    let dir;
    
    if (player.isAiming) {
      // Manual aim: use cursor direction
      dir = player.aimDirection.clone();
    } else {
      // Auto-aim: target closest enemy, or use facing direction if none exist
      const closest = this.findClosestEnemy();
      if (closest) {
        const dx = closest.x - px;
        const dy = closest.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          dir = new Phaser.Math.Vector2(dx / dist, dy / dist);
        } else {
          dir = player.facing.clone();
        }
      } else {
        dir = player.facing.clone();
      }
    }

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

  update(time, delta) {
    // Always fire (basic attack)
    if (this.canFire(time)) {
      this.fire(time);
      this.lastFired = time;
    }
  }
}
