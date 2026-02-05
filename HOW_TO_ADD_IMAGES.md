# 🎮 HOW TO ADD YOUR OWN IMAGES (Super Easy!)

## Step 1: Put your image file in the right folder

```
public/
  images/
    hero/
      my-hero-idle.png      <-- put hero images here
      my-hero-walk.png
    bosses/
      harsh-idle.png        <-- put boss images here
      garima-attack.png
    monsters/
      slime.png             <-- put monster images here
    backgrounds/
      village.png           <-- put background images here
    effects/
      explosion.png         <-- put effect images here
```

## Step 2: Open the file `src/MY_IMAGES.ts`

## Step 3: Find the image you want to change and add the path

### BEFORE (no image - uses colored rectangle):
```typescript
export const HERO_IDLE = "";
```

### AFTER (your custom image):
```typescript
export const HERO_IDLE = "/images/hero/my-hero-idle.png";
```

## Step 4: Save the file and refresh the game!

---

# 📋 COMPLETE LIST OF ALL IMAGES

## HERO (Your Main Character)
| Variable | Description | Recommended Size |
|----------|-------------|------------------|
| `HERO_IDLE` | Standing still | 50x60 pixels |
| `HERO_WALK` | Walking animation | 50x60 pixels |
| `HERO_JUMP` | Jumping | 50x60 pixels |
| `HERO_ATTACK` | Attacking | 60x60 pixels |
| `HERO_HURT` | Getting hurt | 50x60 pixels |
| `HERO_SPECIAL` | DIARRHEA attack | 60x60 pixels |

---

## BOSS 1: HARSH (The Confused Knight)
| Variable | Description | Recommended Size |
|----------|-------------|------------------|
| `HARSH_IDLE` | Standing | 70x80 pixels |
| `HARSH_WALK` | Walking | 70x80 pixels |
| `HARSH_ATTACK` | Attacking | 80x80 pixels |
| `HARSH_HURT` | Getting hurt | 70x80 pixels |
| `HARSH_DEATH` | Dying animation | 70x80 pixels |

---

## BOSS 2: GARIMA (The False Ally)
| Variable | Description | Recommended Size |
|----------|-------------|------------------|
| `GARIMA_IDLE` | Standing | 70x80 pixels |
| `GARIMA_WALK` | Walking | 70x80 pixels |
| `GARIMA_ATTACK` | Attacking | 80x80 pixels |
| `GARIMA_HURT` | Getting hurt | 70x80 pixels |
| `GARIMA_DEATH` | Dying animation | 70x80 pixels |

---

## BOSS 3: PARNIKA (Queen of Swamp)
| Variable | Description | Recommended Size |
|----------|-------------|------------------|
| `PARNIKA_IDLE` | Standing | 70x80 pixels |
| `PARNIKA_WALK` | Walking | 70x80 pixels |
| `PARNIKA_ATTACK` | Attacking | 80x80 pixels |
| `PARNIKA_HURT` | Getting hurt | 70x80 pixels |
| `PARNIKA_DEATH` | Dying animation | 70x80 pixels |

---

## BOSS 4: RAVIN (The Riddler)
| Variable | Description | Recommended Size |
|----------|-------------|------------------|
| `RAVIN_IDLE` | Standing | 70x80 pixels |
| `RAVIN_WALK` | Walking | 70x80 pixels |
| `RAVIN_ATTACK` | Attacking | 80x80 pixels |
| `RAVIN_HURT` | Getting hurt | 70x80 pixels |
| `RAVIN_DEATH` | Dying animation | 70x80 pixels |

---

## MONSTERS
| Variable | Description | Recommended Size |
|----------|-------------|------------------|
| `SLIME` | Green bouncy slime | 35x25 pixels |
| `BAT` | Purple flying bat | 30x25 pixels |
| `GHOST` | Pale floating ghost | 35x40 pixels |
| `SHADOW` | Dark shadow creature | 40x35 pixels |

---

## BACKGROUNDS (One for each level)
| Variable | Level | Recommended Size |
|----------|-------|------------------|
| `BG_VILLAGE` | Prologue - Quiet Village | 800x450 pixels |
| `BG_HARSH_ARENA` | Level 1 - Harsh Boss | 800x450 pixels |
| `BG_FOREST` | Level 2 - Forest | 800x450 pixels |
| `BG_GARIMA_ARENA` | Level 3 - Garima Boss | 800x450 pixels |
| `BG_CLOCKWORK` | Level 4 - Clockwork | 800x450 pixels |
| `BG_SWAMP` | Level 5 - Parnika Boss | 800x450 pixels |
| `BG_MIRROR` | Level 6 - Mirror Area | 800x450 pixels |
| `BG_LIBRARY` | Level 7 - Ravin Boss | 800x450 pixels |
| `BG_CASTLE` | Final Level - Castle | 800x450 pixels |

---

## EFFECTS
| Variable | Description | Recommended Size |
|----------|-------------|------------------|
| `EFFECT_HIT` | Hit spark | 40x40 pixels |
| `EFFECT_DIARRHEA` | Special attack wave | 200x100 pixels |
| `EFFECT_EXPLOSION` | Boss death explosion | 100x100 pixels |

---

# 🔊 SOUNDS

Put sound files in `public/sounds/` folder.

| Variable | Description |
|----------|-------------|
| `HERO_ATTACK_SOUND` | Hero attack sound |
| `HERO_JUMP_SOUND` | Hero jump sound |
| `HERO_HURT_SOUND` | Hero hurt sound |
| `HERO_SPECIAL_SOUND` | DIARRHEA attack sound |
| `HARSH_INTRO_SOUND` | Harsh boss intro |
| `GARIMA_INTRO_SOUND` | Garima boss intro |
| `PARNIKA_INTRO_SOUND` | Parnika boss intro |
| `RAVIN_INTRO_SOUND` | Ravin boss intro |
| `MENU_SELECT_SOUND` | Menu click sound |
| `LEVEL_COMPLETE_SOUND` | Level complete jingle |
| `GAME_OVER_SOUND` | Game over sound |
| `VICTORY_SOUND` | Victory fanfare |

---

# 💡 EXAMPLE: Adding a Hero Image

1. Save your hero image as `cool-hero.png`
2. Put it in `public/images/hero/cool-hero.png`
3. Open `src/MY_IMAGES.ts`
4. Change this line:
   ```typescript
   export const HERO_IDLE = "";
   ```
   To this:
   ```typescript
   export const HERO_IDLE = "/images/hero/cool-hero.png";
   ```
5. Save and refresh!

---

# ⚠️ IMPORTANT NOTES

- Image paths MUST start with `/images/`
- Use `.png` files for transparency
- If image doesn't load, it falls back to colored rectangle
- You can add images one at a time - no need to add all at once!
