// Game balance & config constants
export const GAME = {
  WIDTH: 800,
  HEIGHT: 600,
  ARENA_WIDTH: 2000,
  ARENA_HEIGHT: 2000,
  DURATION: 1200, // 20 minutes in seconds
};

export const PLAYER = {
  SPEED: 200,
  MAX_HP: 100,
  SIZE: 24,
  INVULN_TIME: 500,   // ms of invulnerability after hit
  PICKUP_RANGE: 80,   // gem magnet range
};

export const ENEMY = {
  BASE_SPEED: 60,
  BASE_HP: 3,
  BASE_DAMAGE: 10,
  SIZE: 20,
  SPAWN_DISTANCE: 500, // pixels from player (off-screen)
};

export const WAVES = {
  INITIAL_INTERVAL: 2000,  // ms between spawns
  MIN_INTERVAL: 300,
  INITIAL_COUNT: 2,        // enemies per spawn
  COUNT_GROWTH: 0.3,       // extra enemies per minute
  SPEED_GROWTH: 5,         // extra speed per minute
  HP_GROWTH: 1,            // extra HP per minute
};


export const XP = {
  BASE_TO_LEVEL: 10,
  GROWTH_FACTOR: 1.4,  // each level needs 1.4x more XP
  GEM_VALUE: 1,
  BLUE_CHANCE_BASE: -0.05,       // −5%, becomes positive at minute 6
  BLUE_CHANCE_PER_MIN: 0.01,     // +1% per minute
  BLUE_CHANCE_MAX: 0.20,         // cap at 20%
  BLUE_VALUE_MULT: 3,            // blue = 3× green value

  VIOLET_CHANCE_BASE: -0.10,     // −10%, becomes positive at minute 11
  VIOLET_CHANCE_PER_MIN: 0.01,   // +1% per minute
  VIOLET_CHANCE_MAX: 0.10,       // cap at 10%
  VIOLET_VALUE_MULT: 9,          // violet = 9× green value

  FUSION_RADIUS: 50,             // px, proximity for orb fusion
};

export const WEAPONS = {
  WHIP: {
    DAMAGE: 20,
    COOLDOWN: 1200,
    RANGE: 120, // longer whip
    ARC: 40, // narrower line
    KNOCKBACK: 100,
  },
  MAGIC_MISSILE: {
    DAMAGE: 12,
    COOLDOWN: 800,
    SPEED: 350,
    LIFETIME: 2000,
    PIERCE: 1,
  },
  AURA: {
    DAMAGE: 5,
    COOLDOWN: 1000,
    RADIUS: 100,
    TICK_RATE: 500,
  },
  // --- 5 new weapons ---
  DAGGER: {
    DAMAGE: 8,
    COOLDOWN: 950,   // very fast
    SPEED: 500,
    LIFETIME: 1200,
    COUNT: 1,        // projectiles per shot
  },
  AXE: {
    DAMAGE: 40,
    COOLDOWN: 2200,
    SPEED: 280,
    GRAVITY: 600,    // arc trajectory
    LIFETIME: 2500,
    COUNT: 1,        // orbiting axes
  },
  BIBLE: {
    DAMAGE: 15,
    COOLDOWN: 200,   // hitbox tick rate
    ORBIT_RADIUS: 120,
    ORBIT_SPEED: 3,  // radians/second
    COUNT: 3,        // orbiting books
  },
  LIGHTNING: {
    DAMAGE: 25,
    COOLDOWN: 1800,
    CHAIN: 3,        // number of enemies hit
    CHAIN_RANGE: 200,
    DURATION: 150,   // ms the bolt stays visible
  },
  HOLY_WATER: {
    DAMAGE: 10,
    COOLDOWN: 2500,
    SPEED: 300,
    ZONE_RADIUS: 70,
    ZONE_DURATION: 3000, // ms the puddle lasts
    TICK_RATE: 400,
  },
  FIRE_WAND: {
    DAMAGE: 30,
    COOLDOWN: 2800,
    SPEED: 320,
    LIFETIME: 1800,
    COUNT: 1,
    EXPLOSION_RADIUS: 80,
    BURN_TICKS: 5,
    BURN_TICK_RATE: 1000,
    BURN_DAMAGE_PERCENT: 0.15,
  },
  CROSS: {
    DAMAGE: 22,
    COOLDOWN: 1100,
    SPEED: 400,
    LIFETIME: 2000,
    COUNT: 1,
    RETURN: true,
  },
};

export const UPGRADES = {
  DAMAGE_MULT: 0.2,    // +20% per level
  SPEED_MULT: 0.15,    // +15% per level
  COOLDOWN_MULT: 0.1,  // -10% cooldown per level
  HP_BONUS: 20,        // +20 max HP per level
  PICKUP_BONUS: 30,    // +30 pickup range per level
  MAX_LEVEL: 5,        // max times each upgrade can be picked
  MAG_BONUS: 0.25,     // +25% MAG damage per level
  PHY_BONUS: 0.25,     // +25% PHY damage per level
};

// XP Scaling milestones (times in seconds)
export const XP_SCALING = {
  MILESTONES: [
    { time: 300, multiplier: 1.5 },   // 5 minutes
    { time: 750, multiplier: 2.0 },   // 12.5 minutes
    { time: 1020, multiplier: 2.5 },  // 17 minutes
  ],
};

export const REROLL = {
  DEFAULT_MAX: 1,
};

export const SCORE = {
  PER_KILL: 100,
  PER_SECOND: 10,
  PER_LEVEL: 500,
};

export const SILVER_COINS = {
  WIN_RATIO: 0.10,
  LOSE_RATIO: 0.05,
};

export const SHOP = {
  REROLL_COSTS: [10000, 25000, 40000, 55000],
  REROLL_MAX_PURCHASES: 4,
};

// Loot drop chances
export const LOOT = {
  COLLECTION_ORB: {
    CHANCE: 0.015,           // 1.5%
    MAGNET_RANGE: 800,      // pixels
    ANIMATION_DURATION: 500, // ms
  },
  HEALING_ORB: {
    CHANCE: 0.03,           // 3%
    HEAL_MIN_PERCENT: 0.01, // 1% of max HP
    HEAL_MAX_PERCENT: 0.05, // 5% of max HP
  },
  COIN: {
    BASE_CHANCE: 0.04,      // 4%
    SCALE_FACTOR: 0.666,    // increases every 3 minutes
  },
};
