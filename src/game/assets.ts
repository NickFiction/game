import { CharacterAssets, AssetConfig, SoundLibrary, SoundConfig, BossType } from './types';

// Asset paths for future PNG replacements
export const ASSET_PATHS = {
  hero: {
    idle: '/assets/hero/idle/',
    walk: '/assets/hero/walk/',
    jump: '/assets/hero/jump/',
    attack: '/assets/hero/attack/',
    diarrhea: '/assets/hero/diarrhea/',
    hurt: '/assets/hero/hurt/',
  },
  bosses: {
    harsh: '/assets/bosses/harsh/',
    garima: '/assets/bosses/garima/',
    parnika: '/assets/bosses/parnika/',
    ravin: '/assets/bosses/ravin/',
  },
  backgrounds: '/assets/backgrounds/',
  effects: '/assets/effects/',
  sounds: {
    hero: '/assets/sounds/hero/',
    bosses: '/assets/sounds/bosses/',
    ui: '/assets/sounds/ui/',
    ambient: '/assets/sounds/ambient/',
  },
};

// Placeholder colors
const HERO_COLOR = '#4a90d9';
const HERO_ATTACK_COLOR = '#6ab0ff';
const HERO_HURT_COLOR = '#ff6b6b';
const HERO_SPECIAL_COLOR = '#8b6914';

// Create placeholder asset
const createPlaceholder = (color: string, width: number, height: number): AssetConfig => ({
  type: 'placeholder',
  color,
  width,
  height,
});

// Create animation frame
const createFrame = (asset: AssetConfig, duration: number) => ({ asset, duration });

// Hero assets (placeholder)
export const heroAssets: CharacterAssets = {
  idle: [
    createFrame(createPlaceholder(HERO_COLOR, 32, 48), 500),
    createFrame(createPlaceholder(HERO_COLOR, 32, 46), 500),
  ],
  walk: [
    createFrame(createPlaceholder(HERO_COLOR, 32, 48), 100),
    createFrame(createPlaceholder(HERO_COLOR, 34, 48), 100),
    createFrame(createPlaceholder(HERO_COLOR, 32, 48), 100),
    createFrame(createPlaceholder(HERO_COLOR, 30, 48), 100),
  ],
  jump: [
    createFrame(createPlaceholder(HERO_COLOR, 32, 52), 200),
  ],
  attack: [
    createFrame(createPlaceholder(HERO_ATTACK_COLOR, 48, 48), 100),
    createFrame(createPlaceholder(HERO_ATTACK_COLOR, 56, 48), 100),
    createFrame(createPlaceholder(HERO_COLOR, 32, 48), 100),
  ],
  hurt: [
    createFrame(createPlaceholder(HERO_HURT_COLOR, 32, 48), 200),
    createFrame(createPlaceholder(HERO_COLOR, 32, 48), 100),
  ],
  special: [
    createFrame(createPlaceholder(HERO_SPECIAL_COLOR, 40, 48), 100),
    createFrame(createPlaceholder('#a07820', 48, 48), 100),
    createFrame(createPlaceholder('#c09030', 56, 48), 200),
    createFrame(createPlaceholder(HERO_COLOR, 32, 48), 100),
  ],
  death: [
    createFrame(createPlaceholder(HERO_HURT_COLOR, 32, 48), 200),
    createFrame(createPlaceholder(HERO_HURT_COLOR, 36, 40), 200),
    createFrame(createPlaceholder(HERO_HURT_COLOR, 48, 24), 300),
  ],
};

// Boss colors
const BOSS_COLORS: Record<BossType, { main: string; attack: string; hurt: string }> = {
  harsh: { main: '#8844aa', attack: '#aa66cc', hurt: '#ff6666' },
  garima: { main: '#44aa88', attack: '#66ccaa', hurt: '#ff6666' },
  parnika: { main: '#668844', attack: '#88aa66', hurt: '#ff6666' },
  ravin: { main: '#aa8844', attack: '#ccaa66', hurt: '#ff6666' },
  final: { main: '#aa2222', attack: '#cc4444', hurt: '#ff8888' },
};

// Create boss assets
export const createBossAssets = (type: BossType): CharacterAssets => {
  const colors = BOSS_COLORS[type];
  const size = type === 'final' ? 80 : 64;
  
  return {
    idle: [
      createFrame(createPlaceholder(colors.main, size, size), 500),
      createFrame(createPlaceholder(colors.main, size, size - 4), 500),
    ],
    walk: [
      createFrame(createPlaceholder(colors.main, size, size), 150),
      createFrame(createPlaceholder(colors.main, size + 4, size), 150),
      createFrame(createPlaceholder(colors.main, size, size), 150),
      createFrame(createPlaceholder(colors.main, size - 4, size), 150),
    ],
    jump: [
      createFrame(createPlaceholder(colors.main, size, size + 8), 200),
    ],
    attack: [
      createFrame(createPlaceholder(colors.attack, size + 16, size), 150),
      createFrame(createPlaceholder(colors.attack, size + 24, size), 150),
      createFrame(createPlaceholder(colors.main, size, size), 100),
    ],
    hurt: [
      createFrame(createPlaceholder(colors.hurt, size, size), 200),
      createFrame(createPlaceholder(colors.main, size, size), 100),
    ],
    special: [
      createFrame(createPlaceholder(colors.attack, size + 8, size + 8), 200),
      createFrame(createPlaceholder(colors.attack, size + 16, size + 16), 200),
      createFrame(createPlaceholder(colors.main, size, size), 100),
    ],
    death: [
      createFrame(createPlaceholder(colors.hurt, size, size), 200),
      createFrame(createPlaceholder(colors.hurt, size + 8, size - 16), 200),
      createFrame(createPlaceholder(colors.hurt, size + 16, size - 32), 300),
    ],
  };
};

// Sound system
const createPlaceholderSound = (frequency: number, duration: number): SoundConfig => ({
  type: 'placeholder',
  frequency,
  duration,
});

export const heroSounds: SoundLibrary = {
  attack: createPlaceholderSound(440, 100),
  hurt: createPlaceholderSound(220, 200),
  jump: createPlaceholderSound(660, 80),
  special: createPlaceholderSound(150, 500),
  death: createPlaceholderSound(110, 600),
};

export const createBossSounds = (type: BossType): SoundLibrary => {
  const baseFreq = type === 'harsh' ? 200 : type === 'garima' ? 180 : type === 'parnika' ? 160 : 140;
  
  return {
    attack: createPlaceholderSound(baseFreq + 100, 150),
    hurt: createPlaceholderSound(baseFreq - 50, 200),
    jump: createPlaceholderSound(baseFreq + 200, 100),
    special: createPlaceholderSound(baseFreq - 80, 400),
    death: createPlaceholderSound(baseFreq - 100, 800),
    intro: createPlaceholderSound(baseFreq, 300),
  };
};

// Audio context for placeholder sounds
let audioContext: AudioContext | null = null;

export const playSound = (config: SoundConfig): void => {
  if (config.type === 'custom' && config.soundPath) {
    const audio = new Audio(config.soundPath);
    audio.play().catch(() => {});
    return;
  }
  
  if (config.type === 'placeholder' && config.frequency && config.duration) {
    try {
      if (!audioContext) {
        audioContext = new AudioContext();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = config.frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration / 1000);
    } catch {
      // Audio not available
    }
  }
};

// Image loading for custom assets
const imageCache: Map<string, HTMLImageElement> = new Map();

export const loadImage = (path: string): Promise<HTMLImageElement> => {
  if (imageCache.has(path)) {
    return Promise.resolve(imageCache.get(path)!);
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(path, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = path;
  });
};

// Render asset (placeholder or image)
// Image scaling factor for PNG images (increase this to make images larger)
const IMAGE_SCALE = 8;

export const renderAsset = (
  ctx: CanvasRenderingContext2D,
  asset: AssetConfig,
  x: number,
  y: number,
  flipX: boolean = false
): void => {
  ctx.save();
  
  // Calculate scaled dimensions
  const scaledWidth = asset.width * IMAGE_SCALE;
  const scaledHeight = asset.height * IMAGE_SCALE;
  const offsetX = (scaledWidth - asset.width) / 2;
  const offsetY = (scaledHeight - asset.height) / 2;
  
  if (flipX) {
    ctx.translate(x + scaledWidth / 2, y);
    ctx.scale(-1, 1);
    ctx.translate(-scaledWidth / 2, 0);
  } else {
    ctx.translate(x, y);
  }
  
  if (asset.type === 'placeholder' && asset.color) {
    ctx.fillStyle = asset.color;
    ctx.fillRect(-offsetX, -offsetY, scaledWidth, scaledHeight);
    
    // Add pixel-style details
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(-offsetX + 2, -offsetY + 2, scaledWidth - 4, 4);
    
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-offsetX + 2, -offsetY + scaledHeight - 6, scaledWidth - 4, 4);
  } else if (asset.type === 'image' && asset.imagePath) {
    const img = imageCache.get(asset.imagePath);
    if (img) {
      ctx.drawImage(img, -offsetX, -offsetY, scaledWidth, scaledHeight);
    }
  }
  
  ctx.restore();
};
