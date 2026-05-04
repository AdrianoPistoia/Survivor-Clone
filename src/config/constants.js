// Game balance & config constants
export const GAME = {
  WIDTH: 800,
  HEIGHT: 600,
  ARENA_WIDTH: 2000,
  ARENA_HEIGHT: 2000,
  DURATION: 600, // 10 minutes in seconds
  FIRE_WAND: {
    DAMAGE: 30,
    COOLDOWN: 1200,
    SPEED: 320,
    LIFETIME: 1800,
    COUNT: 1,
  },
  CROSS: {
    DAMAGE: 22,
    COOLDOWN: 1100,
    SPEED: 400,
    LIFETIME: 2000,
    COUNT: 1,
    RETURN: true, // boomerang effect
  },
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
    COOLDOWN: 350,   // very fast
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
};

export const UPGRADES = {
  DAMAGE_MULT: 0.2,    // +20% per level
  SPEED_MULT: 0.15,    // +15% per level
  COOLDOWN_MULT: 0.1,  // -10% cooldown per level
  HP_BONUS: 20,        // +20 max HP per level
  PICKUP_BONUS: 30,    // +30 pickup range per level
  MAX_LEVEL: 5,        // max times each upgrade can be picked
};
