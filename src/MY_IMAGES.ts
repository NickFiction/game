// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                                                                              ║
// ║   🎮 YOUR CUSTOM IMAGES GO HERE! 🎮                                          ║
// ║                                                                              ║
// ║   HOW TO ADD YOUR OWN IMAGES:                                                ║
// ║                                                                              ║
// ║   1. Put your PNG file in the "public/images/" folder                        ║
// ║   2. Write the path below (starting with /images/)                           ║
// ║   3. Save this file and refresh the game                                     ║
// ║                                                                              ║
// ║   EXAMPLE:                                                                   ║
// ║   --------                                                                   ║
// ║   If you save "my-hero.png" in "public/images/hero/"                         ║
// ║   Then change this:  HERO_IDLE: "",                                          ║
// ║   To this:           HERO_IDLE: "/images/hero/my-hero.png",                  ║
// ║                                                                              ║
// ║   Leave as "" to keep using the colored rectangle placeholder                ║
// ║                                                                              ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════
// HERO (Your Main Character)
// ═══════════════════════════════════════════════════════════════════════════════

export const HERO_IDLE = "public/images/hero/idle.png";      // Standing still
export const HERO_WALK = "public/images/hero/walk.png";      // Walking
export const HERO_JUMP = "public/images/hero/jump.png";      // Jumping
export const HERO_ATTACK = "public/images/hero/attack.png";    // Attacking
export const HERO_HURT = "public/images/hero/hurt.png";      // Getting hurt
export const HERO_SPECIAL = "public/images/hero/special.png";   // DIARRHEA attack

// ═══════════════════════════════════════════════════════════════════════════════
// BOSS 1: HARSH (The Confused Knight)
// ═══════════════════════════════════════════════════════════════════════════════

export const HARSH_IDLE = "public/images/bosses/harsh.png";     // Standing
export const HARSH_WALK = "public/images/bosses/harsh.png";     // Walking
export const HARSH_ATTACK = "public/images/bosses/harsh.png";   // Attacking
export const HARSH_HURT = "public/images/bosses/harsh.png";     // Getting hurt
export const HARSH_DEATH = "public/images/bosses/harsh.png";    // Dying

// ═══════════════════════════════════════════════════════════════════════════════
// BOSS 2: GARIMA (The False Ally / Best Friend)
// ═══════════════════════════════════════════════════════════════════════════════

export const GARIMA_IDLE = "public/images/bosses/garima.png";     // Standing
export const GARIMA_WALK = "public/images/bosses/garima.png";     // Walking
export const GARIMA_ATTACK = "public/images/bosses/garima.png";   // Attacking
export const GARIMA_HURT = "public/images/bosses/garima.png";     // Getting hurt
export const GARIMA_DEATH = "public/images/bosses/garima.png";    // Dying

// ═══════════════════════════════════════════════════════════════════════════════
// BOSS 3: PARNIKA (Queen of Swamp)
// ═══════════════════════════════════════════════════════════════════════════════

export const PARNIKA_IDLE = "public/images/bosses/parnika.png";     // Standing
export const PARNIKA_WALK = "public/images/bosses/parnika.png";     // Walking
export const PARNIKA_ATTACK = "public/images/bosses/parnika.png";   // Attacking
export const PARNIKA_HURT = "public/images/bosses/parnika.png";     // Getting hurt
export const PARNIKA_DEATH = "public/images/bosses/parnika.png";    // Dying

// ═══════════════════════════════════════════════════════════════════════════════
// BOSS 4: RAVIN (The Riddler)
// ═══════════════════════════════════════════════════════════════════════════════

export const RAVIN_IDLE = "public/images/bosses/ravin.png";     // Standing
export const RAVIN_WALK = "public/images/bosses/ravin.png";     // Walking
export const RAVIN_ATTACK = "public/images/bosses/ravin.png";   // Attacking
export const RAVIN_HURT = "public/images/bosses/ravin.png";     // Getting hurt
export const RAVIN_DEATH = "public/images/bosses/ravin.png";    // Dying

// ═══════════════════════════════════════════════════════════════════════════════
// MONSTERS (Small enemies in levels 2, 4 and 6)
// ═══════════════════════════════════════════════════════════════════════════════

export const SLIME = "";    // Green bouncing slime
export const BAT = "";      // Purple flying bat
export const GHOST = "";    // Pale floating ghost
export const SHADOW = "";   // Dark shadow creature

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUNDS (One for each level - 800x450 pixels recommended)
// ═══════════════════════════════════════════════════════════════════════════════

export const BG_VILLAGE = "";       // Prologue - Quiet Village
export const BG_HARSH_ARENA = "";   // Level 1 - Harsh Boss Arena
export const BG_FOREST = "";        // Level 2 - Forest of Lost Paths
export const BG_GARIMA_ARENA = "";  // Level 3 - Garima Boss Arena
export const BG_CLOCKWORK = "";     // Level 4 - Clockwork Area
export const BG_SWAMP = "";         // Level 5 - Parnika's Swamp
export const BG_MIRROR = "";        // Level 6 - Mirror Area
export const BG_LIBRARY = "";       // Level 7 - Ravin's Library
export const BG_CASTLE = "";        // Final Level - Evil Castle

// ═══════════════════════════════════════════════════════════════════════════════
// EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

export const EFFECT_HIT = "";        // Hit spark effect
export const EFFECT_DIARRHEA = "";   // Special attack wave
export const EFFECT_EXPLOSION = "";  // Boss death explosion

// ═══════════════════════════════════════════════════════════════════════════════
// SOUNDS - Put sounds in public/sounds/ folder
// ═══════════════════════════════════════════════════════════════════════════════

export const HERO_ATTACK_SOUND = "";    // Example: "/sounds/hero/attack.mp3"
export const HERO_JUMP_SOUND = "";      // Example: "/sounds/hero/jump.mp3"
export const HERO_HURT_SOUND = "";      // Example: "/sounds/hero/hurt.mp3"
export const HERO_SPECIAL_SOUND = "";   // Example: "/sounds/hero/diarrhea.mp3"

export const HARSH_INTRO_SOUND = "";    // Example: "/sounds/bosses/harsh-intro.mp3"
export const GARIMA_INTRO_SOUND = "";   // Example: "/sounds/bosses/garima-intro.mp3"
export const PARNIKA_INTRO_SOUND = "";  // Example: "/sounds/bosses/parnika-intro.mp3"
export const RAVIN_INTRO_SOUND = "";    // Example: "/sounds/bosses/ravin-intro.mp3"

export const MENU_SELECT_SOUND = "";     // Example: "/sounds/ui/select.mp3"
export const LEVEL_COMPLETE_SOUND = "";  // Example: "/sounds/ui/level-complete.mp3"
export const GAME_OVER_SOUND = "";       // Example: "/sounds/ui/game-over.mp3"
export const VICTORY_SOUND = "";         // Example: "/sounds/ui/victory.mp3"

export const MUSIC_MENU = "";     // Example: "/sounds/music/menu.mp3"
export const MUSIC_BATTLE = "";   // Example: "/sounds/music/battle.mp3"
export const MUSIC_VICTORY = "";  // Example: "/sounds/music/victory.mp3"


// ═══════════════════════════════════════════════════════════════════════════════
// DO NOT EDIT BELOW - This bundles everything for the game to use
// ═══════════════════════════════════════════════════════════════════════════════

export const MY_IMAGES: { [key: string]: string } = {
  HERO_IDLE,
  HERO_WALK,
  HERO_JUMP,
  HERO_ATTACK,
  HERO_HURT,
  HERO_SPECIAL,
  HARSH_IDLE,
  HARSH_WALK,
  HARSH_ATTACK,
  HARSH_HURT,
  HARSH_DEATH,
  GARIMA_IDLE,
  GARIMA_WALK,
  GARIMA_ATTACK,
  GARIMA_HURT,
  GARIMA_DEATH,
  PARNIKA_IDLE,
  PARNIKA_WALK,
  PARNIKA_ATTACK,
  PARNIKA_HURT,
  PARNIKA_DEATH,
  RAVIN_IDLE,
  RAVIN_WALK,
  RAVIN_ATTACK,
  RAVIN_HURT,
  RAVIN_DEATH,
  SLIME,
  BAT,
  GHOST,
  SHADOW,
  BG_VILLAGE,
  BG_HARSH_ARENA,
  BG_FOREST,
  BG_GARIMA_ARENA,
  BG_CLOCKWORK,
  BG_SWAMP,
  BG_MIRROR,
  BG_LIBRARY,
  BG_CASTLE,
  EFFECT_HIT,
  EFFECT_DIARRHEA,
  EFFECT_EXPLOSION,
};

export const MY_SOUNDS: { [key: string]: string } = {
  HERO_ATTACK: HERO_ATTACK_SOUND,
  HERO_JUMP: HERO_JUMP_SOUND,
  HERO_HURT: HERO_HURT_SOUND,
  HERO_SPECIAL: HERO_SPECIAL_SOUND,
  HARSH_INTRO: HARSH_INTRO_SOUND,
  GARIMA_INTRO: GARIMA_INTRO_SOUND,
  PARNIKA_INTRO: PARNIKA_INTRO_SOUND,
  RAVIN_INTRO: RAVIN_INTRO_SOUND,
  MENU_SELECT: MENU_SELECT_SOUND,
  LEVEL_COMPLETE: LEVEL_COMPLETE_SOUND,
  GAME_OVER: GAME_OVER_SOUND,
  VICTORY: VICTORY_SOUND,
  MUSIC_MENU,
  MUSIC_BATTLE,
  MUSIC_VICTORY,
};
