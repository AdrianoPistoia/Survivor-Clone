import Phaser from 'phaser';

export default class PauseMenuScene extends Phaser.Scene {
  constructor() {
    super('PauseMenu');
  }

  init(data) {
    this.gameScene = data.gameScene;
  }

  create() {
    this.pauseObjects = [];
    this.drawPauseMenu();
    this.scale.on('resize', this.onResize, this);
  }

  drawPauseMenu() {
    if (this.pauseObjects) {
      this.pauseObjects.forEach(obj => obj.destroy());
    }
    this.pauseObjects = [];

    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    // Dim overlay
    const overlay = this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.8);
    overlay.setInteractive();
    this.pauseObjects.push(overlay);

    // Title
    const title = this.add.text(cx, cy - 150, 'PAUSED', {
      fontSize: Math.round(this.scale.width / 14) + 'px',
      fontFamily: 'monospace',
      color: '#ffff44',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.pauseObjects.push(title);

    // Button dimensions
    const buttonWidth = 200;
    const buttonHeight = 60;
    const spacing = 90;

    // Resume button
    this.createButton(cx, cy - 60, 'RESUME', buttonWidth, buttonHeight, () => {
      this.resumeGame();
    });

    // Settings button
    this.createButton(cx, cy + 30, 'SETTINGS', buttonWidth, buttonHeight, () => {
      this.openSettings();
    });

    // Inventory button
    this.createButton(cx, cy + 120, 'INVENTORY', buttonWidth, buttonHeight, () => {
      this.openInventory();
    });

    // Exit button
    this.createButton(cx, cy + 210, 'EXIT', buttonWidth, buttonHeight, () => {
      this.exitToMenu();
    });
  }

  createButton(x, y, text, width, height, callback) {
    const bg = this.add.rectangle(x, y, width, height, 0x1a1a2e, 0.9);
    bg.setStrokeStyle(2, 0x4488ff);
    bg.setInteractive({ useHandCursor: true });
    this.pauseObjects.push(bg);

    const buttonText = this.add.text(x, y, text, {
      fontSize: Math.round(this.scale.width / 32) + 'px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.pauseObjects.push(buttonText);

    // Hover effects
    bg.on('pointerover', () => {
      bg.setStrokeStyle(2, 0x88ff88);
      buttonText.setColor('#88ff88');
    });

    bg.on('pointerout', () => {
      bg.setStrokeStyle(2, 0x4488ff);
      buttonText.setColor('#ffffff');
    });

    bg.on('pointerdown', callback);
  }

  resumeGame() {
    this.gameScene.isPaused = false;
    this.gameScene.physics.resume();
    this.scene.stop();
  }

  openSettings() {
    // Show placeholder settings screen
    if (this.settingsContainer) {
      this.settingsContainer.destroy();
      this.settingsContainer = null;
      return;
    }

    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.settingsContainer = this.add.container(cx, cy - 80);
    this.pauseObjects.push(this.settingsContainer);

    const bg = this.add.rectangle(0, 0, 300, 200, 0x222244, 0.95).setOrigin(0.5, 0);
    this.settingsContainer.add(bg);
    bg.setStrokeStyle(2, 0x4488ff);

    const title = this.add.text(0, 15, 'SETTINGS', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffff44',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.settingsContainer.add(title);

    const comingSoon = this.add.text(0, 100, 'Coming Soon', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#aaaaaa',
    }).setOrigin(0.5);
    this.settingsContainer.add(comingSoon);
  }

  openInventory() {
    // Show inventory panel
    if (this.inventoryContainer) {
      this.inventoryContainer.destroy();
      this.inventoryContainer = null;
      return;
    }

    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.inventoryContainer = this.add.container(cx, cy - 100);
    this.pauseObjects.push(this.inventoryContainer);

    const bg = this.add.rectangle(0, 0, 400, 300, 0x222244, 0.95).setOrigin(0.5, 0);
    this.inventoryContainer.add(bg);
    bg.setStrokeStyle(2, 0x4488ff);

    const title = this.add.text(0, 15, 'INVENTORY', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffff44',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.inventoryContainer.add(title);

    // Weapons section
    const weaponsLabel = this.add.text(-160, 50, 'Weapons:', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#ff8844',
    });
    this.inventoryContainer.add(weaponsLabel);

    const weapons = this.gameScene.weapons;
    let weaponY = 70;
    for (let i = 0; i < 5; i++) {
      const weapon = weapons[i];
      const weaponName = weapon ? weapon.constructor.name : '[ Empty ]';
      const color = weapon ? '#88ff88' : '#666666';
      const text = this.add.text(-160, weaponY, `${i + 1}. ${weaponName}`, {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: color,
      });
      this.inventoryContainer.add(text);
      weaponY += 20;
    }

    // Items section
    const itemsLabel = this.add.text(20, 50, 'Items:', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#88ff44',
    });
    this.inventoryContainer.add(itemsLabel);

    let itemY = 70;
    for (let i = 0; i < 5; i++) {
      const text = this.add.text(20, itemY, `${i + 1}. [ Empty ]`, {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#666666',
      });
      this.inventoryContainer.add(text);
      itemY += 20;
    }
  }

  exitToMenu() {
    this.gameScene.isGameOver = true;
    this.gameScene.physics.pause();
    if (this.gameScene.gameTimer) {
      this.gameScene.gameTimer.remove();
    }
    this.scene.stop();
    this.scene.start('Menu');
  }

  onResize(gameSize) {
    this.drawPauseMenu();
  }
}
