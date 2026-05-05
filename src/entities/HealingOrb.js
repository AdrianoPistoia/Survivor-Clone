import Phaser from 'phaser';
import { LOOT } from '../config/constants.js';

/**
 * HealingOrb - Spawned occasionally when monsters die.
 * When collected, heals the player 1-5% of their max HP.
 * Pink square, does NOT get magnetized.
 */
export default class HealingOrb {
  static createTexture(scene) {
    // Create texture once and cache it
    if (scene.textures.exists('healingOrbTexture')) {
      return;
    }
    
    // Create pink square graphic
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xff69b4, 1); // Pink color
    
    // Draw square
    graphics.fillRect(4, 4, 24, 24);
    
    graphics.generateTexture('healingOrbTexture', 32, 32);
    graphics.destroy();
  }

  constructor(scene, x, y) {
    this.scene = scene;
    
    // Ensure texture exists
    HealingOrb.createTexture(scene);
    
    this.sprite = scene.physics.add.sprite(x, y, 'healingOrbTexture');
    this.sprite.setScale(1.2);
    this.sprite.body.setAllowGravity(false);
    this.sprite.setDepth(1);

    // Add sprite to healing orbs physics group for collision detection
    scene.healingOrbsGroup.add(this.sprite);

    // Store collect function in sprite data
    this.sprite.setData('collectFn', () => this.collect());

    // Gentle floating animation
    scene.tweens.add({
      targets: this.sprite,
      y: y - 20,
      duration: 600,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
  }

  collect() {
    const maxHP = this.scene.player.getMaxHP();
    const minHeal = Math.ceil(maxHP * LOOT.HEALING_ORB.HEAL_MIN_PERCENT);
    const maxHeal = Math.ceil(maxHP * LOOT.HEALING_ORB.HEAL_MAX_PERCENT);
    const healAmount = Phaser.Math.Between(minHeal, maxHeal);

    // Heal player
    this.scene.player.hp = Math.min(this.scene.player.hp + healAmount, maxHP);

    // Flash effect
    this.scene.tweens.add({
      targets: this.scene.player.sprite,
      tintFill: { from: 0x00ff88, to: 0xffffff },
      duration: 100,
      onComplete: () => {
        if (this.scene.player.sprite.active) {
          this.scene.player.sprite.clearTint();
        }
      },
    });
  }
}
