// Character States
export type CharacterState = 'idle' | 'walk' | 'jump' | 'attack' | 'hurt' | 'special' | 'death';

// Asset Types
export interface AssetConfig {
  type: 'placeholder' | 'image';
  color?: string;
  imagePath?: string;
  width: number;
  height: number;
}

export interface AnimationFrame {
  asset: AssetConfig;
  duration: number;
}

export interface CharacterAssets {
  idle: AnimationFrame[];
  walk: AnimationFrame[];
  jump: AnimationFrame[];
  attack: AnimationFrame[];
  hurt: AnimationFrame[];
  special: AnimationFrame[];
  death: AnimationFrame[];
}

// Sound Types
export interface SoundConfig {
  type: 'placeholder' | 'custom';
  frequency?: number;
  duration?: number;
  soundPath?: string;
}

export interface SoundLibrary {
  attack: SoundConfig;
  hurt: SoundConfig;
  jump: SoundConfig;
  special: SoundConfig;
  death: SoundConfig;
  intro?: SoundConfig;
}

// Entity Types
export interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  state: CharacterState;
  facing: 'left' | 'right';
  animationFrame: number;
  stateTimer: number;
  invincible: boolean;
  invincibleTimer: number;
}

export interface Player extends Entity {
  hasSpecialAttack: boolean;
  specialCooldown: number;
}

export interface Boss extends Entity {
  type: BossType;
  phase: number;
  attackCooldown: number;
  dialogueTriggers: DialogueTrigger[];
  defeated: boolean;
  isAlly?: boolean;
  allyPhase?: 'friendly' | 'approach' | 'betray' | 'combat';
}

export type BossType = 'harsh' | 'garima' | 'parnika' | 'ravin' | 'final';

// Monster Types
export interface Monster extends Entity {
  id: string;
  type: MonsterType;
  attackCooldown: number;
  defeated: boolean;
  damage: number;
}

export type MonsterType = 'slime' | 'bat' | 'ghost' | 'shadow';

// Dialogue Types
export interface DialogueTrigger {
  condition: 'intro' | 'mid' | 'hp_threshold' | 'defeat' | 'special_unlock' | 'random';
  hpThreshold?: number;
  text: string;
  triggered: boolean;
}

export interface Dialogue {
  speaker: 'narrator' | 'boss' | 'system';
  text: string;
  style: 'normal' | 'glitch' | 'big' | 'flash';
}

// MCQ Types
export interface MCQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

// Level Types
export type LevelType = 
  | 'prologue' 
  | 'harsh' 
  | 'forest' 
  | 'garima' 
  | 'clockwork' 
  | 'parnika' 
  | 'mirror' 
  | 'ravin' 
  | 'final';

export interface LevelConfig {
  id: LevelType;
  name: string;
  backgroundColor: string;
  groundColor: string;
  ambientTexts?: string[];
  hasBoss: boolean;
  bossType?: BossType;
  introTexts?: string[];
}

// Effect Types
export interface Effect {
  id: string;
  type: 'hit' | 'special' | 'explosion' | 'glitch';
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  duration: number;
  elapsed: number;
  damage?: number;
}

// Game State
export type GamePhase = 
  | 'title' 
  | 'prologue' 
  | 'playing' 
  | 'dialogue' 
  | 'mcq' 
  | 'paused' 
  | 'level_complete' 
  | 'game_over' 
  | 'victory';

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  player: Player;
  boss: Boss | null;
  monsters: Monster[];
  effects: Effect[];
  dialogue: Dialogue | null;
  mcq: MCQuestion | null;
  screenShake: number;
  score: number;
  elapsedTime: number;
  canAttackBoss: boolean;
  ravinQuestionThresholds: number[];
}
