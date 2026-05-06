import Phaser from 'phaser';
import { XP } from '../config/constants.js';

export default class BlueGem extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, value) {
    // Procedural cyan/blue circle
    const key = 'blue_gem';
    if (!scene.textures.exists(key)) {
      const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
      gfx.fillStyle(0x00bfff, 1);
      gfx.fillCircle(16, 16, 14);
      gfx.lineStyle(3, 0xffffff, 0.7);
      gfx.strokeCircle(16, 16, 14);
      gfx.generateTexture(key, 32, 32);
      gfx.destroy();
    }
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setData('value', value || XP.BLUE_VALUE_MULT * XP.GEM_VALUE);
    this.body.setAllowGravity(false);
    this.setCircle(14, 2, 2);
    this.setDepth(1);
    this.setScale(1.15);
  }
}
