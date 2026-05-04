import { XP } from '../config/constants.js';

export default class XPSystem {
  constructor(scene) {
    this.scene = scene;
    this.xp = 0;
    this.level = 1;
    this.xpToNext = XP.BASE_TO_LEVEL;
  }

  addXP(amount) {
    this.xp += amount;

    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      this.xpToNext = Math.floor(XP.BASE_TO_LEVEL * Math.pow(XP.GROWTH_FACTOR, this.level - 1));
      this.scene.events.emit('levelup', this.level);
    }
  }

  getProgress() {
    return this.xp / this.xpToNext;
  }
}
