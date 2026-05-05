import Phaser from 'phaser';
import { GAME, SCORE, SILVER_COINS } from '../config/constants.js';
import { addSilverCoins, getSilverCoins } from '../utils/silverCoins.js';
import { insertScore } from '../utils/leaderboard.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.stats = data || {};
    this.stats.kills = this.stats.kills || 0;
    this.stats.time = this.stats.time || 0;
    this.stats.level = this.stats.level || 1;
    this.stats.victory = this.stats.victory || false;

    this.runScore = (this.stats.kills * SCORE.PER_KILL)
      + (this.stats.time * SCORE.PER_SECOND)
      + ((this.stats.level - 1) * SCORE.PER_LEVEL);
    const ratio = this.stats.victory ? SILVER_COINS.WIN_RATIO : SILVER_COINS.LOSE_RATIO;
    this.coinRatioPct = this.stats.victory ? '10%' : '5%';
    this.coinsEarned = Math.floor(this.runScore * ratio);
    addSilverCoins(this.coinsEarned);
  }

  create() {
    const cx = GAME.WIDTH / 2;

    const titleText = this.stats.victory ? 'VICTORY!' : 'GAME OVER';
    const titleColor = this.stats.victory ? '#44ff44' : '#ff4444';

    this.add.text(cx, 40, titleText, {
      fontSize: '48px', fontFamily: 'monospace', color: titleColor, fontStyle: 'bold',
    }).setOrigin(0.5);

    // Basic stats
    const mins = Math.floor(this.stats.time / 60);
    const secs = this.stats.time % 60;
    const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;

    this.add.text(cx, 100, `Time: ${timeStr}   Kills: ${this.stats.kills}   Level: ${this.stats.level}`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#aaaaaa',
    }).setOrigin(0.5);

    // Receipt block — animate lines in
    this.buildReceipt(cx);

    // Name input + buttons — shown after receipt finishes (~2.2s)
    this.playerName = 'Player';
    this.submitted = false;

    this.time.delayedCall(2300, () => this.buildNameInput(cx));
  }

  buildReceipt(cx) {
    const sep  = '────────────────────────';
    const sep2 = '════════════════════════';
    const fmt = (n) => n.toLocaleString();

    const killPts  = this.stats.kills * SCORE.PER_KILL;
    const timePts  = this.stats.time  * SCORE.PER_SECOND;
    const levelPts = (this.stats.level - 1) * SCORE.PER_LEVEL;

    const coinColor = '#cccccc';

    const lines = [
      { text: sep,                                                          color: '#666666' },
      { text: '        RUN RECEIPT',                                        color: '#ffff44' },
      { text: sep,                                                          color: '#666666' },
      { text: `  Kills          ${fmt(this.stats.kills)}`,                  color: '#ffffff' },
      { text: `  × ${SCORE.PER_KILL}pts          ${fmt(killPts)}`,          color: '#aaaaaa' },
      { text: `  Time           ${Math.floor(this.stats.time/60)}:${String(this.stats.time%60).padStart(2,'0')}`, color: '#ffffff' },
      { text: `  × ${SCORE.PER_SECOND}pts           ${fmt(timePts)}`,       color: '#aaaaaa' },
      { text: `  Level          ${this.stats.level}`,                       color: '#ffffff' },
      { text: `  × ${SCORE.PER_LEVEL}pts         ${fmt(levelPts)}`,         color: '#aaaaaa' },
      { text: sep,                                                          color: '#666666' },
      { text: `  Total Score    ${fmt(this.runScore)}`,                     color: '#ffffff' },
      { text: `  × ${this.coinRatioPct}       → ${fmt(this.coinsEarned)} 🪙`, color: coinColor },
      { text: sep2,                                                         color: '#666666' },
      { text: `  Extra Silver Coins  +${fmt(this.coinsEarned)} 🪙`,         color: coinColor },
      { text: sep,                                                          color: '#666666' },
    ];

    const startY = 135;
    const lineH = 22;
    lines.forEach((line, i) => {
      this.time.delayedCall(i * 150, () => {
        this.add.text(cx, startY + i * lineH, line.text, {
          fontSize: '14px', fontFamily: 'monospace', color: line.color,
        }).setOrigin(0.5);
      });
    });
  }

  buildNameInput(cx) {
    const baseY = 480;

    this.add.text(cx, baseY, 'Enter your name:', {
      fontSize: '16px', fontFamily: 'monospace', color: '#aaaaaa',
    }).setOrigin(0.5);

    this.nameText = this.add.text(cx, baseY + 30, '> Player_', {
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

    const submitBtn = this.add.text(cx, baseY + 70, '[ SUBMIT SCORE ]', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffff44',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    submitBtn.on('pointerover', () => submitBtn.setColor('#ffff88'));
    submitBtn.on('pointerout', () => submitBtn.setColor('#ffff44'));
    submitBtn.on('pointerdown', () => this.submitScore());

    const menuBtn = this.add.text(cx, baseY + 110, '[ MENU ]', {
      fontSize: '20px', fontFamily: 'monospace', color: '#4488ff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerover', () => menuBtn.setColor('#88bbff'));
    menuBtn.on('pointerout', () => menuBtn.setColor('#4488ff'));
    menuBtn.on('pointerdown', () => this.scene.start('Menu'));

    this.statusText = this.add.text(cx, baseY + 145, '', {
      fontSize: '14px', fontFamily: 'monospace', color: '#888888',
    }).setOrigin(0.5);
  }

  submitScore() {
    if (this.submitted) return;
    if (!this.playerName.trim()) return;
    this.submitted = true;

    insertScore({
      name: this.playerName.trim().substring(0, 20),
      kills: this.stats.kills,
      timeSurvived: this.stats.time,
      level: this.stats.level,
      score: this.runScore,
    });

    if (this.statusText) {
      this.statusText.setText('Score saved!').setColor('#44ff44');
    }
  }
}
