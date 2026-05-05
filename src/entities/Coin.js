import Phaser from 'phaser';

/**
 * Coin - Spawned occasionally when monsters die.
 * Currency pickup for the shop system (placeholder for v0.1.1).
 * Value scales with time: increases by 2% base at each 3-minute interval.
 * Grey/white pentagon shape, gets magnetized.
 */
export default class Coin {
  static createTexture(scene) {
    // Create texture once and cache it
    if (scene.textures.exists('coinTexture')) {
      return;
    }
    
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xcccccc, 1); // Greyish white color
    
    // Draw pentagon as a proper polygon
    const points = [];
    const cx = 16, cy = 16;
    const radius = 9;
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
      points.push(new Phaser.Geom.Point(
        cx + radius * Math.cos(angle),
        cy + radius * Math.sin(angle)
      ));
    }
    graphics.fillPoints(points, true);
    
    graphics.generateTexture('coinTexture', 32, 32);
    graphics.destroy();
  }

  constructor(scene, x, y) {
    this.scene = scene;
    
    // Ensure texture exists
    Coin.createTexture(scene);
    
    this.sprite = scene.physics.add.sprite(x, y, 'coinTexture');
    this.sprite.setScale(1.1);
    this.sprite.body.setAllowGravity(false);
    this.sprite.setDepth(1);

    // Add sprite to coins physics group for collision detection
    scene.coinsGroup.add(this.sprite);

    // Store collect function in sprite data
    this.sprite.setData('collectFn', () => this.collect());

    // Calculate coin value based on time
    const minutesPassed = scene.elapsedTime / 60;
    const scaleFactor = Math.floor(minutesPassed / 3);
    this.value = Math.pow(2, scaleFactor);

    // Rotation animation
    scene.tweens.add({
      targets: this.sprite,
      rotation: Math.PI * 2,
      duration: 2000,
      repeat: -1,
      ease: 'Linear',
    });
  }

  collect() {
    // Store coin value (for future shop implementation)
    if (!this.scene.coinsCollected) {
      this.scene.coinsCollected = 0;
    }
    this.scene.coinsCollected += this.value;

    // Visual feedback: brief scale pop
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 1.5,
      duration: 150,
      ease: 'Back.easeOut',
    });
  }
}
