import Phaser from 'phaser';
import { GAME } from '../config/constants.js';
import { getTopScores } from '../utils/leaderboard.js';

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

  async drawMenu() {
    if (this.menuObjects) {
      this.menuObjects.forEach(obj => obj.destroy());
    }
    this.menuObjects = [];
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    // Fetch version from version.json
    let versionString = '';
    try {
      const response = await fetch('version.json?_=' + Date.now());
      if (response.ok) {
        const version = await response.json();
        versionString = `${version.stage}.${version.revision}.${version.implementation}_${String(version.iteration).padStart(3, '0')}`;
      }
    } catch (e) {
      versionString = '';
    }

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

    // Show version at the bottom right
    if (versionString) {
      const versionText = this.add.text(this.scale.width - 20, this.scale.height - 20, `v${versionString}`, {
        fontSize: Math.round(this.scale.width / 50) + 'px',
        fontFamily: 'monospace',
        color: '#888888',
      }).setOrigin(1, 1);
      this.menuObjects.push(versionText);
    }


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
    shopBtn.on('pointerdown', () => this.scene.start('Shop'));
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

  showLeaderboard() {
    if (this.leaderboardContainer) {
      this.leaderboardContainer.destroy();
      this.leaderboardContainer = null;
      return;
    }

    const cx = GAME.WIDTH / 2;
    this.leaderboardContainer = this.add.container(cx, 200);

    const scores = getTopScores(10);
    const bgHeight = scores.length > 0 ? 60 + scores.length * 24 + 20 : 110;
    const bg = this.add.rectangle(0, 0, 540, bgHeight, 0x000000, 0.85).setOrigin(0.5, 0);
    this.leaderboardContainer.add(bg);

    const title = this.add.text(0, 15, 'TOP 10 SCORES', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffff44',
    }).setOrigin(0.5);
    this.leaderboardContainer.add(title);

    if (scores.length === 0) {
      const t = this.add.text(0, 60, 'No scores yet!', {
        fontSize: '16px', fontFamily: 'monospace', color: '#666666',
      }).setOrigin(0.5);
      this.leaderboardContainer.add(t);
    } else {
      scores.forEach((entry, i) => {
        const mins = Math.floor(entry.timeSurvived / 60);
        const secs = entry.timeSurvived % 60;
        const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;
        const scoreStr = (entry.score || 0).toLocaleString();
        const line = `${String(i + 1).padStart(2)}. ${entry.name.substring(0, 12).padEnd(12)}  ${timeStr}  ${String(entry.kills).padStart(4)} kills  ${scoreStr}pts`;
        const t = this.add.text(0, 50 + i * 24, line, {
          fontSize: '13px', fontFamily: 'monospace', color: '#cccccc',
        }).setOrigin(0.5);
        this.leaderboardContainer.add(t);
      });
    }
  }
}
