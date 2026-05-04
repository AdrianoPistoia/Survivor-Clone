import Phaser from 'phaser';
import { GAME } from '../config/constants.js';
import UPGRADE_DEFS from '../config/upgrades.js';

export default class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('Upgrade');
  }

  init(data) {
    this.gameScene = data.gameScene;
  }

  create() {
    this.upgradeObjects = [];
    this.drawUpgradeMenu();
    this.scale.on('resize', this.onResize, this);
  }

  drawUpgradeMenu() {
    if (this.upgradeObjects) {
      this.upgradeObjects.forEach(obj => obj.destroy());
    }
    this.upgradeObjects = [];
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;
    const cardWidth = Math.min(220, this.scale.width / 3.5);
    // Make cards taller for better readability
    const cardHeight = Math.min(340, this.scale.height / 1.45);
    const cardSpacing = Math.min(260, this.scale.width / 2.5);

    // Dim overlay
    const overlay = this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.7);
    this.upgradeObjects.push(overlay);

    const title = this.add.text(cx, cy - cardHeight, 'LEVEL UP!', {
      fontSize: Math.round(this.scale.width / 18) + 'px', fontFamily: 'monospace', color: '#ffff44', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.upgradeObjects.push(title);

    const subtitle = this.add.text(cx, cy - cardHeight + 40, 'Choose an upgrade:', {
      fontSize: Math.round(this.scale.width / 36) + 'px', fontFamily: 'monospace', color: '#aaaaaa',
    }).setOrigin(0.5);
    this.upgradeObjects.push(subtitle);

    // Get available upgrades
    const available = this.getAvailableUpgrades();
    const choices = Phaser.Utils.Array.Shuffle(available).slice(0, 3);

    choices.forEach((upgrade, i) => {
      this.createCard(cx - cardSpacing + i * cardSpacing, cy + 30, upgrade, cardWidth, cardHeight);
    });
  }

  onResize(gameSize) {
    this.drawUpgradeMenu();
  }

  getAvailableUpgrades() {
    const player = this.gameScene.player;
    return UPGRADE_DEFS.filter(def => {
      const currentLevel = player.upgradeLevels[def.id] || 0;
      if (currentLevel >= def.maxLevel) return false;
      // If it's a weapon, only show if player doesn't have it yet
      if (def.isWeapon) {
        return !this.gameScene.weapons.find(w =>
          w.constructor.name === def.weaponType
        );
      }
      return true;
    });
  }

  createCard(x, y, upgrade, cardWidth = 220, cardHeight = 280) {
    const player = this.gameScene.player;
    const currentLevel = player.upgradeLevels[upgrade.id] || 0;

    const container = this.add.container(x, y);

    // Card background
    const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x222244, 0.9);
    bg.setStrokeStyle(2, 0x4488ff);
    container.add(bg);

    // Icon (50% smaller)
    const iconSize = cardWidth / 4;
    const icon = this.add.image(0, -cardHeight / 3.1, upgrade.icon).setDisplaySize(iconSize, iconSize);
    container.add(icon);

    // Name
    const name = this.add.text(0, -cardHeight / 6, upgrade.name, {
      fontSize: Math.round(cardWidth / 7) + 'px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
      wordWrap: { width: cardWidth - 24 }, align: 'center',
    }).setOrigin(0.5);
    container.add(name);

    // Level
    if (!upgrade.isWeapon) {
      const lvlText = `Lv ${currentLevel} → ${currentLevel + 1}`;
      const lvl = this.add.text(0, -cardHeight / 12, lvlText, {
        fontSize: Math.round(cardWidth / 11) + 'px', fontFamily: 'monospace', color: '#88ff88',
      }).setOrigin(0.5);
      container.add(lvl);
    } else {
      const newLabel = this.add.text(0, -cardHeight / 12, 'NEW WEAPON', {
        fontSize: Math.round(cardWidth / 11) + 'px', fontFamily: 'monospace', color: '#ffff44',
      }).setOrigin(0.5);
      container.add(newLabel);
    }

    // Description
    const desc = this.add.text(0, cardHeight / 6, upgrade.description, {
      fontSize: Math.round(cardWidth / 13) + 'px', fontFamily: 'monospace', color: '#aaaaaa',
      wordWrap: { width: cardWidth - 28 }, align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5);
    container.add(desc);

    // Make interactive
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => bg.setStrokeStyle(2, 0x88ff88));
    bg.on('pointerout', () => bg.setStrokeStyle(2, 0x4488ff));
    bg.on('pointerdown', () => this.selectUpgrade(upgrade));
    this.upgradeObjects.push(container);
  }

  selectUpgrade(upgrade) {
    const player = this.gameScene.player;
    const newLevel = (player.upgradeLevels[upgrade.id] || 0) + 1;
    player.upgradeLevels[upgrade.id] = newLevel;

    if (upgrade.isWeapon) {
      this.gameScene.addWeapon(upgrade.weaponType);
    } else {
      upgrade.apply(player, newLevel);
    }

    this.scene.stop();
    this.gameScene.resumeFromUpgrade();
  }
}
