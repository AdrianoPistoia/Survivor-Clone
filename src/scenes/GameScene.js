import Phaser from 'phaser';
import { GAME } from '../config/constants.js';
import Player from '../entities/Player.js';
import WaveSpawner from '../systems/WaveSpawner.js';
import XPSystem from '../systems/XPSystem.js';
import HUD from '../ui/HUD.js';

import Whip from '../weapons/Whip.js';
import MagicMissile from '../weapons/MagicMissile.js';
import Aura from '../weapons/Aura.js';
import Dagger from '../weapons/Dagger.js';
import Axe from '../weapons/Axe.js';
import Bible from '../weapons/Bible.js';
import Lightning from '../weapons/Lightning.js';
import HolyWater from '../weapons/HolyWater.js';
import FireWand from '../weapons/FireWand.js';
import Cross from '../weapons/Cross.js';

const WEAPON_CLASSES = { Whip, MagicMissile, Aura, Dagger, Axe, Bible, Lightning, HolyWater, FireWand, Cross };

export default class GameScene extends Phaser.Scene {
    togglePause() {
      if (this.isGameOver) return;
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.physics.pause();
        // Optionally, show a pause overlay here
      } else {
        this.physics.resume();
        // Optionally, hide pause overlay here
      }
    }
  constructor() {
    super('Game');
  }

  create() {
    // Arena floor
    for (let x = 0; x < GAME.ARENA_WIDTH; x += 64) {
      for (let y = 0; y < GAME.ARENA_HEIGHT; y += 64) {
        this.add.image(x + 32, y + 32, 'tile');
      }
    }

    // Arena border
    const border = this.add.graphics();
    border.lineStyle(4, 0xff4444, 0.8);
    border.strokeRect(0, 0, GAME.ARENA_WIDTH, GAME.ARENA_HEIGHT);

    // Physics world bounds
    this.physics.world.setBounds(0, 0, GAME.ARENA_WIDTH, GAME.ARENA_HEIGHT);

    // Groups
    this.enemies = this.physics.add.group();
    this.gems = this.physics.add.group();
    this.projectiles = this.physics.add.group();

    // Player
    this.player = new Player(this, GAME.ARENA_WIDTH / 2, GAME.ARENA_HEIGHT / 2);

    // Camera
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, GAME.ARENA_WIDTH, GAME.ARENA_HEIGHT);
    // True zoom-out for mobile (self-contained detection)
    if (typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)) {
      this.cameras.main.setZoom(1 / 2.1);
    }

    // Systems
    this.waveSpawner = new WaveSpawner(this);
    this.xpSystem = new XPSystem(this);
    this.weapons = [];

    // Start with whip
    this.addWeapon('Whip');

    // Game state
    this.kills = 0;
    this.elapsedTime = 0;
    this.isGameOver = false;
    this.isPaused = false;

    // Collisions
    this.physics.add.overlap(this.player.sprite, this.enemies, this.onPlayerHitEnemy, null, this);
    this.physics.add.overlap(this.player.sprite, this.gems, this.onPlayerCollectGem, null, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.onProjectileHitEnemy, null, this);

    // HUD (UI camera)
    this.hud = new HUD(this);

    // Timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.isPaused) {
          this.elapsedTime++;
          if (this.elapsedTime >= GAME.DURATION) {
            this.victory();
          }
        }
      },
      loop: true,
    });

    // Listen for level up
    this.events.on('levelup', () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.launch('Upgrade', { gameScene: this });
    });

    // 2-finger tap pause for mobile (use pointer.event.touches)
    if (typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)) {
      this.input.on('pointerdown', (pointer) => {
        if (pointer.event && pointer.event.touches && pointer.event.touches.length === 2) {
          this.togglePause();
        }
      });
    } else {
      // ESC key pause for desktop
      this.input.keyboard.on('keydown-ESC', () => {
        this.togglePause();
      });
    }
  }

  addWeapon(type) {
    const WeaponClass = WEAPON_CLASSES[type];
    if (WeaponClass && !this.weapons.find(w => w.constructor === WeaponClass)) {
      const weapon = new WeaponClass(this);
      this.weapons.push(weapon);
    }
  }

  resumeFromUpgrade() {
    this.isPaused = false;
    this.physics.resume();
  }

  update(time, delta) {
    if (this.isGameOver || this.isPaused) return;

    this.player.update(delta);
    this.waveSpawner.update(time, delta);

    for (const weapon of this.weapons) {
      weapon.update(time, delta);
    }

    // Gem magnet
    [...this.gems.getChildren()].forEach(gem => {
      if (!gem.active) return;
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x, this.player.sprite.y,
        gem.x, gem.y
      );
      const range = this.player.getPickupRange();
      if (dist < range) {
        this.physics.moveToObject(gem, this.player.sprite, 300);
      }
    });

    this.hud.update();
  }

  onPlayerHitEnemy(playerSprite, enemySprite) {
    if (this.player.isInvulnerable) return;
    this.player.takeDamage(enemySprite.getData('damage') || 10);
    if (this.player.hp <= 0) {
      this.gameOver();
    }
  }

  onPlayerCollectGem(playerSprite, gem) {
    const value = gem.getData('value') || 1;
    this.xpSystem.addXP(value);
    gem.destroy();
  }

  onProjectileHitEnemy(projectile, enemySprite) {
    const damage = projectile.getData('damage') || 10;
    const pierce = projectile.getData('pierce') || 0;
    const currentHP = enemySprite.getData('hp') - damage;
    enemySprite.setData('hp', currentHP);

    // Flash white
    enemySprite.setTintFill(0xffffff);
    this.time.delayedCall(60, () => {
      if (enemySprite.active) enemySprite.clearTint();
    });

    if (currentHP <= 0) {
      this.killEnemy(enemySprite);
    }

    if (pierce <= 0) {
      projectile.destroy();
    } else {
      projectile.setData('pierce', pierce - 1);
    }
  }

  killEnemy(enemySprite) {
    this.kills++;
    // Spawn gem at enemy position
    const gem = this.gems.create(enemySprite.x, enemySprite.y, 'gem');
    gem.setData('value', 1);
    gem.body.setAllowGravity(false);
    gem.setDepth(1);
    enemySprite.destroy();
  }

  gameOver() {
    this.isGameOver = true;
    this.physics.pause();
    this.gameTimer.remove();
    this.scene.start('GameOver', {
      kills: this.kills,
      time: this.elapsedTime,
      level: this.xpSystem.level,
    });
  }

  victory() {
    this.isGameOver = true;
    this.physics.pause();
    this.gameTimer.remove();
    this.scene.start('GameOver', {
      kills: this.kills,
      time: this.elapsedTime,
      level: this.xpSystem.level,
      victory: true,
    });
  }
}
