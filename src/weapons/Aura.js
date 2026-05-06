import Phaser from 'phaser';
import WeaponBase from './WeaponBase.js';
import { WEAPONS } from '../config/constants.js';

export default class Aura extends WeaponBase {
  constructor(scene) {
    super(scene, WEAPONS.AURA);
    // Weapon tags and multipliers
    this.tags = ['MAG'];
    this.magDamageBonus = 0;
    this.areaMultiplier = 1;
    this.auraSprite = null;
  }

  fire(time) {
    const player = this.scene.player;
    const px = player.sprite.x;
    const py = player.sprite.y;
    const damage = this.getDamage();

    // Show aura visual
    if (!this.auraSprite) {
      this.auraSprite = this.scene.add.sprite(px, py, 'aura');
      this.auraSprite.setDepth(3);
    }
    this.auraSprite.setPosition(px, py);

    // Pulse effect
    this.auraSprite.setScale(0.8);
    this.scene.tweens.add({
      targets: this.auraSprite,
      scale: 1.1,
      alpha: { from: 0.6, to: 0.2 },
      duration: this.getCooldown() * 0.8,
    });

    // Damage all enemies in radius
    const enemies = [...this.scene.enemies.getChildren()];
    enemies.forEach(enemy => {
      if (!enemy.active) return;
      const dist = Phaser.Math.Distance.Between(px, py, enemy.x, enemy.y);
      if (dist > WEAPONS.AURA.RADIUS) return;

      const currentHP = enemy.getData('hp') - damage;
      enemy.setData('hp', currentHP);
      enemy.setTintFill(0x44ffff);
      this.scene.time.delayedCall(60, () => {
        if (enemy.active) enemy.clearTint();
      });

      if (currentHP <= 0) {
        this.scene.killEnemy(enemy);
      }
    });
  }

  update(time, delta) {
    // Keep aura centered on player
    if (this.auraSprite && this.scene.player) {
      this.auraSprite.setPosition(
        this.scene.player.sprite.x,
        this.scene.player.sprite.y
      );
    }
    super.update(time, delta);
  }
}
