// Game dimensions
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;
export const GROUND_HEIGHT = 80;
export const GROUND_Y = GAME_HEIGHT - GROUND_HEIGHT;

// Physics
export const GRAVITY = 0.6;
export const PLAYER_SPEED = 4;
export const PLAYER_JUMP_FORCE = -14;
export const BOSS_SPEED = 2;

// Combat
export const PLAYER_ATTACK_RANGE = 60;
export const PLAYER_ATTACK_DAMAGE = 10;
export const BOSS_ATTACK_RANGE = 80;
export const BOSS_ATTACK_DAMAGE = 15;
export const SPECIAL_ATTACK_DAMAGE = 40;
export const SPECIAL_ATTACK_COOLDOWN = 5000;
export const INVINCIBILITY_TIME = 1000;

// Timers
export const ATTACK_DURATION = 300;
export const HURT_DURATION = 300;
export const DEATH_DURATION = 700;
export const DIALOGUE_DISPLAY_TIME = 3000;

// Boss HP
export const BOSS_HP: Record<string, number> = {
  harsh: 100,
  garima: 150,
  parnika: 120,
  ravin: 130,
  final: 200,
};

// Player
export const PLAYER_HP = 100;
export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 48;

// Effects
export const EFFECT_COLORS = {
  hit: '#ffffff',
  special: '#8b6914',
  explosion: '#ff4444',
  glitch: '#00ff00',
};
