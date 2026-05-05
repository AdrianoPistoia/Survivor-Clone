
import Phaser from 'phaser';
import { PLAYER } from '../config/constants.js';
import Joystick from '../ui/Joystick.js';

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);
    this.sprite.body.setSize(PLAYER.SIZE * 1.5, PLAYER.SIZE * 1.5);

    // Stats
    this.hp = PLAYER.MAX_HP;
    this.baseMaxHP = PLAYER.MAX_HP;
    this.bonusHP = 0;
    this.baseSpeed = PLAYER.SPEED;

    // Multipliers (from upgrades)
    this.damageMultiplier = 1;
    this.cooldownMultiplier = 1;
    this.speedMultiplier = 1;
    this.bonusPickupRange = 0;

    // Upgrade tracking
    this.upgradeLevels = {};

    // Invulnerability
    this.isInvulnerable = false;

    // Direction facing (for whip)
    this.facing = new Phaser.Math.Vector2(1, 0);

    // Input
    this.keys = scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.joystick = new Joystick(scene);
  }

  getMaxHP() {
    return this.baseMaxHP + this.bonusHP;
  }

  getSpeed() {
    return this.baseSpeed * this.speedMultiplier;
  }

  getPickupRange() {
    return PLAYER.PICKUP_RANGE + this.bonusPickupRange;
  }

  update(delta) {
    const speed = this.getSpeed();
    let vx = 0;
    let vy = 0;

    // Keyboard input
    if (this.keys.A.isDown) vx -= 1;
    if (this.keys.D.isDown) vx += 1;
    if (this.keys.W.isDown) vy -= 1;
    if (this.keys.S.isDown) vy += 1;

    // Touch joystick input (overrides keyboard if active)
    const joy = this.joystick.getVector();
    if (joy.x !== 0 || joy.y !== 0) {
      vx = joy.x;
      vy = joy.y;
    }

    // Normalize diagonal movement
    if (vx !== 0 || vy !== 0) {
      const len = Math.sqrt(vx * vx + vy * vy);
      vx = (vx / len) * speed;
      vy = (vy / len) * speed;
      this.facing.set(vx, vy).normalize();
    }

    this.sprite.setVelocity(vx, vy);
  }

  takeDamage(amount) {
    if (this.isInvulnerable) return;

    this.hp -= amount;
    this.isInvulnerable = true;

    // Flash red
    this.sprite.setTintFill(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.sprite.active) this.sprite.clearTint();
    });

    // Invulnerability blink
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: { from: 0.3, to: 1 },
      duration: 100,
      repeat: Math.floor(PLAYER.INVULN_TIME / 100) - 1,
      onComplete: () => {
        this.isInvulnerable = false;
        if (this.sprite.active) this.sprite.setAlpha(1);
      },
    });

    // Screen shake
    this.scene.cameras.main.shake(100, 0.005);
  }
}
