import Phaser from 'phaser';
import { GAME } from '../config/constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this.menuObjects = [];
    this.drawMenu();
    this.scale.on('resize', this.onResize, this);
    this.leaderboardContainer = null;
  }

  drawMenu() {
    if (this.menuObjects) {
      this.menuObjects.forEach(obj => obj.destroy());
    }
    this.menuObjects = [];
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    const title = this.add.text(cx, cy - 120, 'SURVIVOR CLONE', {
      fontSize: Math.round(this.scale.width / 16) + 'px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.menuObjects.push(title);

    const subtitle = this.add.text(cx, cy - 60, 'A Vampire Survivors-like game', {
      fontSize: Math.round(this.scale.width / 40) + 'px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
    }).setOrigin(0.5);
    this.menuObjects.push(subtitle);


    // Play button
    const playBtn = this.add.text(cx, cy + 20, '[ PLAY ]', {
      fontSize: Math.round(this.scale.width / 24) + 'px',
      fontFamily: 'monospace',
      color: '#44ff44',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    playBtn.on('pointerover', () => playBtn.setColor('#88ff88'));
    playBtn.on('pointerout', () => playBtn.setColor('#44ff44'));
    playBtn.on('pointerdown', () => {
      this.scene.start('Game');
    });
    this.menuObjects.push(playBtn);

    // Fullscreen button for non-PC devices
    if (typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)) {
      const fsBtn = this.add.text(cx, cy + 50, '[ FULLSCREEN ]', {
        fontSize: Math.round(this.scale.width / 32) + 'px',
        fontFamily: 'monospace',
        color: '#ffff44',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      fsBtn.on('pointerover', () => fsBtn.setColor('#ffff88'));
      fsBtn.on('pointerout', () => fsBtn.setColor('#ffff44'));
      fsBtn.on('pointerdown', () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      });
      this.menuObjects.push(fsBtn);
    }

    // Leaderboard button
    const lbBtn = this.add.text(cx, cy + 80, '[ LEADERBOARD ]', {
      fontSize: Math.round(this.scale.width / 32) + 'px',
      fontFamily: 'monospace',
      color: '#4488ff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    lbBtn.on('pointerover', () => lbBtn.setColor('#88bbff'));
    lbBtn.on('pointerout', () => lbBtn.setColor('#4488ff'));
    lbBtn.on('pointerdown', () => this.showLeaderboard());
    this.menuObjects.push(lbBtn);

    // Shop button
    const shopBtn = this.add.text(cx, cy + 120, '[ SHOP ]', {
      fontSize: Math.round(this.scale.width / 32) + 'px',
      fontFamily: 'monospace',
      color: '#ffaa44',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    shopBtn.on('pointerover', () => shopBtn.setColor('#ffcc88'));
    shopBtn.on('pointerout', () => shopBtn.setColor('#ffaa44'));
    shopBtn.on('pointerdown', () => {
      console.log('Shop coming soon in v0.1.2!');
    });
    this.menuObjects.push(shopBtn);

    const moveText = this.add.text(cx, cy + 180, 'Move: W A S D', {
      fontSize: Math.round(this.scale.width / 48) + 'px',
      fontFamily: 'monospace',
      color: '#666666',
    }).setOrigin(0.5);
    this.menuObjects.push(moveText);
  }

  onResize(gameSize) {
    this.drawMenu();
  }

  async showLeaderboard() {
    if (this.leaderboardContainer) {
      this.leaderboardContainer.destroy();
      this.leaderboardContainer = null;
      return;
    }

    const cx = GAME.WIDTH / 2;
    this.leaderboardContainer = this.add.container(cx, 200);

    const bg = this.add.rectangle(0, 0, 500, 300, 0x000000, 0.85).setOrigin(0.5, 0);
    this.leaderboardContainer.add(bg);

    const title = this.add.text(0, 15, 'TOP 10 SCORES', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffff44',
    }).setOrigin(0.5);
    this.leaderboardContainer.add(title);

    try {
      const res = await fetch('/api/leaderboard');
      const scores = await res.json();
      scores.forEach((entry, i) => {
        const mins = Math.floor(entry.timeSurvived / 60);
        const secs = entry.timeSurvived % 60;
        const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;
        const line = `${i + 1}. ${entry.name.padEnd(12)} ${timeStr}  ${entry.kills} kills`;
        const t = this.add.text(0, 50 + i * 24, line, {
          fontSize: '14px', fontFamily: 'monospace', color: '#cccccc',
        }).setOrigin(0.5);
        this.leaderboardContainer.add(t);
      });
      if (scores.length === 0) {
        const t = this.add.text(0, 80, 'No scores yet!', {
          fontSize: '16px', fontFamily: 'monospace', color: '#666666',
        }).setOrigin(0.5);
        this.leaderboardContainer.add(t);
      }
    } catch {
      const t = this.add.text(0, 80, 'Could not load leaderboard', {
        fontSize: '16px', fontFamily: 'monospace', color: '#ff4444',
      }).setOrigin(0.5);
      this.leaderboardContainer.add(t);
    }
  }
}
