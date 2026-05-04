import { GAME } from '../config/constants.js';

export default class HUD {
  constructor(scene) {
    this.scene = scene;
    const sf = 0; // fixed to camera

    // Create all HUD elements once
    this.bgHp = scene.add.rectangle(0, 0, 300, 16, 0x333333).setOrigin(0.5, 0).setScrollFactor(sf).setDepth(100);
    this.hpBar = scene.add.rectangle(0, 0, 300, 12, 0xff4444).setOrigin(0, 0).setScrollFactor(sf).setDepth(101);
    this.hpText = scene.add.text(0, 0, '', { fontSize: '11px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5, 0).setScrollFactor(sf).setDepth(102);
    this.bgXp = scene.add.rectangle(0, 0, 300, 10, 0x333333).setOrigin(0.5, 0).setScrollFactor(sf).setDepth(100);
    this.xpBar = scene.add.rectangle(0, 0, 300, 8, 0x44ff44).setOrigin(0, 0).setScrollFactor(sf).setDepth(101);
    this.levelText = scene.add.text(0, 0, '', { fontSize: '10px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5, 0).setScrollFactor(sf).setDepth(102);
    this.timerText = scene.add.text(0, 0, '0:00', { fontSize: '20px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(1, 0).setScrollFactor(sf).setDepth(100);
    this.killText = scene.add.text(0, 0, 'Kills: 0', { fontSize: '14px', fontFamily: 'monospace', color: '#ffff44' }).setOrigin(0, 0).setScrollFactor(sf).setDepth(100);
    this.weaponText = scene.add.text(0, 0, '', { fontSize: '12px', fontFamily: 'monospace', color: '#aaaaaa' }).setOrigin(0, 0).setScrollFactor(sf).setDepth(100);

    // Initial position
    this.reposition();
    // Listen for resize
    scene.scale.on('resize', () => this.reposition());
  }

  reposition() {
    const scene = this.scene;
    const width = scene.scale.width;
    // Use safe area inset if available
    const safeTop = (window.visualViewport && window.visualViewport.offsetTop) || 0;
    const pad = 4 + safeTop;
    // Account for camera zoom
    const zoom = scene.cameras && scene.cameras.main ? scene.cameras.main.zoom : 1;
    let y = (pad + 8) / zoom;
    // HP bar
    this.bgHp.setPosition(width / 2, y);
    this.hpBar.setPosition(width / 2 - 150, y + 2);
    this.hpText.setPosition(width / 2, y + 1);
    y += 20 / zoom;
    // XP bar
    this.bgXp.setPosition(width / 2, y);
    this.xpBar.setPosition(width / 2 - 150, y + 2);
    this.levelText.setPosition(width / 2, y + 1);
    y += 18 / zoom;
    // Timer
    this.timerText.setPosition(width - 10, pad / zoom);
    // Kill counter
    this.killText.setPosition(10, pad / zoom);
    // Weapon list
    this.weaponText.setPosition(10, (pad + 20) / zoom);
  }

  update() {
    const scene = this.scene;
    const player = scene.player;
    const xpSys = scene.xpSystem;

    // HP bar
    const hpRatio = Math.max(0, player.hp / player.getMaxHP());
    this.hpBar.width = 300 * hpRatio;
    this.hpText.setText(`${Math.ceil(player.hp)} / ${player.getMaxHP()}`);

    // XP bar
    const xpRatio = xpSys.getProgress();
    this.xpBar.width = 300 * xpRatio;
    this.levelText.setText(`Lv ${xpSys.level}`);

    // Timer
    const mins = Math.floor(scene.elapsedTime / 60);
    const secs = scene.elapsedTime % 60;
    this.timerText.setText(`${mins}:${String(secs).padStart(2, '0')}`);

    // Kills
    this.killText.setText(`Kills: ${scene.kills}`);

    // Weapons list
    const weaponNames = scene.weapons.map(w => w.constructor.name);
    this.weaponText.setText(weaponNames.join(' | '));
  }
}
