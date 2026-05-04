import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

/**
 * Axe — thrown towards the nearest enemy with a parabolic arc (gravity).
 * High damage, slow fire rate. Inspired by VS Axe.
 */
export default class Axe extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.AXE);
  }

  fire(time) {
    const player = this.scene.player;
    const px = player.sprite.x;
    const py = player.sprite.y;

    // Aim at nearest enemy, otherwise throw upward
    let targetX = px;
    let targetY = py - 200;
    let nearestDist = Infinity;

    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return;
      const dist = Phaser.Math.Distance.Between(px, py, enemy.x, enemy.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        targetX = enemy.x;
        targetY = enemy.y;
      }
    });

    const axe = this.scene.projectiles.create(px, py, 'axe');
    axe.setData('damage', this.getDamage());
    axe.setData('pierce', 2); // axe can hit multiple enemies on arc
    axe.setDepth(9);

    // Enable gravity for arc
    axe.body.setAllowGravity(true);
    axe.body.setGravityY(WEAPONS.AXE.GRAVITY);

    // Horizontal velocity toward target; vertical velocity upward
    const dx = targetX - px;
    const dy = targetY - py;
    const angle = Math.atan2(dy, dx);

    // Give it upward + horizontal launch for arc effect
    const hSpeed = WEAPONS.AXE.SPEED * Math.sign(dx || 1);
    axe.setVelocity(hSpeed, -WEAPONS.AXE.SPEED * 0.8);

    // Spin the axe as it travels
    this.scene.tweens.add({
      targets: axe,
      rotation: Math.PI * 6,
      duration: WEAPONS.AXE.LIFETIME,
      ease: 'Linear',
    });

    this.scene.time.delayedCall(WEAPONS.AXE.LIFETIME, () => {
      if (axe.active) axe.destroy();
    });
  }
}
