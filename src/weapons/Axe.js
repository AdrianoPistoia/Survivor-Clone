import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

/**
 * Axe — orbits around the player and damages enemies on contact.
 * High damage, slow fire rate.
 * Inspired by VS Axe.
 */
export default class Axe extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.AXE);
    this.orbitAngle = 0;
    this.axes = [];
    this.hitCooldowns = new Map(); // enemy → last hit time

    this.spawnAxes();
  }

  spawnAxes() {
    const count = WEAPONS.AXE.COUNT || 1;
    for (let i = 0; i < count; i++) {
      const axe = this.scene.add.sprite(0, 0, 'axe');
      axe.setDepth(9);
      this.axes.push(axe);
    }
  }

  canFire(time) {
    // Axe always "fires" (ticks continuously)
    return time - this.lastFired >= this.getCooldown();
  }

  fire(time) {
    // Damage check happens in update via positional overlap
  }

  update(time, delta) {
    const player = this.scene.player;
    if (!player || !player.sprite.active) return;

    const px = player.sprite.x;
    const py = player.sprite.y;
    const r = 100; // orbit radius

    // Advance orbit angle
    this.orbitAngle += 2 * (delta / 1000); // 2 radians/second

    const angleStep = (Math.PI * 2) / (this.axes.length || 1);

    this.axes.forEach((axe, i) => {
      const angle = this.orbitAngle + angleStep * i;
      const ax = px + Math.cos(angle) * r;
      const ay = py + Math.sin(angle) * r;
      axe.setPosition(ax, ay);
      axe.setRotation(angle);

      // Check overlap with enemies (only if not in cooldown)
      const canDamage = this.canFire(time);
      if (!canDamage) return;

      const damage = this.getDamage();
      const enemies = [...this.scene.enemies.getChildren()];
      enemies.forEach(enemy => {
        if (!enemy.active) return;
        const dist = Phaser.Math.Distance.Between(ax, ay, enemy.x, enemy.y);
        if (dist > 30) return;

        // Per-enemy cooldown
        const lastHit = this.hitCooldowns.get(enemy) || 0;
        if (time - lastHit < 500) return;
        this.hitCooldowns.set(enemy, time);

        const currentHP = enemy.getData('hp') - damage;
        enemy.setData('hp', currentHP);
        enemy.setTintFill(0xff6600);
        this.scene.time.delayedCall(80, () => {
          if (enemy.active) enemy.clearTint();
        });

        if (currentHP <= 0) {
          this.scene.killEnemy(enemy);
        }
      });
    });

    // Update lastFired after checking all axes
    if (this.canFire(time)) {
      this.lastFired = time;
    }
  }
}
