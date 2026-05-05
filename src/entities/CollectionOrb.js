import Phaser from 'phaser';
import { LOOT } from '../config/constants.js';

/**
 * CollectionOrb - Spawned occasionally when monsters die.
 * When collected by the player, magnets all existing XP orbs on the map toward the player.
 * Squared ring shape, orange/gold color.
 * Does NOT get magnetized itself (requires manual collection).
 */
export default class CollectionOrb {
  static createTexture(scene) {
    // Create texture once and cache it
    if (scene.textures.exists('collectionOrbTexture')) {
      return;
    }
    
    // Create squared ring graphic
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffaa00, 1); // Orange/gold color
    
    const size = 14;
    const thickness = 3;
    // Outer square
    graphics.fillRect(16 - size/2, 16 - size/2, size, size);
    // Inner hollow (black for transparency effect)
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(16 - (size-thickness)/2, 16 - (size-thickness)/2, size - thickness, size - thickness);
    
    graphics.generateTexture('collectionOrbTexture', 32, 32);
    graphics.destroy();
  }

  constructor(scene, x, y) {
    this.scene = scene;
    this.collected = false; // Prevent multiple triggers
    
    // Ensure texture exists
    CollectionOrb.createTexture(scene);
    
    this.sprite = scene.physics.add.sprite(x, y, 'collectionOrbTexture');
    this.sprite.setScale(1.3); // Slightly larger
    this.sprite.body.setAllowGravity(false);
    this.sprite.setDepth(1);

    // Add sprite to collection orbs physics group for collision detection
    if (!scene.collectionOrbsGroup) {
      scene.collectionOrbsGroup = scene.physics.add.group();
    }
    scene.collectionOrbsGroup.add(this.sprite);

    // Store collect function in sprite data
    this.sprite.setData('collectFn', () => this.collect());

    // Create pulsing animation
    scene.tweens.add({
      targets: this.sprite,
      scale: { from: 1.3, to: 1.6 },
      duration: 300,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
  }

  collect() {
    // Only trigger magnetization once
    if (this.collected) return;
    this.collected = true;
    this.magnetizeOrbs();
  }

  magnetizeOrbs() {
    const range = LOOT.COLLECTION_ORB.MAGNET_RANGE;
    const duration = LOOT.COLLECTION_ORB.ANIMATION_DURATION;
    const player = this.scene.player.sprite;

    // Find all existing XP gems on the map
    const gems = [...this.scene.gems.getChildren()];
    gems.forEach(gem => {
      if (!gem.active || gem === this.sprite) return;

      // Calculate distance from gem to player
      const dist = Phaser.Math.Distance.Between(gem.x, gem.y, player.x, player.y);
      if (dist > range) return; // Out of range

      // Tween gem to player with smooth homing animation
      this.scene.tweens.add({
        targets: gem,
        x: player.x,
        y: player.y,
        duration: duration,
        ease: 'Quad.easeIn',
        onComplete: () => {
          // Trigger collection if gem still exists
          if (gem.active) {
            const value = gem.getData('value') || 1;
            this.scene.xpSystem.addXP(value);
            gem.destroy();
          }
        },
      });
    });
  }
}
