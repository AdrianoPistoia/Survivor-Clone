import { UPGRADES } from './constants.js';

const UPGRADE_DEFS = [
  {
    id: 'damage',
    name: 'Damage Up',
    description: 'Increase all weapon damage by 20%',
    icon: 'upgrade_damage',
    maxLevel: 999, // Can reappear indefinitely
    apply(player, level) {
      player.damageMultiplier = 1 + UPGRADES.DAMAGE_MULT * level;
    },
  },
  {
    id: 'attack_speed',
    name: 'Attack Speed',
    description: 'Reduce weapon cooldowns by 10%',
    icon: 'upgrade_speed',
    maxLevel: 999, // Can reappear indefinitely
    apply(player, level) {
      player.cooldownMultiplier = 1 - UPGRADES.COOLDOWN_MULT * level;
    },
  },
  {
    id: 'move_speed',
    name: 'Move Speed',
    description: 'Increase movement speed by 15%',
    icon: 'upgrade_move',
    maxLevel: 999, // Can reappear indefinitely
    apply(player, level) {
      player.speedMultiplier = 1 + UPGRADES.SPEED_MULT * level;
    },
  },
  {
    id: 'max_hp',
    name: 'Max HP',
    description: `+${UPGRADES.HP_BONUS} max HP and heal`,
    icon: 'upgrade_hp',
    maxLevel: 999, // Can reappear indefinitely
    apply(player, level) {
      player.bonusHP = UPGRADES.HP_BONUS * level;
      player.hp = player.getMaxHP();
    },
  },
  {
    id: 'pickup_range',
    name: 'Magnet',
    description: `+${UPGRADES.PICKUP_BONUS} gem pickup range`,
    icon: 'upgrade_magnet',
    maxLevel: 999, // Can reappear indefinitely
    apply(player, level) {
      player.bonusPickupRange = UPGRADES.PICKUP_BONUS * level;
    },
  },
  {
    id: 'weapon_whip',
    name: 'Whip',
    description: 'Melee attack in front of you',
    icon: 'upgrade_whip',
    maxLevel: 1,
    isWeapon: true,
    weaponType: 'Whip',
  },
  {
    id: 'weapon_missile',
    name: 'Magic Missile',
    description: 'Homing projectile towards nearest enemy',
    icon: 'upgrade_missile',
    maxLevel: 1,
    isWeapon: true,
    weaponType: 'MagicMissile',
  },
  {
    id: 'weapon_aura',
    name: 'Aura',
    description: 'Deals damage around you continuously',
    icon: 'upgrade_aura',
    maxLevel: 1,
    isWeapon: true,
    weaponType: 'Aura',
  },
  {
    id: 'weapon_dagger',
    name: 'Dagger',
    description: 'Fast projectiles in your movement direction',
    icon: 'upgrade_dagger',
    maxLevel: 1,
    isWeapon: true,
    weaponType: 'Dagger',
  },
  {
    id: 'weapon_axe',
    name: 'Axe',
    description: 'High-damage arc throw toward nearest enemy',
    icon: 'upgrade_axe',
    maxLevel: 1,
    isWeapon: true,
    weaponType: 'Axe',
  },
  {
    id: 'weapon_bible',
    name: 'King Bible',
    description: 'Books orbit around you, damaging on contact',
    icon: 'upgrade_bible',
    maxLevel: 1,
    isWeapon: true,
    weaponType: 'Bible',
  },
  {
    id: 'weapon_lightning',
    name: 'Lightning',
    description: 'Strikes nearest enemy and chains to 2 more',
    icon: 'upgrade_lightning',
    maxLevel: 1,
    isWeapon: true,
    weaponType: 'Lightning',
  },
  {
    id: 'weapon_holywater',
    name: 'Holy Water',
    description: 'Throws a flask that burns enemies for 3 seconds',
    icon: 'upgrade_holywater',
    maxLevel: 1,
    isWeapon: true,
    weaponType: 'HolyWater',
  },
];

export default UPGRADE_DEFS;
