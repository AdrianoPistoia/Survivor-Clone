import Phaser from 'phaser';
import { GAME } from './config/constants.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import UpgradeScene from './scenes/UpgradeScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import PauseMenuScene from './scenes/PauseMenuScene.js';
import ShopScene from './scenes/ShopScene.js';

// === DEBUG FUNCTIONS FOR BROWSER CONSOLE ===
if (typeof window !== 'undefined') {
  window.setCoinsTo = (amount) => {
    localStorage.setItem('silverCoins', String(amount));
    return `silverCoins set to ${amount}`;
  };
  window.resetShop = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('shop_')) localStorage.setItem(key, 'false');
    });
    localStorage.removeItem('rerollMax');
    return 'All shop purchases and rerolls reset.';
  };
  window.setHealthTo = (amount) => {
    localStorage.setItem('playerHP', String(amount));
    // Live update if in-game
    if (window.game && window.game.scene && window.game.scene.isActive('Game')) {
      const scene = window.game.scene.getScene('Game');
      if (scene && scene.player) {
        scene.player.hp = Number(amount);
        if (scene.hud && scene.hud.update) scene.hud.update();
      }
    }
    return `playerHP set to ${amount}`;
  };
  window.dropExp = (count = 1) => {
    localStorage.setItem('dropExp', String(count));
    return `Will drop ${count} exp orbs at center next tick.`;
  };
  window.dropHealth = (count = 1) => {
    localStorage.setItem('dropHealth', String(count));
    return `Will drop ${count} health orbs at center next tick.`;
  };
  window.dropCollector = () => {
    localStorage.setItem('dropCollector', '1');
    return 'Will drop 1 collector orb at center next tick.';
  };
  window.setTimer = (mmss) => {
    const match = /^([0-9]{1,2}):([0-5][0-9])$/.exec(mmss);
    if (!match) return 'Format: setTimer("mm:ss")';
    let min = parseInt(match[1], 10), sec = parseInt(match[2], 10);
    let total = min * 60 + sec;
    if (total < 0) total = 0;
    if (total > 1170) total = 1170;
    localStorage.setItem('timer', String(total));
    // Live update if in-game
    if (window.game && window.game.scene && window.game.scene.isActive('Game')) {
      const scene = window.game.scene.getScene('Game');
      if (scene) {
        scene.elapsedTime = total;
        if (scene.hud && scene.hud.update) scene.hud.update();
      }
    }
    return `Timer set to ${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
  };
  window.addMinutes = (minutes) => {
    let current = parseInt(localStorage.getItem('timer') || '0', 10);
    let total = current + minutes * 60;
    if (total < 0) total = 0;
    if (total > 1170) total = 1170;
    localStorage.setItem('timer', String(total));
    return `Timer set to ${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
  };
}

function getLandscapeSize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Always use landscape
  return w > h ? { width: w, height: h } : { width: h, height: w };
}

function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

// Expose isMobile globally for scenes
if (typeof window !== 'undefined') window.isMobile = isMobile;

function createGame() {
  let { width, height } = getLandscapeSize();
  // Zoom out for mobile
  if (isMobile()) {
    width = Math.round(width * 2.1);
    height = Math.round(height * 2.1);
  }
  const config = {
    type: Phaser.AUTO,
    width,
    height,
    backgroundColor: '#111111',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, MenuScene, GameScene, UpgradeScene, GameOverScene, PauseMenuScene, ShopScene],
  };
  return new Phaser.Game(config);
}

let game = createGame();
if (typeof window !== 'undefined') window.game = game;

// Phaser RESIZE mode handles resizing automatically, but force a resize event for safety
window.addEventListener('resize', () => {
  if (game && game.scale) {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }
});
