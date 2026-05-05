# v0.1.1 Quick Reference Guide

## What's New in v0.1.1

### 1. 20-Minute Game Duration
- **Setting**: `GAME.DURATION = 1200` (was 600)
- **XP Scaling**: Multipliers at 5min (1.5x), 12.5min (2x), 17min (2.5x)
- **Impact**: Games are now twice as long, allowing more progression

### 2. Loot Drop System
Three new pickup types alongside XP gems:

| Item | Chance | Effect |
|------|--------|--------|
| Collection Orb | 1% | Magnets all nearby XP orbs |
| Healing Orb | 5% | Heals 1-5% max HP |
| Coin | 2% base, scales with time | Currency (unused in v0.1.1) |

### 3. Pause Menu (ESC key)
Access from pause menu:
- **Resume** — Continue game
- **Settings** — Placeholder (coming v0.1.2)
- **Inventory** — View 5 weapon + 5 item slots
- **Exit** — Return to main menu

### 4. Dagger as Basic Attack
- **Starting weapon**: Dagger (was Whip)
- **Control**: Right-click to aim and fire
- **Auto-fire**: Fires continuously while held
- **Direction**: Fires toward cursor/touch position

### 5. Fixed Axe Arc
- **Old behavior**: Fell with gravity (too vertical)
- **New behavior**: Parabolic arc (30% of throw distance)
- **Implementation**: Tween-based motion (not physics-based)

### 6. Infinite Stat Upgrades
- **Stat upgrades** (Damage, Speed, HP, etc.): Can reappear indefinitely
- **Weapon upgrades**: Still appear once only
- **Level cap**: Set to 999 for stat upgrades

### 7. Shop Button
- **Location**: Main menu (below Leaderboard)
- **Functionality**: Placeholder for v0.1.2
- **Color**: Orange (#ffaa44)

---

## Configuration Changes

### constants.js

```javascript
// NEW: Game duration
GAME.DURATION: 1200  // was 600

// NEW: XP scaling milestones
XP_SCALING = {
  MILESTONES: [
    { time: 300, multiplier: 1.5 },   // 5 min
    { time: 750, multiplier: 2.0 },   // 12.5 min
    { time: 1020, multiplier: 2.5 },  // 17 min
  ]
}

// NEW: Loot drop configuration
LOOT = {
  COLLECTION_ORB: { CHANCE: 0.01, MAGNET_RANGE: 800, ANIMATION_DURATION: 500 },
  HEALING_ORB: { CHANCE: 0.05, HEAL_MIN_PERCENT: 0.01, HEAL_MAX_PERCENT: 0.05 },
  COIN: { BASE_CHANCE: 0.02, SCALE_FACTOR: 0.666 }
}
```

### upgrades.js

```javascript
// CHANGED: Stat upgrades can now reappear indefinitely
id: 'damage',
maxLevel: 999  // was UPGRADES.MAX_LEVEL (5)
```

---

## Player Class Changes

```javascript
// NEW: Aiming system
this.aimDirection = new Phaser.Math.Vector2(1, 0);
this.isAiming = false;

// NEW: Inventory
this.weaponSlots = new Array(5).fill(null);
this.itemSlots = new Array(5).fill(null);

// NEW: Method
updateAimDirection(pointer) { ... }
```

---

## Dagger Weapon Changes

```javascript
// CHANGED: Now uses aim direction
const dir = player.isAiming ? player.aimDirection : player.facing;

// CHANGED: Custom update method for right-click control
update(time, delta) {
  if (!this.scene.player.isAiming) return;
  // ... fire logic
}
```

---

## Game Scene Changes

```javascript
// CHANGED: Start weapon
this.addWeapon('Dagger')  // was 'Whip'

// NEW: XP multiplier calculation
getXPMultiplier() { ... }

// CHANGED: Kill enemy generates drops
killEnemy(enemySprite) {
  // ... spawn XP gem
  // ... random collection orb
  // ... random healing orb
  // ... random coin
}

// NEW: Groups for loot tracking
this.healingOrbs = [];
this.coins = [];
```

---

## New Scenes

### PauseMenuScene
Located: `src/scenes/PauseMenuScene.js`
- 4 interactive buttons
- Settings placeholder display
- Inventory panel with weapon/item slots
- Resume/Exit functionality

---

## New Entities

### CollectionOrb
**File**: `src/entities/CollectionOrb.js`
```javascript
const orb = new CollectionOrb(scene, x, y);
// Magnets all nearby XP orbs toward player
// Destroys after animation completes
```

### HealingOrb
**File**: `src/entities/HealingOrb.js`
```javascript
const orb = new HealingOrb(scene, x, y);
orb.collect();  // Heals player 1-5% max HP
```

### Coin
**File**: `src/entities/Coin.js`
```javascript
const coin = new Coin(scene, x, y);
coin.collect();  // Adds to scene.coinsCollected
```

---

## Common Tasks

### Check XP Multiplier at Current Time
```javascript
const multiplier = gameScene.getXPMultiplier();
console.log(`Current XP multiplier: ${multiplier}x`);
```

### Manually Trigger Pause Menu
```javascript
gameScene.togglePause();
```

### Check Player Aiming Status
```javascript
if (gameScene.player.isAiming) {
  const aimDir = gameScene.player.aimDirection;
  console.log(`Aiming towards: ${aimDir.x}, ${aimDir.y}`);
}
```

### Access Collected Coins
```javascript
const totalCoins = gameScene.coinsCollected;
```

### Get Inventory
```javascript
const weapons = gameScene.player.weaponSlots;
const items = gameScene.player.itemSlots;
```

---

## Testing Commands (Console)

```javascript
// Force victory
game.scene.scenes[1].victory();

// Trigger level up
game.scene.scenes[1].events.emit('levelup');

// Set elapsed time
game.scene.scenes[1].elapsedTime = 750;  // 12.5 min

// Get current multiplier
console.log(game.scene.scenes[1].getXPMultiplier());

// Spawn item at player
game.scene.scenes[1].killEnemy(game.scene.scenes[1].enemies.getChildren()[0]);
```

---

## Performance Notes

- Collection Orbs use Phaser tweens (optimized)
- Healing Orbs and Coins use minimal physics overhead
- Pause menu only active during pause (no performance impact during play)
- Axe arc uses tweens instead of physics (more predictable)

---

## Mobile Considerations

- **Right-click aiming**: Needs touch alternative (planned v0.1.2)
- **Pause menu**: Works with 2-finger tap (already implemented)
- **Inventory**: Readable on mobile (auto-scaling UI)

---

## Debugging Checklist

- [ ] Game runs full 20 minutes without crashing
- [ ] XP values increase at correct time milestones
- [ ] Loot drops appear and disappear correctly
- [ ] Pause menu opens/closes without issues
- [ ] Dagger fires in correct direction (follows cursor)
- [ ] Axe follows parabolic arc (not gravity fall)
- [ ] Stat upgrades offer repeatedly
- [ ] Shop button responds to clicks

