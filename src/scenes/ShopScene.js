import Phaser from 'phaser';
import { GAME, SHOP, REROLL } from '../config/constants.js';
import { getSilverCoins, spendSilverCoins } from '../utils/silverCoins.js';

const TABS = ['UPGRADES', 'WEAPONS', 'CHARACTERS'];

export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create() {
    this.activeTab = 0;
    this.objects = [];
    this.draw();
  }

  draw() {
    this.objects.forEach(o => o.destroy());
    this.objects = [];

    const cx = GAME.WIDTH / 2;
    const W = GAME.WIDTH;
    const H = GAME.HEIGHT;

    // Background
    const bg = this.add.rectangle(cx, H / 2, W, H, 0x111122);
    this.objects.push(bg);

    // Title
    const title = this.add.text(cx, 30, 'SHOP', {
      fontSize: '36px', fontFamily: 'monospace', color: '#ffaa44', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.objects.push(title);

    // Tab buttons
    const tabY = 80;
    const tabW = 180;
    TABS.forEach((tab, i) => {
      const isActive = i === this.activeTab;
      const tx = cx - tabW + i * tabW;
      const color = isActive ? '#ffff44' : '#888888';
      const tabBtn = this.add.text(tx, tabY, `[ ${tab} ]`, {
        fontSize: '16px', fontFamily: 'monospace', color,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      if (!isActive) {
        tabBtn.on('pointerover', () => tabBtn.setColor('#bbbbbb'));
        tabBtn.on('pointerout', () => tabBtn.setColor('#888888'));
        tabBtn.on('pointerdown', () => { this.activeTab = i; this.draw(); });
      }
      this.objects.push(tabBtn);
    });

    // Divider
    const line = this.add.rectangle(cx, 100, W - 40, 1, 0x444466);
    this.objects.push(line);

    // Tab content
    if (this.activeTab === 0) this.drawUpgradesTab(cx);
    else if (this.activeTab === 1) this.drawPlaceholderTab(cx, 'Weapons coming soon...');
    else this.drawPlaceholderTab(cx, 'No characters available yet.');

    // Bottom bar
    const coins = getSilverCoins();
    const barY = H - 40;
    const coinLabel = this.add.text(cx - 120, barY, `🪙 Silver Coins: ${coins.toLocaleString()}`, {
      fontSize: '18px', fontFamily: 'monospace', color: '#cccccc',
    }).setOrigin(0.5);
    this.objects.push(coinLabel);

    const backBtn = this.add.text(cx + 180, barY, '[ BACK ]', {
      fontSize: '18px', fontFamily: 'monospace', color: '#4488ff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    backBtn.on('pointerover', () => backBtn.setColor('#88bbff'));
    backBtn.on('pointerout', () => backBtn.setColor('#4488ff'));
    backBtn.on('pointerdown', () => this.scene.start('Menu'));
    this.objects.push(backBtn);
  }

  drawUpgradesTab(cx) {
    const rerollMax      = parseInt(localStorage.getItem('rerollMax') || '0', 10) || 1;
    const purchaseCount  = rerollMax - 1; // default of 1 = 0 purchases made
    const isMaxed        = purchaseCount >= SHOP.REROLL_MAX_PURCHASES;
    const cost           = isMaxed ? null : SHOP.REROLL_COSTS[purchaseCount];
    const coins          = getSilverCoins();
    const canAfford      = !isMaxed && coins >= cost;

    const cardY = 280;
    const cardW = 260;
    const cardH = 220;

    const borderColor = isMaxed ? 0x555533 : canAfford ? 0x4488ff : 0x333355;
    const cardBg = this.add.rectangle(cx, cardY, cardW, cardH, 0x222244);
    cardBg.setStrokeStyle(2, borderColor);
    this.objects.push(cardBg);

    const itemTitle = this.add.text(cx, cardY - 70, 'Extra Reroll', {
      fontSize: '18px', fontFamily: 'monospace', color: isMaxed ? '#666666' : '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.objects.push(itemTitle);

    const tiers = SHOP.REROLL_COSTS.map((c, i) => {
      const done = i < purchaseCount;
      const active = i === purchaseCount;
      const marker = done ? '✓' : active ? '▶' : ' ';
      const color = done ? '#444444' : active ? '#ffffff' : '#555555';
      return { text: `  ${marker} Tier ${i + 1}  ${c.toLocaleString()} 🪙`, color };
    });

    tiers.forEach((tier, i) => {
      const t = this.add.text(cx, cardY - 38 + i * 20, tier.text, {
        fontSize: '12px', fontFamily: 'monospace', color: tier.color,
      }).setOrigin(0.5);
      this.objects.push(t);
    });

    if (isMaxed) {
      const maxedLabel = this.add.text(cx, cardY + 72, 'MAXED', {
        fontSize: '24px', fontFamily: 'monospace', color: '#ffff44', fontStyle: 'bold',
      }).setOrigin(0.5);
      this.objects.push(maxedLabel);
    } else {
      const costLabel = this.add.text(cx, cardY + 30, `Cost: ${cost.toLocaleString()} 🪙`, {
        fontSize: '16px', fontFamily: 'monospace', color: canAfford ? '#cccccc' : '#666666',
      }).setOrigin(0.5);
      this.objects.push(costLabel);

      const buyColor = canAfford ? '#44ff44' : '#444444';
      const buyBtn = this.add.text(cx, cardY + 72, '[ BUY ]', {
        fontSize: '20px', fontFamily: 'monospace', color: buyColor,
      }).setOrigin(0.5);
      this.objects.push(buyBtn);

      if (canAfford) {
        buyBtn.setInteractive({ useHandCursor: true });
        buyBtn.on('pointerover', () => buyBtn.setColor('#88ff88'));
        buyBtn.on('pointerout', () => buyBtn.setColor(buyColor));
        buyBtn.on('pointerdown', () => {
          if (spendSilverCoins(cost)) {
            localStorage.setItem('rerollMax', String(rerollMax + 1));
            this.draw();
          }
        });
      }
    }
  }

  drawPlaceholderTab(cx, message) {
    const t = this.add.text(cx, 300, message, {
      fontSize: '18px', fontFamily: 'monospace', color: '#555566',
    }).setOrigin(0.5);
    this.objects.push(t);
  }
}
