import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

export default class Whip extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.WHIP);
  }

  fire(time) {
    const player = this.scene.player;
    const px = player.sprite.x;
    const py = player.sprite.y;
    const enemies = [...this.scene.enemies.getChildren()];

    // Find closest enemy in range
    let closest = null;
    let minDist = Infinity;
    const maxRange = (WEAPONS.WHIP.RANGE || 80) * 1.5; // make whip longer
    for (const enemy of enemies) {
      if (!enemy.active) continue;
      const dist = Phaser.Math.Distance.Between(px, py, enemy.x, enemy.y);
      if (dist < minDist && dist <= maxRange) {
        minDist = dist;
        closest = enemy;
      }
    }

    // Aim direction: toward closest enemy, or player's facing if none
    let dir;
    if (closest) {
      dir = new Phaser.Math.Vector2(closest.x - px, closest.y - py).normalize();
    } else {
      dir = player.facing.clone();
    }

    // Visual: draw whip line (white, longer)
    const whipLength = maxRange;
    const whipLine = this.scene.add.graphics();
    whipLine.lineStyle(6, 0xffffff, 0.85);
    whipLine.beginPath();
    whipLine.moveTo(px, py);
    whipLine.lineTo(px + dir.x * whipLength, py + dir.y * whipLength);
    whipLine.strokePath();
    whipLine.setDepth(8);

    // Damage enemies in a narrow line (arc)
    const damage = this.getDamage();
    const arcDeg = (WEAPONS.WHIP.ARC || 30); // degrees, narrow
    const arcRad = Phaser.Math.DegToRad(arcDeg);
    const whipAngle = Math.atan2(dir.y, dir.x);
    for (const enemy of enemies) {
      if (!enemy.active) continue;
      const ex = enemy.x - px;
      const ey = enemy.y - py;
      const dist = Math.sqrt(ex * ex + ey * ey);
      if (dist > whipLength + 10) continue;
      const angleToEnemy = Math.atan2(ey, ex);
      let diff = Phaser.Math.Angle.Wrap(angleToEnemy - whipAngle);
      if (Math.abs(diff) > arcRad / 2) continue; // not in line

      // Damage and knockback
      const currentHP = enemy.getData('hp') - damage;
      enemy.setData('hp', currentHP);
      enemy.setTintFill(0xffffff);
      this.scene.time.delayedCall(60, () => {
        if (enemy.active) enemy.clearTint();
      });
      const toEnemy = new Phaser.Math.Vector2(ex, ey).normalize();
      const kb = toEnemy.scale(WEAPONS.WHIP.KNOCKBACK);
      enemy.body.velocity.x += kb.x;
      enemy.body.velocity.y += kb.y;
      if (currentHP <= 0) {
        this.scene.killEnemy(enemy);
      }
    }

    // Animate and remove whip visual
    this.scene.tweens.add({
      targets: whipLine,
      alpha: 0,
      duration: 200,
      onComplete: () => whipLine.destroy(),
    });
  }
}
