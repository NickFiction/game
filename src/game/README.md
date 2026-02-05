# Terra Demake - Asset & Customization Guide

## Overview

This is a 2D pixel side-scrolling action game with a modular asset system. All placeholder shapes and sounds can be replaced with custom PNGs and audio files without modifying gameplay logic.

---

## 🎨 ASSET STRUCTURE

```
public/assets/
├── hero/
│   ├── idle/          # idle_0.png, idle_1.png, ...
│   ├── walk/          # walk_0.png, walk_1.png, ...
│   ├── jump/          # jump_0.png
│   ├── attack/        # attack_0.png, attack_1.png, ...
│   ├── diarrhea/      # special_0.png, special_1.png, ...
│   ├── hurt/          # hurt_0.png, hurt_1.png
│   └── death/         # death_0.png, death_1.png, ...
├── bosses/
│   ├── harsh/         # Same state folders as hero
│   ├── garima/
│   ├── parnika/
│   └── ravin/
├── backgrounds/
│   ├── prologue.png
│   ├── level1.png
│   ├── forest.png
│   ├── clockwork.png
│   ├── swamp.png
│   ├── mirror.png
│   ├── library.png
│   └── castle.png
├── effects/
│   ├── hit.png
│   ├── explosion.png
│   ├── diarrhea_wave.png
│   └── glitch.png
└── sounds/
    ├── hero/
    │   ├── attack.mp3
    │   ├── hurt.mp3
    │   ├── jump.mp3
    │   ├── special.mp3
    │   └── death.mp3
    ├── bosses/
    │   ├── harsh/
    │   ├── garima/
    │   ├── parnika/
    │   └── ravin/
    ├── ui/
    │   ├── menu_select.mp3
    │   ├── level_complete.mp3
    │   └── game_over.mp3
    └── ambient/
        ├── forest.mp3
        ├── swamp.mp3
        └── castle.mp3
```

---

## 🔧 HOW TO CUSTOMIZE

### Replacing Placeholder Shapes with PNGs

1. Open `src/game/assets.ts`
2. Find the asset you want to replace
3. Change `type: 'placeholder'` to `type: 'image'`
4. Add `imagePath: '/assets/path/to/your/image.png'`

Example:
```typescript
// Before (placeholder)
const createPlaceholder = (color: string, width: number, height: number): AssetConfig => ({
  type: 'placeholder',
  color,
  width,
  height,
});

// After (custom image)
const createImageAsset = (path: string, width: number, height: number): AssetConfig => ({
  type: 'image',
  imagePath: path,
  width,
  height,
});

// Usage
heroAssets.idle = [
  createFrame(createImageAsset('/assets/hero/idle/idle_0.png', 32, 48), 500),
  createFrame(createImageAsset('/assets/hero/idle/idle_1.png', 32, 48), 500),
];
```

### Replacing Placeholder Sounds

1. Open `src/game/assets.ts`
2. Find the sound config you want to replace
3. Change `type: 'placeholder'` to `type: 'custom'`
4. Add `soundPath: '/assets/sounds/path/to/sound.mp3'`

Example:
```typescript
// Before (placeholder beep)
heroSounds.attack = { type: 'placeholder', frequency: 440, duration: 100 };

// After (custom sound)
heroSounds.attack = { type: 'custom', soundPath: '/assets/sounds/hero/attack.mp3' };
```

---

## 📝 CUSTOMIZING DIALOGUES

All dialogues are defined in `src/game/levels.ts`.

### Boss Dialogues

```typescript
export const BOSS_DIALOGUES: Record<string, DialogueTrigger[]> = {
  harsh: [
    { condition: 'intro', text: 'YOUR CUSTOM INTRO TEXT', triggered: false },
    { condition: 'random', text: 'YOUR RANDOM DIALOGUE', triggered: false },
    { condition: 'defeat', text: 'YOUR DEFEAT TEXT', triggered: false },
  ],
  // ... other bosses
};
```

### Dialogue Conditions

- `intro` - Shown when boss fight starts
- `random` - Randomly triggered during fight
- `hp_threshold` - Triggered at specific HP percentage
- `special_unlock` - Triggers special attack unlock
- `defeat` - Shown when boss is defeated

---

## ❓ CUSTOMIZING MCQ QUESTIONS

Questions are defined in `src/game/levels.ts`:

```typescript
export const MCQ_QUESTIONS: MCQuestion[] = [
  {
    question: 'Your question here?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0, // Index of correct answer (0 = A, 1 = B, etc.)
  },
  // ... more questions
];
```

---

## 🎮 GAME CONTROLS

- **← →** : Move left/right
- **↑ / Space** : Jump
- **Z** : Attack (melee)
- **X** : Special Attack (DIARRHEA) - unlocked during Garima fight

---

## 📊 LEVEL STRUCTURE

Levels are defined in `src/game/levels.ts`:

```typescript
export const LEVELS: LevelConfig[] = [
  {
    id: 'prologue',
    name: 'Prologue - Quiet Village',
    backgroundColor: '#1a1a2e',
    groundColor: '#2d4a3e',
    hasBoss: false,
    introTexts: ['Text 1', 'Text 2', ...],
    ambientTexts: ['Ambient text 1', ...],
  },
  {
    id: 'harsh',
    name: 'Level 1 - The Confused Knight',
    hasBoss: true,
    bossType: 'harsh',
    // ...
  },
];
```

---

## 🎨 CHARACTER STATES

Each character (hero and bosses) has these states:

| State | Description |
|-------|-------------|
| `idle` | Standing still |
| `walk` | Moving left/right |
| `jump` | In the air |
| `attack` | Performing attack |
| `hurt` | Taking damage |
| `special` | Using special ability |
| `death` | Death animation |

Each state can have multiple animation frames.

---

## 💥 SPECIAL ATTACK: DIARRHEA

- **Unlocked**: During Garima fight (Level 3) at low HP
- **Trigger**: Press X when cooldown is ready
- **Effect**: Expanding AOE wave that damages all enemies
- **Cooldown**: 5 seconds

To customize the special attack effect, modify the `special` effect type in `GameCanvas.tsx`.

---

## 🔊 SOUND HOOKS

Sounds are played via the `playSound()` function in `src/game/assets.ts`:

```typescript
import { playSound, heroSounds, createBossSounds } from './assets';

// Play hero attack sound
playSound(heroSounds.attack);

// Play boss sound
const bossSounds = createBossSounds('harsh');
playSound(bossSounds.hurt);
```

---

## 📁 FILE STRUCTURE

```
src/game/
├── types.ts          # TypeScript type definitions
├── constants.ts      # Game constants (physics, damage, etc.)
├── assets.ts         # Asset configurations & loading
├── levels.ts         # Level & dialogue configurations
├── useGameEngine.ts  # Main game logic hook
├── Game.tsx          # Main game component
├── GameCanvas.tsx    # Canvas rendering
├── TitleScreen.tsx   # Title screen
├── PrologueScreen.tsx # Prologue/intro
├── DialogueBox.tsx   # Dialogue display
├── MCQOverlay.tsx    # Quiz overlay for Ravin
├── LevelCompleteScreen.tsx
├── GameOverScreen.tsx
├── VictoryScreen.tsx
└── README.md         # This file
```

---

## 🚀 ADDING NEW BOSSES

1. Add boss type to `types.ts`:
   ```typescript
   export type BossType = 'harsh' | 'garima' | ... | 'newboss';
   ```

2. Add boss colors in `assets.ts`:
   ```typescript
   const BOSS_COLORS: Record<BossType, {...}> = {
     newboss: { main: '#color', attack: '#color', hurt: '#color' },
   };
   ```

3. Add boss HP in `constants.ts`:
   ```typescript
   export const BOSS_HP: Record<string, number> = {
     newboss: 150,
   };
   ```

4. Add level config in `levels.ts`
5. Add dialogues in `BOSS_DIALOGUES`

---

## 🎯 DESIGN PHILOSOPHY

The game is designed with these principles:

1. **Separation of Concerns**: Visual/audio assets are completely separate from game logic
2. **Easy Replacement**: All placeholders can be swapped without code changes to gameplay
3. **Modular Dialogues**: All text is centralized and easily editable
4. **Extensible**: New bosses, levels, and content can be added through configuration

---

## 🐛 TROUBLESHOOTING

**Images not loading?**
- Ensure images are in `public/assets/` directory
- Check file paths match exactly (case-sensitive)

**Sounds not playing?**
- Browser may block autoplay - user interaction required first
- Check sound file format (MP3 recommended)

**Game performance issues?**
- Reduce number of effects
- Use smaller image dimensions
- Optimize animation frame counts
