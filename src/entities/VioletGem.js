import Phaser from 'phaser';
import { XP } from '../config/constants.js';

export default class VioletGem extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, value) {
    // Procedural violet/magenta circle
    const key = 'violet_gem';
    if (!scene.textures.exists(key)) {
      const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
      gfx.fillStyle(0x9b30ff, 1);
      gfx.fillCircle(20, 20, 18);
      gfx.lineStyle(4, 0xffffff, 0.7);
      gfx.strokeCircle(20, 20, 18);
      gfx.generateTexture(key, 40, 40);
      gfx.destroy();
    }
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.value = value || XP.VIOLET_VALUE_MULT * XP.GEM_VALUE;
    this.setCircle(18, 2, 2);
    this.setDepth(2);
    this.setScale(1.3);
  }
}
