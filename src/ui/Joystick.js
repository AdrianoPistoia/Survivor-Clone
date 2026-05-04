// Joystick.js
// Virtual joystick for touch input
import Phaser from 'phaser';

export default class Joystick {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.radius = options.radius || 60;
    this.baseAlpha = 0.3;
    this.stickAlpha = 0.7;
    this.active = false;
    this.pointerId = null;
    this.base = null;
    this.stick = null;
    this.origin = { x: 0, y: 0 };
    this.value = { x: 0, y: 0 };
    this.createGraphics();
    this.addListeners();
  }

  createGraphics() {
    const { width, height } = this.scene.sys.game.canvas;
    this.base = this.scene.add.circle(-100, -100, this.radius, 0xffffff, this.baseAlpha).setScrollFactor(0).setDepth(1000).setVisible(false);
    this.stick = this.scene.add.circle(-100, -100, this.radius / 2, 0xffffff, this.stickAlpha).setScrollFactor(0).setDepth(1001).setVisible(false);
  }

  addListeners() {
    this.scene.input.on('pointerdown', pointer => {
      if (this.active) return;
      if (!pointer.isDown) return;
      this.active = true;
      this.pointerId = pointer.id;
      this.origin = { x: pointer.x, y: pointer.y };
      this.base.setPosition(pointer.x, pointer.y).setVisible(true);
      this.stick.setPosition(pointer.x, pointer.y).setVisible(true);
      this.value = { x: 0, y: 0 };
    });
    this.scene.input.on('pointermove', pointer => {
      if (!this.active || pointer.id !== this.pointerId) return;
      const dx = pointer.x - this.origin.x;
      const dy = pointer.y - this.origin.y;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), this.radius);
      const angle = Math.atan2(dy, dx);
      const sx = this.origin.x + Math.cos(angle) * dist;
      const sy = this.origin.y + Math.sin(angle) * dist;
      this.stick.setPosition(sx, sy);
      this.value = {
        x: Math.cos(angle) * (dist / this.radius),
        y: Math.sin(angle) * (dist / this.radius),
      };
    });
    this.scene.input.on('pointerup', pointer => {
      if (pointer.id !== this.pointerId) return;
      this.active = false;
      this.pointerId = null;
      this.base.setVisible(false);
      this.stick.setVisible(false);
      this.value = { x: 0, y: 0 };
    });
  }

  getVector() {
    return this.value;
  }
}
