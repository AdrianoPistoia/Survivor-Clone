import Phaser from 'phaser';
import { ENEMY, WAVES, GAME } from '../config/constants.js';

export default class WaveSpawner {
  constructor(scene) {
    this.scene = scene;
    this.lastSpawnTime = 0;
  }

  update(time, delta) {
    const elapsed = this.scene.elapsedTime; // seconds
    const minutes = elapsed / 60;

    // Update all enemy velocities to chase the player
    const player = this.scene.player.sprite;
    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return;
      const speed = enemy.getData('speed') || ENEMY.BASE_SPEED;
      this.scene.physics.moveToObject(enemy, player, speed);
    });

    // Difficulty scaling
    const interval = Math.max(
      WAVES.MIN_INTERVAL,
      WAVES.INITIAL_INTERVAL - minutes * 200
    );
    const count = Math.floor(WAVES.INITIAL_COUNT + WAVES.COUNT_GROWTH * minutes * 3);
    const enemySpeed = ENEMY.BASE_SPEED + WAVES.SPEED_GROWTH * minutes;
    const enemyHP = ENEMY.BASE_HP + Math.floor(WAVES.HP_GROWTH * minutes);

    if (time - this.lastSpawnTime < interval) return;
    this.lastSpawnTime = time;

    for (let i = 0; i < count; i++) {
      this.spawnEnemy(enemySpeed, enemyHP);
    }
  }

  spawnEnemy(speed, hp) {
    const player = this.scene.player.sprite;
    const angle = Math.random() * Math.PI * 2;
    const dist = ENEMY.SPAWN_DISTANCE + Math.random() * 100;
    let x = player.x + Math.cos(angle) * dist;
    let y = player.y + Math.sin(angle) * dist;

    // Clamp to arena
    x = Phaser.Math.Clamp(x, 30, GAME.ARENA_WIDTH - 30);
    y = Phaser.Math.Clamp(y, 30, GAME.ARENA_HEIGHT - 30);

    const enemy = this.scene.enemies.create(x, y, 'enemy');
    enemy.setData('hp', hp);
    enemy.setData('maxHp', hp);
    enemy.setData('speed', speed);
    enemy.setData('damage', ENEMY.BASE_DAMAGE);
    enemy.body.setAllowGravity(false);
    enemy.setDepth(5);
  }
}
