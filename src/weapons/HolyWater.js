import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

/**
 * HolyWater — throws a flask toward the nearest enemy.
 * On landing it creates a glowing puddle that ticks damage every 400ms for 3 seconds.
 * Inspired by VS Holy Water.
 */
export default class HolyWater extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.HOLY_WATER);
  }

  fire(time) {
    const player = this.scene.player;
    const px = player.sprite.x;
    const py = player.sprite.y;

    // Target: nearest enemy, or slightly ahead of player
    let targetX = px + player.facing.x * 150;
    let targetY = py + player.facing.y * 150;
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

    // Launch flask
    const flask = this.scene.add.sprite(px, py, 'holy_flask');
    flask.setDepth(9);

    // Fly toward target position
    this.scene.tweens.add({
      targets: flask,
      x: targetX,
      y: targetY - 30, // arc apex
      duration: 400,
      ease: 'Quad.easeOut',
      onComplete: () => {
        // Second half of arc (drop)
        this.scene.tweens.add({
          targets: flask,
          x: targetX,
          y: targetY,
          duration: 200,
          ease: 'Quad.easeIn',
          onComplete: () => {
            flask.destroy();
            this.createZone(targetX, targetY, time);
          },
        });
      },
    });
  }

  createZone(x, y, startTime) {
    const zone = this.scene.add.sprite(x, y, 'holy_zone');
    zone.setDepth(4);
    zone.setAlpha(0.8);

    const damage = this.getDamage();
    const endTime = startTime + WEAPONS.HOLY_WATER.ZONE_DURATION;

    // Pulse animation loop
    this.scene.tweens.add({
      targets: zone,
      scaleX: { from: 0.9, to: 1.05 },
      scaleY: { from: 0.9, to: 1.05 },
      alpha: { from: 0.8, to: 0.4 },
      duration: WEAPONS.HOLY_WATER.TICK_RATE,
      yoyo: true,
      repeat: Math.floor(WEAPONS.HOLY_WATER.ZONE_DURATION / WEAPONS.HOLY_WATER.TICK_RATE),
      onComplete: () => {
        this.scene.tweens.add({
          targets: zone,
          alpha: 0,
          duration: 300,
          onComplete: () => zone.destroy(),
        });
      },
    });

    // Tick damage
    const ticker = this.scene.time.addEvent({
      delay: WEAPONS.HOLY_WATER.TICK_RATE,
      repeat: Math.floor(WEAPONS.HOLY_WATER.ZONE_DURATION / WEAPONS.HOLY_WATER.TICK_RATE) - 1,
      callback: () => {
        if (!zone.active && !zone.scene) {
          ticker.remove();
          return;
        }
        const enemies = [...this.scene.enemies.getChildren()];
        enemies.forEach(enemy => {
          if (!enemy.active) return;
          const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
          if (dist > WEAPONS.HOLY_WATER.ZONE_RADIUS) return;

          const currentHP = enemy.getData('hp') - damage;
          enemy.setData('hp', currentHP);
          enemy.setTintFill(0x44aaff);
          this.scene.time.delayedCall(80, () => {
            if (enemy.active) enemy.clearTint();
          });
          if (currentHP <= 0) this.scene.killEnemy(enemy);
        });
      },
    });
  }
}
