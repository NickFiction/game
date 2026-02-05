import * as Images from './MY_IMAGES';

// Image cache - stores loaded images
const imageCache: Map<string, HTMLImageElement> = new Map();
const audioCache: Map<string, HTMLAudioElement> = new Map();

// Load an image and cache it
export function loadImage(path: string): HTMLImageElement | null {
  // Return null if path is empty or undefined
  if (!path || path === "") {
    return null;
  }
  
  // Return from cache if already loaded
  if (imageCache.has(path)) {
    return imageCache.get(path) || null;
  }
  
  // Create new image and cache it
  const img = new Image();
  img.src = path;
  imageCache.set(path, img);
  
  return img;
}

// Check if an image is ready to draw
export function isImageReady(path: string): boolean {
  if (!path || path === "") return false;
  const img = imageCache.get(path);
  return img !== undefined && img.complete && img.naturalWidth > 0;
}

// Play a sound
export function playSound(path: string, volume: number = 1.0): void {
  if (!path || path === "") return;
  
  try {
    let audio = audioCache.get(path);
    if (!audio) {
      audio = new Audio(path);
      audioCache.set(path, audio);
    }
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // Ignore sound errors
  }
}

// Get hero image based on state
export function getHeroImage(state: string): HTMLImageElement | null {
  let path = "";
  
  if (state === "idle") path = Images.HERO_IDLE;
  else if (state === "walk") path = Images.HERO_WALK;
  else if (state === "jump") path = Images.HERO_JUMP;
  else if (state === "attack") path = Images.HERO_ATTACK;
  else if (state === "hurt") path = Images.HERO_HURT;
  else if (state === "special") path = Images.HERO_SPECIAL;
  else path = Images.HERO_IDLE;
  
  return loadImage(path);
}

// Get boss image based on boss name and state
export function getBossImage(bossName: string, state: string): HTMLImageElement | null {
  const name = bossName.toLowerCase();
  let path = "";
  
  if (name.includes("harsh")) {
    if (state === "idle") path = Images.HARSH_IDLE;
    else if (state === "walk") path = Images.HARSH_WALK;
    else if (state === "attack") path = Images.HARSH_ATTACK;
    else if (state === "hurt") path = Images.HARSH_HURT;
    else if (state === "death") path = Images.HARSH_DEATH;
    else path = Images.HARSH_IDLE;
  }
  else if (name.includes("garima")) {
    if (state === "idle") path = Images.GARIMA_IDLE;
    else if (state === "walk") path = Images.GARIMA_WALK;
    else if (state === "attack") path = Images.GARIMA_ATTACK;
    else if (state === "hurt") path = Images.GARIMA_HURT;
    else if (state === "death") path = Images.GARIMA_DEATH;
    else path = Images.GARIMA_IDLE;
  }
  else if (name.includes("parnika")) {
    if (state === "idle") path = Images.PARNIKA_IDLE;
    else if (state === "walk") path = Images.PARNIKA_WALK;
    else if (state === "attack") path = Images.PARNIKA_ATTACK;
    else if (state === "hurt") path = Images.PARNIKA_HURT;
    else if (state === "death") path = Images.PARNIKA_DEATH;
    else path = Images.PARNIKA_IDLE;
  }
  else if (name.includes("ravin")) {
    if (state === "idle") path = Images.RAVIN_IDLE;
    else if (state === "walk") path = Images.RAVIN_WALK;
    else if (state === "attack") path = Images.RAVIN_ATTACK;
    else if (state === "hurt") path = Images.RAVIN_HURT;
    else if (state === "death") path = Images.RAVIN_DEATH;
    else path = Images.RAVIN_IDLE;
  }
  
  return loadImage(path);
}

// Get monster image based on type
export function getMonsterImage(type: string): HTMLImageElement | null {
  let path = "";
  const t = type.toLowerCase();
  
  if (t === "slime") path = Images.SLIME;
  else if (t === "bat") path = Images.BAT;
  else if (t === "ghost") path = Images.GHOST;
  else if (t === "shadow") path = Images.SHADOW;
  
  return loadImage(path);
}

// Get background image based on level
export function getBackgroundImage(levelIndex: number): HTMLImageElement | null {
  let path = "";
  
  if (levelIndex === 0) path = Images.BG_VILLAGE;
  else if (levelIndex === 1) path = Images.BG_HARSH_ARENA;
  else if (levelIndex === 2) path = Images.BG_FOREST;
  else if (levelIndex === 3) path = Images.BG_GARIMA_ARENA;
  else if (levelIndex === 4) path = Images.BG_CLOCKWORK;
  else if (levelIndex === 5) path = Images.BG_SWAMP;
  else if (levelIndex === 6) path = Images.BG_MIRROR;
  else if (levelIndex === 7) path = Images.BG_LIBRARY;
  else if (levelIndex === 8) path = Images.BG_CASTLE;
  
  return loadImage(path);
}

// Get effect image
export function getEffectImage(effectType: string): HTMLImageElement | null {
  let path = "";
  const t = effectType.toLowerCase();
  
  if (t === "hit") path = Images.EFFECT_HIT;
  else if (t === "diarrhea") path = Images.EFFECT_DIARRHEA;
  else if (t === "explosion") path = Images.EFFECT_EXPLOSION;
  
  return loadImage(path);
}

// Sound helpers
export const Sounds = {
  heroAttack: () => playSound(Images.HERO_ATTACK_SOUND),
  heroJump: () => playSound(Images.HERO_JUMP_SOUND),
  heroHurt: () => playSound(Images.HERO_HURT_SOUND),
  heroSpecial: () => playSound(Images.HERO_SPECIAL_SOUND),
  harshIntro: () => playSound(Images.HARSH_INTRO_SOUND),
  garimaIntro: () => playSound(Images.GARIMA_INTRO_SOUND),
  parnikaIntro: () => playSound(Images.PARNIKA_INTRO_SOUND),
  ravinIntro: () => playSound(Images.RAVIN_INTRO_SOUND),
  menuSelect: () => playSound(Images.MENU_SELECT_SOUND),
  levelComplete: () => playSound(Images.LEVEL_COMPLETE_SOUND),
  gameOver: () => playSound(Images.GAME_OVER_SOUND),
  victory: () => playSound(Images.VICTORY_SOUND),
};

// Preload all images on startup
export function preloadAllImages(): void {
  Object.values(Images.MY_IMAGES).forEach((path) => {
    if (path && path !== "") {
      loadImage(path);
    }
  });
}

// Initialize - preload all images
preloadAllImages();
