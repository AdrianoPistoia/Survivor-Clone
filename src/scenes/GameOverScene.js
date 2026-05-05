import Phaser from 'phaser';
import { GAME } from '../config/constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.stats = data || {};
    // Ensure all required fields exist
    this.stats.kills = this.stats.kills || 0;
    this.stats.time = this.stats.time || 0;
    this.stats.level = this.stats.level || 1;
    this.stats.victory = this.stats.victory || false;
  }

  create() {
    const cx = GAME.WIDTH / 2;
    const cy = GAME.HEIGHT / 2;

    const titleText = this.stats.victory ? 'VICTORY!' : 'GAME OVER';
    const titleColor = this.stats.victory ? '#44ff44' : '#ff4444';

    this.add.text(cx, cy - 150, titleText, {
      fontSize: '48px', fontFamily: 'monospace', color: titleColor, fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stats
    const mins = Math.floor(this.stats.time / 60);
    const secs = this.stats.time % 60;
    const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;

    this.add.text(cx, cy - 80, `Time Survived: ${timeStr}`, {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(cx, cy - 50, `Kills: ${this.stats.kills}`, {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(cx, cy - 20, `Level: ${this.stats.level}`, {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5);

    // Name input
    this.add.text(cx, cy + 30, 'Enter your name:', {
      fontSize: '16px', fontFamily: 'monospace', color: '#aaaaaa',
    }).setOrigin(0.5);

    this.playerName = 'Player';
    this.nameText = this.add.text(cx, cy + 60, '> Player_', {
      fontSize: '20px', fontFamily: 'monospace', color: '#44ff44',
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown', (event) => {
      if (event.key === 'Backspace') {
        this.playerName = this.playerName.slice(0, -1);
      } else if (event.key === 'Enter') {
        this.submitScore();
      } else if (event.key.length === 1 && this.playerName.length < 20) {
        this.playerName += event.key;
      }
      this.nameText.setText(`> ${this.playerName}_`);
    });

    // Submit button
    const submitBtn = this.add.text(cx, cy + 110, '[ SUBMIT SCORE ]', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffff44',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    submitBtn.on('pointerover', () => submitBtn.setColor('#ffff88'));
    submitBtn.on('pointerout', () => submitBtn.setColor('#ffff44'));
    submitBtn.on('pointerdown', () => this.submitScore());

    // Back to menu
    const menuBtn = this.add.text(cx, cy + 160, '[ MENU ]', {
      fontSize: '20px', fontFamily: 'monospace', color: '#4488ff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setColor('#88bbff'));
    menuBtn.on('pointerout', () => menuBtn.setColor('#4488ff'));
    menuBtn.on('pointerdown', () => this.scene.start('Menu'));

    this.submitted = false;
    this.statusText = this.add.text(cx, cy + 200, '', {
      fontSize: '14px', fontFamily: 'monospace', color: '#888888',
    }).setOrigin(0.5);
  }

  async submitScore() {
    if (this.submitted) return;
    if (!this.playerName.trim()) return;
    this.submitted = true;

    const body = {
      name: this.playerName.trim().substring(0, 20),
      kills: this.stats.kills || 0,
      timeSurvived: this.stats.time || 0,
      level: this.stats.level || 1,
    };

    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        this.statusText.setText('Score submitted!').setColor('#44ff44');
      } else {
        const errorText = await res.text().catch(() => 'Unknown error');
        console.error('Submit score error:', res.status, errorText);
        this.statusText.setText('Failed to submit score').setColor('#ff4444');
        this.submitted = false;
      }
    } catch (error) {
      console.error('Submit score error:', error);
      this.statusText.setText('Could not connect to server').setColor('#ff4444');
      this.submitted = false;
    }
  }
}
