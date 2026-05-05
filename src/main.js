import Phaser from 'phaser';
import { GAME } from './config/constants.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import UpgradeScene from './scenes/UpgradeScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import PauseMenuScene from './scenes/PauseMenuScene.js';

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
    scene: [BootScene, MenuScene, GameScene, UpgradeScene, GameOverScene, PauseMenuScene],
  };
  return new Phaser.Game(config);
}

let game = createGame();
if (typeof window !== 'undefined') window.__game = game;

// Phaser RESIZE mode handles resizing automatically, but force a resize event for safety
window.addEventListener('resize', () => {
  if (game && game.scale) {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }
});
