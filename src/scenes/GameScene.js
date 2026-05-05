import Phaser from 'phaser';
import { GAME, XP_SCALING, LOOT, XP } from '../config/constants.js';
import BlueGem from '../entities/BlueGem.js';
import VioletGem from '../entities/VioletGem.js';
import Player from '../entities/Player.js';
import WaveSpawner from '../systems/WaveSpawner.js';
import XPSystem from '../systems/XPSystem.js';
import HUD from '../ui/HUD.js';
import CollectionOrb from '../entities/CollectionOrb.js';
import HealingOrb from '../entities/HealingOrb.js';
import Coin from '../entities/Coin.js';
import FusionSystem from '../systems/FusionSystem.js';

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
    this.isPaused = true;
    this.physics.pause();
    this.scene.launch('PauseMenu', { gameScene: this });
    if (this.fusionSystem && this.fusionSystem.timer) {
      this.fusionSystem.timer.paused = true;
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
    this.blueGems = this.physics.add.group();
    this.violetGems = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.healingOrbsGroup = this.physics.add.group();
    this.coinsGroup = this.physics.add.group();
    this.collectionOrbsGroup = this.physics.add.group();

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
    this.fusionSystem = new FusionSystem(this);
    this.weapons = [];

    // Start with dagger (basic attack)
    this.addWeapon('Dagger');

    // Game state
    this.kills = 0;
    this.elapsedTime = 0;
    this.coinsCollected = 0;
    this.isGameOver = false;
    this.isPaused = false;

    // Collisions
    this.physics.add.overlap(this.player.sprite, this.enemies, this.onPlayerHitEnemy, null, this);
    this.physics.add.overlap(this.player.sprite, this.gems, this.onPlayerCollectGem, null, this);
    this.physics.add.overlap(this.player.sprite, this.blueGems, this.onPlayerCollectBlueGem, null, this);
    this.physics.add.overlap(this.player.sprite, this.violetGems, this.onPlayerCollectVioletGem, null, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.onProjectileHitEnemy, null, this);
    this.physics.add.overlap(this.player.sprite, this.healingOrbsGroup, this.onPlayerCollectHealing, null, this);
    this.physics.add.overlap(this.player.sprite, this.coinsGroup, this.onPlayerCollectCoin, null, this);
    this.physics.add.overlap(this.player.sprite, this.collectionOrbsGroup, this.onPlayerCollectCollection, null, this);

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

    // Level-up queue: buffer simultaneous level-ups and show them one at a time
    this.pendingLevelUps = 0;
    this.events.on('levelup', () => {
      if (this.isPaused) {
        this.pendingLevelUps++;
      } else {
        this.isPaused = true;
        this.physics.pause();
        this.scene.launch('Upgrade', { gameScene: this });
      }
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
    if (this.pendingLevelUps > 0) {
      this.pendingLevelUps--;
      this.scene.launch('Upgrade', { gameScene: this });
    } else {
      this.isPaused = false;
      this.physics.resume();
    }
  }

  getXPMultiplier() {
    const milestones = XP_SCALING.MILESTONES;
    let multiplier = 1.0;
    for (const milestone of milestones) {
      if (this.elapsedTime >= milestone.time) {
        multiplier = milestone.multiplier;
      }
    }
    return multiplier;
  }

  update(time, delta) {
    if (this.isGameOver || this.isPaused) return;

    // === DEBUG: SPAWN ORBS FROM LOCALSTORAGE ===
    // Drop exp orbs
    const expCount = parseInt(localStorage.getItem('dropExp') || '0', 10);
    if (expCount > 0) {
      for (let i = 0; i < expCount; i++) {
        const gem = this.gems.create(100, 100, 'gem');
        gem.setData('value', 1);
        gem.body.setAllowGravity(false);
        gem.setDepth(1);
      }
      localStorage.removeItem('dropExp');
    }
    // Drop health orbs
    const healthCount = parseInt(localStorage.getItem('dropHealth') || '0', 10);
    if (healthCount > 0) {
      for (let i = 0; i < healthCount; i++) {
        new HealingOrb(this, 100, 100);
      }
      localStorage.removeItem('dropHealth');
    }
    // Drop collector orb
    if (localStorage.getItem('dropCollector')) {
      new CollectionOrb(this, 100, 100);
      localStorage.removeItem('dropCollector');
    }

    this.player.update(delta);
    this.waveSpawner.update(time, delta);

    for (const weapon of this.weapons) {
      weapon.update(time, delta);
    }

    // Gem + Coin magnet (but NOT healing orbs)
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

    [...this.coinsGroup.getChildren()].forEach(coin => {
      if (!coin.active) return;
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x, this.player.sprite.y,
        coin.x, coin.y
      );
      const range = this.player.getPickupRange();
      if (dist < range) {
        this.physics.moveToObject(coin, this.player.sprite, 300);
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

  onPlayerCollectHealing(playerSprite, healingOrbSprite) {
    // Call the collect method stored in the sprite data
    const collectFn = healingOrbSprite.getData('collectFn');
    if (collectFn) collectFn();
    healingOrbSprite.destroy();
  }

  onPlayerCollectCoin(playerSprite, coinSprite) {
    // Call the collect method stored in the sprite data
    const collectFn = coinSprite.getData('collectFn');
    if (collectFn) collectFn();
    coinSprite.destroy();
  }

  onPlayerCollectCollection(playerSprite, collectionOrbSprite) {
    // Call the collect method stored in the sprite data
    const collectFn = collectionOrbSprite.getData('collectFn');
    if (collectFn) collectFn();
    collectionOrbSprite.destroy();
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
    const multiplier = this.getXPMultiplier();
    const minutesPassed = this.elapsedTime / 60;
    // Drop order: violet → blue → green
    let dropped = false;
    // Violet chance
    let chance = XP.VIOLET_CHANCE_BASE + XP.VIOLET_CHANCE_PER_MIN * minutesPassed;
    chance = Math.max(0, Math.min(XP.VIOLET_CHANCE_MAX, chance));
    if (Math.random() < chance) {
      const violet = new VioletGem(this, enemySprite.x, enemySprite.y, XP.VIOLET_VALUE_MULT * multiplier);
      this.violetGems.add(violet);
      dropped = true;
    }
    // Blue chance (only if violet not dropped)
    if (!dropped) {
      let blueChance = XP.BLUE_CHANCE_BASE + XP.BLUE_CHANCE_PER_MIN * minutesPassed;
      blueChance = Math.max(0, Math.min(XP.BLUE_CHANCE_MAX, blueChance));
      if (Math.random() < blueChance) {
        const blue = new BlueGem(this, enemySprite.x, enemySprite.y, XP.BLUE_VALUE_MULT * multiplier);
        this.blueGems.add(blue);
        dropped = true;
      }
    }
    // Green fallback
    if (!dropped) {
      const gem = this.gems.create(enemySprite.x, enemySprite.y, 'gem');
      gem.setData('value', multiplier);
      gem.body.setAllowGravity(false);
      gem.setDepth(1);
    }

    // Random drop chances (alongside the XP orb)
    const randCollection = Math.random();
    if (randCollection < LOOT.COLLECTION_ORB.CHANCE) {
      new CollectionOrb(this, enemySprite.x, enemySprite.y);
    }

    const randHealing = Math.random();
    if (randHealing < LOOT.HEALING_ORB.CHANCE) {
      new HealingOrb(this, enemySprite.x, enemySprite.y);
    }

    const randCoin = Math.random();
    const coinChance = LOOT.COIN.BASE_CHANCE + (minutesPassed / 3) * LOOT.COIN.BASE_CHANCE;
    if (randCoin < coinChance) {
      new Coin(this, enemySprite.x, enemySprite.y);
    }

    enemySprite.destroy();
  }
  onPlayerCollectBlueGem(playerSprite, blueGem) {
    const value = blueGem.value || blueGem.getData('value') || 3;
    this.xpSystem.addXP(value);
    blueGem.destroy();
  }

  onPlayerCollectVioletGem(playerSprite, violetGem) {
    const value = violetGem.value || violetGem.getData('value') || 9;
    this.xpSystem.addXP(value);
    violetGem.destroy();
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
