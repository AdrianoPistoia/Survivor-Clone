import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

/**
 * Lightning — strikes the nearest enemy and chains to additional nearby enemies.
 * Instant hit, drawn as line graphics that fade out. Inspired by VS Lightning Ring.
 */
export default class Lightning extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.LIGHTNING);
  }

  fire(time) {
    const player = this.scene.player;
    const px = player.sprite.x;
    const py = player.sprite.y;
    const damage = this.getDamage();

    // Find nearest enemy as chain start
    const allEnemies = [...this.scene.enemies.getChildren()].filter(e => e.active);
    if (allEnemies.length === 0) return;

    allEnemies.sort((a, b) =>
      Phaser.Math.Distance.Between(px, py, a.x, a.y) -
      Phaser.Math.Distance.Between(px, py, b.x, b.y)
    );

    const targets = [];
    const hit = new Set();

    // First target: nearest to player
    targets.push({ x: px, y: py, enemy: null }); // origin
    let current = allEnemies[0];
    targets.push({ x: current.x, y: current.y, enemy: current });
    hit.add(current);

    // Chain: find next nearest to last struck enemy within CHAIN_RANGE
    for (let c = 1; c < WEAPONS.LIGHTNING.CHAIN; c++) {
      const cx = current.x;
      const cy = current.y;
      let nextEnemy = null;
      let nextDist = Infinity;

      allEnemies.forEach(e => {
        if (hit.has(e)) return;
        const d = Phaser.Math.Distance.Between(cx, cy, e.x, e.y);
        if (d < WEAPONS.LIGHTNING.CHAIN_RANGE && d < nextDist) {
          nextDist = d;
          nextEnemy = e;
        }
      });

      if (!nextEnemy) break;
      targets.push({ x: nextEnemy.x, y: nextEnemy.y, enemy: nextEnemy });
      hit.add(nextEnemy);
      current = nextEnemy;
    }

    // Draw lightning bolts between each pair
    const g = this.scene.add.graphics();
    g.setDepth(20);

    for (let i = 0; i < targets.length - 1; i++) {
      const from = targets[i];
      const to = targets[i + 1];
      this.drawBolt(g, from.x, from.y, to.x, to.y);
    }

    // Apply damage to struck enemies
    targets.forEach(({ enemy }) => {
      if (!enemy || !enemy.active) return;
      const currentHP = enemy.getData('hp') - damage;
      enemy.setData('hp', currentHP);
      enemy.setTintFill(0xeeff44);
      this.scene.time.delayedCall(80, () => {
        if (enemy.active) enemy.clearTint();
      });
      if (currentHP <= 0) this.scene.killEnemy(enemy);
    });

    // Fade out bolt graphic
    this.scene.tweens.add({
      targets: g,
      alpha: 0,
      duration: WEAPONS.LIGHTNING.DURATION,
      onComplete: () => g.destroy(),
    });
  }

  drawBolt(g, x1, y1, x2, y2) {
    const segments = 6;
    const points = [];
    const jitter = 20;

    points.push({ x: x1, y: y1 });
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      points.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * jitter * 2,
        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * jitter * 2,
      });
    }
    points.push({ x: x2, y: y2 });

    // Draw glow (thick, dim)
    g.lineStyle(6, 0xaaffff, 0.25);
    g.beginPath();
    g.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => g.lineTo(p.x, p.y));
    g.strokePath();

    // Draw core (thin, bright)
    g.lineStyle(2, 0xeeff44, 1.0);
    g.beginPath();
    g.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => g.lineTo(p.x, p.y));
    g.strokePath();
  }
}
