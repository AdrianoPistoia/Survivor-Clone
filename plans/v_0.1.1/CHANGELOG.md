# Changelog - v0.1.1

## Version 0.1.1 - Major Mechanics Expansion

### Release Date
May 5, 2026

### Overview
Significant gameplay expansion with extended duration, progressive difficulty, diverse loot system, pause menu, basic attack overhaul, and infinite stat progression.

---

## New Features

### 1. Extended Game Duration (20 minutes)
- Game length increased from 10 to 20 minutes
- Allows for deeper progression and strategy
- **Implementation**: `GAME.DURATION = 1200` seconds
- **Files**: `src/config/constants.js`

### 2. Progressive XP Scaling
- XP gem value increases at 3 time milestones
- **Milestone 1** (5 min): 1.5x multiplier
- **Milestone 2** (12.5 min): 2.0x multiplier
- **Milestone 3** (17 min): 2.5x multiplier
- **Purpose**: Maintains challenge curve as game progresses
- **Files**: `src/config/constants.js`, `src/scenes/GameScene.js`

### 3. Collection Orbs
- Spawns with 1% drop chance per enemy kill
- Magnets all nearby XP orbs toward player with animation
- Provides quality-of-life enhancement
- **Implementation**: `src/entities/CollectionOrb.js`
- **Files**: `src/scenes/GameScene.js`

### 4. Healing Orbs
- Spawns with 5% drop chance per enemy kill
- Heals player 1-5% of max HP on pickup
- Provides survival mechanic
- **Implementation**: `src/entities/HealingOrb.js`
- **Files**: `src/scenes/GameScene.js`

### 5. Coin Currency
- Spawns with 2% base drop chance, scales with time
- At 3 min: 4%, 6 min: 4%, 9 min: 8%, etc.
- Collected and stored for future shop system
- **Implementation**: `src/entities/Coin.js`
- **Files**: `src/scenes/GameScene.js`

### 6. Pause Menu System
- Triggered via ESC key (desktop) or 2-finger tap (mobile)
- **Resume Button**: Closes menu and resumes game
- **Settings Button**: Placeholder for v0.1.2 implementation
- **Inventory Button**: Displays 5 weapon and 5 item slots (read-only)
- **Exit Button**: Returns to main menu
- **Implementation**: `src/scenes/PauseMenuScene.js`
- **Files**: `src/scenes/GameScene.js`, `src/main.js`

### 7. Inventory System (Display-Only)
- Tracks 5 active weapon slots and 5 item slots per player
- Accessible via pause menu inventory panel
- Read-only in v0.1.1 (management planned for v0.1.2)
- **Files**: `src/entities/Player.js`

### 8. Basic Attack System (Dagger + Right-Click Aiming)
- Starting weapon changed from Whip to Dagger
- Right-click to aim (desktop) or aim touch (mobile)
- Auto-fires continuously while right-click held
- Projectiles follow cursor direction
- Provides intuitive control scheme
- **Files**: `src/scenes/GameScene.js`, `src/entities/Player.js`, `src/weapons/Dagger.js`

### 9. Fixed Axe Arc Behavior
- Replaced gravity-based physics with parabolic arc
- Axes now follow predictable trajectory (not vertical fall)
- Arc height: 30% of throw distance
- Uses tween-based motion for consistency
- **Files**: `src/weapons/Axe.js`

### 10. Infinite Stat Upgrades
- Stat upgrades (Damage, Speed, HP, Attack Speed, Magnet) can reappear indefinitely
- Allows for unlimited progression
- Weapon upgrades still appear once only
- **Implementation**: `maxLevel: 999` for stat upgrades
- **Files**: `src/config/upgrades.js`

### 11. Shop Button (Placeholder)
- Added Shop button to main menu (below Leaderboard)
- Orange color (#ffaa44) for visual distinction
- Placeholder message: "Shop coming soon in v0.1.2!"
- **Files**: `src/scenes/MenuScene.js`

---

## Modified Features

### Game Duration
- **Previous**: 10 minutes (600 seconds)
- **Current**: 20 minutes (1200 seconds)
- **Impact**: Doubles game length, more time for progression

### Starting Weapon
- **Previous**: Whip
- **Current**: Dagger (basic attack)
- **Impact**: Simplified starting loadout with aiming mechanic

### XP Gem Values
- **Previous**: Always value 1
- **Current**: Multiplied by XP scaling (1.0x to 2.5x)
- **Impact**: Increases late-game progression speed

### Upgrade System
- **Previous**: Stat upgrades capped at level 5
- **Current**: Stat upgrades capped at level 999 (effectively infinite)
- **Impact**: Allows unlimited stat progression

---

## Files Added

```
src/entities/
  ├── CollectionOrb.js       (NEW)
  ├── HealingOrb.js          (NEW)
  └── Coin.js                (NEW)

src/scenes/
  └── PauseMenuScene.js      (NEW)
```

---

## Files Modified

```
src/
  ├── config/
  │   ├── constants.js       (MODIFIED: duration, XP scaling, loot config)
  │   └── upgrades.js        (MODIFIED: stat upgrade max levels)
  ├── entities/
  │   └── Player.js          (MODIFIED: inventory, aiming system)
  ├── weapons/
  │   ├── Dagger.js          (MODIFIED: aim direction, auto-fire)
  │   └── Axe.js             (MODIFIED: parabolic arc)
  ├── scenes/
  │   ├── GameScene.js       (MODIFIED: duration, drops, pause, start weapon)
  │   └── MenuScene.js       (MODIFIED: shop button)
  └── main.js                (MODIFIED: register PauseMenuScene)
```

---

## Technical Details

### Configuration Changes
- `GAME.DURATION`: 600 → 1200
- `XP_SCALING` (NEW): Milestone-based multipliers
- `LOOT` (NEW): Drop chance and parameter configuration
- Upgrade `maxLevel`: 5 → 999 (stat upgrades only)

### API Changes
- `GameScene.getXPMultiplier()` (NEW): Returns current XP multiplier
- `Player.updateAimDirection(pointer)` (NEW): Updates aim vector
- `Dagger.update()` (MODIFIED): Custom update for aiming

### Data Structures
- `Player.aimDirection` (NEW): Vector2 for aiming
- `Player.isAiming` (NEW): Boolean for attack control
- `Player.weaponSlots` (NEW): Array[5] for inventory
- `Player.itemSlots` (NEW): Array[5] for inventory
- `GameScene.coinsCollected` (NEW): Total coins collected
- `GameScene.healingOrbs` (NEW): Array of active healing orbs
- `GameScene.coins` (NEW): Array of active coins

---

## Balance Changes

### Difficulty Curve
- Extended game length allows more progressive difficulty
- XP scaling maintains challenge as game lengthens
- Loot drops provide strategic options for survival

### Progression
- Stat upgrades can now level indefinitely
- No artificial caps on player growth
- Weapons remain one-time acquisitions (balanced)

### Survival Mechanics
- Healing orbs add resource gathering element
- Collection orbs reduce tedium of item collection
- Coins introduce economy system (future use)

---

## Breaking Changes
None. All changes are backward compatible.

---

## Known Issues & Limitations

### v0.1.1 Limitations
- Settings menu is placeholder (empty)
- Inventory is read-only (no drag-and-drop)
- Coins collected but not spent (no shop yet)
- Right-click aiming requires desktop mouse (mobile needs alternative)
- Collection Orb animation limited to visible range

### Platform-Specific Notes
- **Desktop**: Right-click for aiming (context menu suppressed on canvas)
- **Mobile**: 2-finger tap for pause menu (right-click not applicable)
- **Mobile**: Right-click aiming not implemented (planned alternative for v0.1.2)

---

## Testing Recommendations

### Manual Testing
1. Play full 20-minute game
2. Verify XP scaling at 5min, 12.5min, 17min marks
3. Confirm drop rates (1% collection, 5% healing, 2% coin base)
4. Test pause menu (all 4 buttons)
5. Verify dagger aiming and firing
6. Test axe arc trajectory
7. Level up 5+ times for stat upgrade re-offering

### Automated Testing
- Unit tests for XP multiplier calculation
- Drop chance probability tests
- Pause/resume state management tests

---

## Performance Impact

- **Positive**: Axe now uses tweens (more predictable than physics)
- **Neutral**: New entities (CollectionOrb, HealingOrb, Coin) minimal overhead
- **Neutral**: Pause menu only active during pause (no runtime impact)
- **Result**: Net performance improvement vs. old gravity-based physics

---

## Future Roadmap

### v0.1.2 (Planned)
- [ ] Implement Shop system (coin spending)
- [ ] Inventory drag-and-drop management
- [ ] Settings menu (volume, graphics toggles)
- [ ] Mobile touch aiming alternative
- [ ] Particle effects for loot drops

### v0.2.0 (Planned)
- [ ] New weapon types
- [ ] Boss enemies
- [ ] Leaderboard integration
- [ ] Unlockable characters
- [ ] Achievements system

---

## Contributors
- Development: v0.1.1 implementation team
- Design: Game balance and feature specification
- QA: Testing and validation

---

## Notes for Developers

### Accessing New Features Programmatically

```javascript
// XP Multiplier
const multiplier = gameScene.getXPMultiplier();

// Aiming Status
if (player.isAiming) {
  const direction = player.aimDirection;
}

// Inventory
const weapons = player.weaponSlots;
const items = player.itemSlots;

// Coins
const totalCoins = gameScene.coinsCollected;
```

### Extending Features for v0.1.2

```javascript
// To implement shop:
// 1. Check gameScene.coinsCollected
// 2. Implement coin spending
// 3. Update player inventory accordingly

// To implement inventory management:
// 1. Listen to drop/drag events in InventoryPanel
// 2. Update player.weaponSlots array
// 3. Trigger re-render of panel

// To implement settings:
// 1. Create SettingsPanel component
// 2. Bind to audio/graphics toggles
// 3. Store preferences in localStorage
```

---

## Support & Documentation

- **Implementation Plan**: `plans/v_0.1.1/IMPLEMENTATION_PLAN.md`
- **Quick Reference**: `plans/v_0.1.1/QUICK_REFERENCE.md`
- **Completion Summary**: `plans/v_0.1.1/COMPLETION_SUMMARY.md`
- **Changelog**: `plans/v_0.1.1/CHANGELOG.md` (this file)

