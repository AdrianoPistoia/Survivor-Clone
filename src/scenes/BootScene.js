import Phaser from 'phaser';
import { PLAYER, ENEMY, WEAPONS } from '../config/constants.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.generateTextures();
    this.scene.start('Menu');
  }

  generateTextures() {
    // Player - blue square
    const pg = this.make.graphics({ add: false });
    pg.fillStyle(0x4488ff);
    pg.fillRect(0, 0, PLAYER.SIZE * 2, PLAYER.SIZE * 2);
    pg.generateTexture('player', PLAYER.SIZE * 2, PLAYER.SIZE * 2);
    pg.destroy();

    // Enemy - red circle
    const eg = this.make.graphics({ add: false });
    eg.fillStyle(0xff4444);
    eg.fillCircle(ENEMY.SIZE, ENEMY.SIZE, ENEMY.SIZE);
    eg.generateTexture('enemy', ENEMY.SIZE * 2, ENEMY.SIZE * 2);
    eg.destroy();

    // Gem - green diamond
    const gg = this.make.graphics({ add: false });
    gg.fillStyle(0x44ff44);
    gg.fillTriangle(8, 0, 16, 8, 8, 16);
    gg.fillTriangle(8, 0, 0, 8, 8, 16);
    gg.generateTexture('gem', 16, 16);
    gg.destroy();

    // Projectile - yellow circle
    const prg = this.make.graphics({ add: false });
    prg.fillStyle(0xffff44);
    prg.fillCircle(5, 5, 5);
    prg.generateTexture('projectile', 10, 10);
    prg.destroy();

    // Whip - white rectangle
    const wg = this.make.graphics({ add: false });
    wg.fillStyle(0xffffff);
    wg.fillRect(0, 0, WEAPONS.WHIP.RANGE, 12);
    wg.generateTexture('whip', WEAPONS.WHIP.RANGE, 12);
    wg.destroy();

    // Aura - cyan circle (semi transparent)
    const ag = this.make.graphics({ add: false });
    ag.fillStyle(0x44ffff, 0.25);
    ag.fillCircle(WEAPONS.AURA.RADIUS, WEAPONS.AURA.RADIUS, WEAPONS.AURA.RADIUS);
    ag.lineStyle(2, 0x44ffff, 0.6);
    ag.strokeCircle(WEAPONS.AURA.RADIUS, WEAPONS.AURA.RADIUS, WEAPONS.AURA.RADIUS);
    ag.generateTexture('aura', WEAPONS.AURA.RADIUS * 2, WEAPONS.AURA.RADIUS * 2);
    ag.destroy();

    // Upgrade icons (colored squares)
    const colors = {
      upgrade_damage: 0xff6644,
      upgrade_speed: 0xffff44,
      upgrade_move: 0x44ff88,
      upgrade_hp: 0xff4488,
      upgrade_magnet: 0x88ff44,
      upgrade_whip: 0xffffff,
      upgrade_missile: 0xffff44,
      upgrade_aura: 0x44ffff,
      // new weapons
      upgrade_dagger: 0xaaddff,
      upgrade_axe: 0xff8822,
      upgrade_bible: 0xffffaa,
      upgrade_lightning: 0xeeff44,
      upgrade_holywater: 0x44aaff,
    };
    for (const [key, color] of Object.entries(colors)) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(color);
      g.fillRoundedRect(0, 0, 40, 40, 6);
      g.generateTexture(key, 40, 40);
      g.destroy();
    }

    // --- New weapon textures ---

    // Dagger - thin silver triangle pointing right
    const dg = this.make.graphics({ add: false });
    dg.fillStyle(0xaaddff);
    dg.fillTriangle(0, 4, 20, 2, 0, 0);
    dg.generateTexture('dagger', 20, 6);
    dg.destroy();

    // Axe - orange diamond/wedge shape
    const axg = this.make.graphics({ add: false });
    axg.fillStyle(0xff8822);
    axg.fillTriangle(12, 0, 24, 20, 0, 20);
    axg.fillStyle(0xffaa55);
    axg.fillRect(10, 18, 4, 8);
    axg.generateTexture('axe', 24, 26);
    axg.destroy();

    // Bible - gold book rectangle
    const bg2 = this.make.graphics({ add: false });
    bg2.fillStyle(0xddcc44);
    bg2.fillRect(0, 0, 18, 22);
    bg2.fillStyle(0xffee88);
    bg2.fillRect(2, 2, 14, 18);
    bg2.fillStyle(0xddcc44);
    bg2.fillRect(7, 4, 4, 14);
    bg2.generateTexture('bible', 18, 22);
    bg2.destroy();

    // Lightning bolt - bright yellow zigzag
    const lg2 = this.make.graphics({ add: false });
    lg2.fillStyle(0xeeff44);
    lg2.fillTriangle(10, 0, 18, 10, 10, 10);
    lg2.fillTriangle(8, 10, 16, 10, 6, 22);
    lg2.generateTexture('lightning_bolt', 20, 22);
    lg2.destroy();

    // Lightning chain line (1x1 pixel used for drawing lines)
    const lc = this.make.graphics({ add: false });
    lc.fillStyle(0xeeff44);
    lc.fillRect(0, 0, 1, 1);
    lc.generateTexture('pixel_yellow', 1, 1);
    lc.destroy();

    // Holy water zone (blue glowing circle)
    const hw = this.make.graphics({ add: false });
    const r = WEAPONS.HOLY_WATER.ZONE_RADIUS;
    hw.fillStyle(0x44aaff, 0.3);
    hw.fillCircle(r, r, r);
    hw.lineStyle(3, 0x88ccff, 0.8);
    hw.strokeCircle(r, r, r);
    hw.generateTexture('holy_zone', r * 2, r * 2);
    hw.destroy();

    // Holy water flask - small blue circle projectile
    const hf = this.make.graphics({ add: false });
    hf.fillStyle(0x44aaff);
    hf.fillCircle(6, 6, 6);
    hf.fillStyle(0xaaddff, 0.6);
    hf.fillCircle(4, 4, 3);
    hf.generateTexture('holy_flask', 12, 12);
    hf.destroy();

    // Arena floor tile
    const tg = this.make.graphics({ add: false });
    tg.fillStyle(0x1a1a2e);
    tg.fillRect(0, 0, 64, 64);
    tg.lineStyle(1, 0x222244, 0.5);
    tg.strokeRect(0, 0, 64, 64);
    tg.generateTexture('tile', 64, 64);
    tg.destroy();
  }
}
