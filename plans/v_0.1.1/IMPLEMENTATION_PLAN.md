# v0.1.1 Implementation Plan: Game Mechanics Expansion

**Release Date**: v0.1.1  
**Scope**: 10 major features  
**Estimated Duration**: 13 hours

---

## Overview

This release extends core game mechanics with a 20-minute game loop, progressive XP scaling, a comprehensive loot system, pause menu, and inventory tracking. Weapons and upgrades are rebalanced to support the extended gameplay.

---

## Feature Breakdown

### 1. Extended Game Duration
- **Current**: 10 minutes (600 seconds)
- **Target**: 20 minutes (1200 seconds)
- **Impact**: Enemies scale longer; more progression opportunities
- **Files Modified**: `src/config/constants.js`

### 2. Progressive XP Scaling
- **Milestone 1**: 5 minutes → 1.5x XP multiplier
- **Milestone 2**: 12.5 minutes → 2x XP multiplier
- **Milestone 3**: 17 minutes → 2.5x XP multiplier
- **Details**: XP gems automatically scale based on elapsed time
- **Files Modified**: `src/config/constants.js`, `src/scenes/GameScene.js`

### 3. Collection Orbs (Magnetic XP)
- **Drop Chance**: 1% per monster kill
- **Effect**: Magnets all existing XP orbs on screen with homing animation
- **No XP Bonus**: Just convenience mechanic
- **Files Created**: `src/entities/CollectionOrb.js`
- **Files Modified**: `src/scenes/GameScene.js`

### 4. Healing Orbs
- **Drop Chance**: 5% per monster kill
- **Healing Amount**: 1-5% of player max HP
- **Visual**: Distinct color (green/cyan)
- **Files Created**: `src/entities/HealingOrb.js`
- **Files Modified**: `src/scenes/GameScene.js`

### 5. Coin Drops
- **Base Chance**: 2%
- **Scaling**: Increases by `base × 2 × (minutes_passed / 3)`
- **Formula**: At 3 min: 2% × 2 = 4%, at 6 min: 2% × 2 = 4%, at 9 min: 2% × 4 = 8%, etc.
- **Visual**: Silver/gold coins
- **Future Use**: Shop system (v0.1.2)
- **Files Created**: `src/entities/Coin.js`
- **Files Modified**: `src/scenes/GameScene.js`

### 6. Pause Menu System
- **Trigger**: ESC key (desktop) or 2-finger tap (mobile)
- **Menu Items**:
  - **Resume**: Closes menu, resumes game
  - **Settings**: Empty placeholder (Coming Soon)
  - **Inventory**: Displays player inventory (5 weapons, 5 items)
  - **Exit**: Returns to main menu
- **Visual**: Centered overlay with semi-transparent background
- **Files Created**: `src/scenes/PauseMenuScene.js`
- **Files Modified**: `src/scenes/GameScene.js`, `src/main.js`

### 7. Inventory System (Display-Only)
- **Capacity**: 5 weapons + 5 items (slots)
- **Functionality**: Read-only display in v0.1.1
- **Future**: Drag-and-drop management in v0.1.2
- **Display**: Shows equipped weapons and empty item slots
- **Files Created**: `src/ui/InventoryPanel.js`
- **Files Modified**: `src/entities/Player.js`, `src/scenes/PauseMenuScene.js`

### 8. Shop Button (Placeholder)
- **Location**: Main menu, below Leaderboard button
- **Functionality**: Placeholder (logs "Shop coming soon")
- **Future**: Implement coin spending in v0.1.2
- **Files Modified**: `src/scenes/MenuScene.js`

### 9. Basic Attack System (Dagger with Right-Click Aiming)
- **Starting Weapon**: Dagger (replaces Whip)
- **Control Method**: Right-click to aim, fires while held (auto-fire)
- **Direction**: Fires toward cursor/touch position
- **Visual Feedback**: Aiming reticle or directional indicator
- **Files Modified**: `src/entities/Player.js`, `src/weapons/Dagger.js`, `src/scenes/GameScene.js`

### 10. Axe Arc Fix
- **Current Behavior**: Falls with gravity (too vertical)
- **Target Behavior**: Arcs away from player consistently
- **Arc Distance**: Max 1/3 of player radius (~8 pixels from throw point)
- **Implementation**: Parabolic arc formula instead of gravity simulation
- **Files Modified**: `src/weapons/Axe.js`

### 11. Upgrade System Adjustments
- **Stat Upgrades**: Can reappear infinitely in level-up menu
- **Weapons**: Appear once only (already working, verified)
- **Files Verified**: `src/scenes/UpgradeScene.js`, `src/config/upgrades.js`

---

## Implementation Phases

### Phase 1: Game Duration & XP Scaling (2 hours)
**Priority**: Critical | **Blocking**: Phases 2-3

1. Update `GAME.DURATION` to 1200
2. Add `XP.SCALING_MILESTONES` configuration
3. Implement scaling logic in GameScene
4. Test: Verify 20-minute game, XP scaling at correct times

**Files**:
- Modify: `src/config/constants.js`
- Modify: `src/scenes/GameScene.js`

---

### Phase 2: Loot System (Drop Mechanics) (3 hours)
**Priority**: High | **Blocking**: Phase 2.5

1. Create `CollectionOrb.js` entity with magnet animation
2. Create `HealingOrb.js` entity with healing logic
3. Create `Coin.js` entity with time-based value
4. Add drop chance configuration to constants
5. Update `killEnemy()` to generate drops
6. Add collision handlers for new orbs
7. Test: Verify drop rates and timing

**Files**:
- Create: `src/entities/CollectionOrb.js`
- Create: `src/entities/HealingOrb.js`
- Create: `src/entities/Coin.js`
- Modify: `src/config/constants.js`
- Modify: `src/scenes/GameScene.js`

---

### Phase 3: Pause Menu UI (2.5 hours)
**Priority**: High | **Blocking**: Phase 4

1. Create `PauseMenuScene.js` with 4 buttons
2. Implement Resume functionality (close menu, resume game)
3. Implement Settings button (placeholder)
4. Implement Inventory button (call InventoryPanel)
5. Implement Exit button (return to menu)
6. Update GameScene `togglePause()` to launch menu
7. Register scene in main.js
8. Test: Verify all buttons work, ESC opens/closes correctly

**Files**:
- Create: `src/scenes/PauseMenuScene.js`
- Modify: `src/scenes/GameScene.js`
- Modify: `src/main.js`

---

### Phase 4: Inventory System (1.5 hours)
**Priority**: Medium | **Blocking**: None

1. Add inventory tracking to Player class
2. Create `InventoryPanel.js` UI component
3. Display 5 weapons and 5 items slots
4. Integrate with PauseMenuScene
5. Test: Verify inventory displays correctly in pause menu

**Files**:
- Create: `src/ui/InventoryPanel.js`
- Modify: `src/entities/Player.js`
- Modify: `src/scenes/PauseMenuScene.js`

---

### Phase 5: Weapon Overhaul (3 hours)
**Priority**: Critical | **Blocking**: None (parallel with other phases)

1. Update GameScene to start with Dagger instead of Whip
2. Add right-click input tracking to Player
3. Implement aim direction calculation in Player
4. Update Dagger to use aim direction
5. Implement auto-fire while right-click held
6. Fix Axe arc behavior (parabolic instead of gravity)
7. Test: Verify dagger aiming, firing, and axe arc

**Files**:
- Modify: `src/scenes/GameScene.js`
- Modify: `src/entities/Player.js`
- Modify: `src/weapons/Dagger.js`
- Modify: `src/weapons/Axe.js`

---

### Phase 6: Upgrade System Verification (1 hour)
**Priority**: Low | **Blocking**: None

1. Verify stat upgrades can reappear indefinitely
2. Confirm weapon upgrades only appear once
3. Test level-up menu with multiple stat offers
4. Test: Verify behavior with 5+ level-ups

**Files**:
- Verify: `src/scenes/UpgradeScene.js`
- Verify: `src/config/upgrades.js`

---

### Phase 7: Menu System Enhancement (1 hour)
**Priority**: Low | **Blocking**: None

1. Add Shop button to MenuScene (below Leaderboard)
2. Implement placeholder click handler
3. Style consistently with other buttons
4. Test: Verify button visibility and clickability

**Files**:
- Modify: `src/scenes/MenuScene.js`

---

## Configuration Constants to Add

### In `src/config/constants.js`:

```javascript
// XP Scaling milestones (times in seconds)
export const XP_SCALING = {
  MILESTONES: [
    { time: 300, multiplier: 1.5 },   // 5 minutes
    { time: 750, multiplier: 2.0 },   // 12.5 minutes
    { time: 1020, multiplier: 2.5 },  // 17 minutes
  ],
};

// Loot drop chances
export const LOOT = {
  COLLECTION_ORB: {
    CHANCE: 0.01,           // 1%
    MAGNET_RANGE: 800,      // pixels
    ANIMATION_DURATION: 500, // ms
  },
  HEALING_ORB: {
    CHANCE: 0.05,           // 5%
    HEAL_MIN_PERCENT: 0.01, // 1% of max HP
    HEAL_MAX_PERCENT: 0.05, // 5% of max HP
  },
  COIN: {
    BASE_CHANCE: 0.02,      // 2%
    SCALE_FACTOR: 0.666,    // increases every 3 minutes
  },
};
```

---

## Testing Matrix

| Feature | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| Duration | Play until 20:00 | Victory screen appears | TBD |
| XP Scaling | Check XP gem value at 5m, 12.5m, 17m | Multipliers apply correctly | TBD |
| Collection Orb | Kill 100 monsters, observe drops | ~1% drop rate | TBD |
| Healing Orb | Collect healing orb at low HP | HP increases 1-5% | TBD |
| Coin | Kill at 0m, 5m, 10m, observe drops | Chance scales with time | TBD |
| Pause Menu | Press ESC | Menu opens, physics paused | TBD |
| Resume Button | Click Resume | Game resumes | TBD |
| Settings | Click Settings | Placeholder shown | TBD |
| Inventory | Click Inventory | Shows 5 weapons, 5 items | TBD |
| Exit Button | Click Exit | Return to main menu | TBD |
| Dagger Aim | Press right-click, move cursor | Dagger fires toward cursor | TBD |
| Dagger Auto-Fire | Hold right-click | Continuous firing | TBD |
| Axe Arc | Throw axe | Arc distance ≤ 1/3 player radius | TBD |
| Shop Button | Click on menu | Placeholder response | TBD |
| Stat Upgrades | Level up 5+ times | Stats offered repeatedly | TBD |
| Weapon Uniqueness | Level up with all weapons | Weapons never reoffered | TBD |

---

## Known Challenges & Solutions

| Challenge | Solution | Status |
|-----------|----------|--------|
| Collection Orb magnet animation | Use Phaser tweens or custom path | TBD |
| Right-click aiming on mobile | Map touch position to aim direction | TBD |
| Axe parabolic arc | Pre-calculate trajectory instead of gravity | TBD |
| Pause menu over upgrade scene | Only allow pause if upgrade not active | TBD |
| Inventory with partial weapons | Display empty slots, show weapon count | TBD |

---

## Rollout Strategy

1. **Phase 1-2** (5 hours): Core mechanics (duration, XP, drops)
   - Validate with manual playtesting
   - Check drop rates and scaling

2. **Phase 3-4** (4 hours): UI/UX (pause menu, inventory)
   - Verify menu responsiveness
   - Test on mobile (if applicable)

3. **Phase 5-7** (5 hours): Weapons & Polish
   - Test aiming and arc mechanics
   - Final verification of all features

4. **Integration Testing** (1 hour)
   - Play full 20-minute game
   - Verify all features work together
   - Test edge cases (low FPS, rapid clicks, etc.)

---

## Success Criteria

- ✓ Game duration exactly 20 minutes
- ✓ XP scales at correct milestones
- ✓ Loot drops occur at specified rates
- ✓ Pause menu fully functional with all buttons
- ✓ Inventory displays correctly
- ✓ Dagger aiming works smoothly
- ✓ Axe arc behaves as expected
- ✓ No regressions to existing features
- ✓ Shop button visible and clickable
- ✓ Stat upgrades reappear indefinitely

---

## Future Considerations (v0.1.2+)

- Implement Shop UI and coin spending system
- Add drag-and-drop inventory management
- Implement Settings menu (audio, graphics)
- Collection Orb animation variations
- Mobile touch aiming optimization
- Coin value display and history
- Healing orb visual effects

---

## Notes

- **Collection Orbs**: Currently magnet-only; can add XP bonus in future version
- **Coins**: Stored but unused; will be needed for Shop system
- **Right-click**: May require alternative input method for mobile (long-press or dedicated button)
- **Upgrade Reappearance**: Current implementation allows infinite stat upgrades; consider adding soft caps for balance in future

