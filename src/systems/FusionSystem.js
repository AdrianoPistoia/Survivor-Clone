import { XP } from '../config/constants.js';
import BlueGem from '../entities/BlueGem.js';
import VioletGem from '../entities/VioletGem.js';

export default class FusionSystem {
  constructor(scene) {
    this.scene = scene;
    this.timer = scene.time.addEvent({
      delay: 2000,
      callback: () => this.scan(),
      loop: true,
    });
  }

  scan() {
    this.scanGroup(this.scene.gems, 'green', BlueGem, 3);
    this.scanGroup(this.scene.blueGems, 'blue', VioletGem, 2);
  }

  scanGroup(group, label, TargetClass, maxMerges) {
    const orbs = group.getChildren().filter(o => o.active);
    const merged = new Set();
    let merges = 0;
    for (let i = 0; i < orbs.length; i++) {
      if (merged.has(orbs[i])) continue;
      // Find neighbors within FUSION_RADIUS
      const neighbors = [orbs[i]];
      for (let j = 0; j < orbs.length && neighbors.length < 3; j++) {
        if (i !== j && !merged.has(orbs[j])) {
          const dist = Phaser.Math.Distance.Between(orbs[i].x, orbs[i].y, orbs[j].x, orbs[j].y);
          if (dist < XP.FUSION_RADIUS) neighbors.push(orbs[j]);
        }
      }
      if (neighbors.length === 3) {
        // Remove 3, spawn 1 at centroid
        const x = (neighbors[0].x + neighbors[1].x + neighbors[2].x) / 3;
        const y = (neighbors[0].y + neighbors[1].y + neighbors[2].y) / 3;
        neighbors.forEach(o => { o.destroy(); merged.add(o); });
        const newOrb = new TargetClass(this.scene, x, y);
        if (label === 'green') {
          this.scene.blueGems.add(newOrb);
        } else if (label === 'blue') {
          this.scene.violetGems.add(newOrb);
        }
        newOrb.setScale(0.3);
        this.scene.tweens.add({
          targets: newOrb,
          scale: 1.0,
          duration: 300,
          ease: 'Back.Out',
        });
        merges++;
        if (merges >= maxMerges) break;
      }
    }
  }
}
