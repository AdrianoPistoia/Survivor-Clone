import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

/**
 * Bible — books orbit around the player and damage enemies on contact.
 * Does NOT use the projectiles group (manages own sprites).
 * Inspired by VS King Bible.
 */
export default class Bible extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.BIBLE);
    this.orbitAngle = 0;
    this.books = [];
    this.hitCooldowns = new Map(); // enemy → last hit time, to avoid spam

    this.spawnBooks();
  }

  spawnBooks() {
    for (let i = 0; i < WEAPONS.BIBLE.COUNT; i++) {
      const book = this.scene.add.sprite(0, 0, 'bible');
      book.setDepth(7);
      this.books.push(book);
    }
  }

  canFire(time) {
    // Bible always "fires" (ticks continuously)
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
    const r = WEAPONS.BIBLE.ORBIT_RADIUS;

    // Advance orbit angle
    this.orbitAngle += WEAPONS.BIBLE.ORBIT_SPEED * (delta / 1000);

    const angleStep = (Math.PI * 2) / WEAPONS.BIBLE.COUNT;

    this.books.forEach((book, i) => {
      const angle = this.orbitAngle + angleStep * i;
      const bx = px + Math.cos(angle) * r;
      const by = py + Math.sin(angle) * r;
      book.setPosition(bx, by);
      book.setRotation(angle + Math.PI / 2);

      // Check overlap with enemies
      if (time - this.lastFired < this.getCooldown()) return;

      const damage = this.getDamage();
      const enemies = [...this.scene.enemies.getChildren()];
      enemies.forEach(enemy => {
        if (!enemy.active) return;
        const dist = Phaser.Math.Distance.Between(bx, by, enemy.x, enemy.y);
        if (dist > 24) return;

        // Per-enemy cooldown to avoid hitting same enemy 60 fps
        const lastHit = this.hitCooldowns.get(enemy) || 0;
        if (time - lastHit < 300) return;
        this.hitCooldowns.set(enemy, time);

        const currentHP = enemy.getData('hp') - damage;
        enemy.setData('hp', currentHP);
        enemy.setTintFill(0xddcc44);
        this.scene.time.delayedCall(80, () => {
          if (enemy.active) enemy.clearTint();
        });

        if (currentHP <= 0) {
          this.scene.killEnemy(enemy);
        }
      });
    });

    if (time - this.lastFired >= this.getCooldown()) {
      this.lastFired = time;
    }
  }

  destroy() {
    this.books.forEach(b => b.destroy());
    this.books = [];
  }
}
