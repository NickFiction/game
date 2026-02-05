import { useRef, useCallback, useEffect, useState } from 'react';
import {
  GameState,
  Player,
  Boss,
  Monster,
  CharacterState,
  BossType,
  MonsterType,
} from './types';
import {
  GAME_WIDTH,
  GROUND_Y,
  GRAVITY,
  PLAYER_SPEED,
  PLAYER_JUMP_FORCE,
  BOSS_SPEED,
  PLAYER_ATTACK_RANGE,
  PLAYER_ATTACK_DAMAGE,
  BOSS_ATTACK_RANGE,
  BOSS_ATTACK_DAMAGE,
  SPECIAL_ATTACK_DAMAGE,
  SPECIAL_ATTACK_COOLDOWN,
  INVINCIBILITY_TIME,
  ATTACK_DURATION,
  HURT_DURATION,
  DEATH_DURATION,
  BOSS_HP,
  PLAYER_HP,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
} from './constants';
import { LEVELS, BOSS_DIALOGUES, MCQ_QUESTIONS, LEVEL_MONSTERS } from './levels';
import { heroSounds, createBossSounds, playSound } from './assets';

// Monster configurations
const MONSTER_CONFIG: Record<MonsterType, { width: number; height: number; hp: number; speed: number; damage: number; color: string }> = {
  slime: { width: 32, height: 24, hp: 20, speed: 1, damage: 5, color: '#44cc44' },
  bat: { width: 28, height: 20, hp: 15, speed: 2.5, damage: 8, color: '#8844aa' },
  ghost: { width: 36, height: 40, hp: 25, speed: 1.5, damage: 10, color: '#aaaaee' },
  shadow: { width: 40, height: 48, hp: 30, speed: 2, damage: 12, color: '#333355' },
};

// Create initial player
const createPlayer = (): Player => ({
  x: 100,
  y: GROUND_Y - PLAYER_HEIGHT,
  vx: 0,
  vy: 0,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  hp: PLAYER_HP,
  maxHp: PLAYER_HP,
  state: 'idle',
  facing: 'right',
  animationFrame: 0,
  stateTimer: 0,
  invincible: false,
  invincibleTimer: 0,
  hasSpecialAttack: false,
  specialCooldown: 0,
});

// Create monster
const createMonster = (type: MonsterType, x: number): Monster => {
  const config = MONSTER_CONFIG[type];
  return {
    id: `monster-${Date.now()}-${Math.random()}`,
    x,
    y: type === 'bat' ? GROUND_Y - 100 : GROUND_Y - config.height,
    vx: 0,
    vy: 0,
    width: config.width,
    height: config.height,
    hp: config.hp,
    maxHp: config.hp,
    state: 'idle',
    facing: 'left',
    animationFrame: 0,
    stateTimer: 0,
    invincible: false,
    invincibleTimer: 0,
    type,
    attackCooldown: 1000 + Math.random() * 1000,
    defeated: false,
    damage: config.damage,
  };
};

// Create boss
const createBoss = (type: BossType): Boss => {
  const size = type === 'final' ? 80 : 64;
  const dialogues = BOSS_DIALOGUES[type] || [];
  
  return {
    x: GAME_WIDTH - 200,
    y: GROUND_Y - size,
    vx: 0,
    vy: 0,
    width: size,
    height: size,
    hp: BOSS_HP[type] || 100,
    maxHp: BOSS_HP[type] || 100,
    state: 'idle',
    facing: 'left',
    animationFrame: 0,
    stateTimer: 0,
    invincible: false,
    invincibleTimer: 0,
    type,
    phase: 0,
    attackCooldown: 2000,
    dialogueTriggers: dialogues.map(d => ({ ...d, triggered: false })),
    defeated: false,
    isAlly: type === 'garima',
    allyPhase: type === 'garima' ? 'friendly' : undefined,
  };
};

// Spawn monsters for a level
const spawnMonsters = (levelId: string): Monster[] => {
  const spawns = LEVEL_MONSTERS[levelId];
  if (!spawns) return [];
  
  const monsters: Monster[] = [];
  spawns.forEach(spawn => {
    for (let i = 0; i < spawn.count; i++) {
      const x = 300 + Math.random() * (GAME_WIDTH - 500);
      monsters.push(createMonster(spawn.type, x));
    }
  });
  return monsters;
};

// Initial game state
const createInitialState = (): GameState => ({
  phase: 'title',
  currentLevel: 0,
  player: createPlayer(),
  boss: null,
  monsters: [],
  effects: [],
  dialogue: null,
  mcq: null,
  screenShake: 0,
  score: 0,
  elapsedTime: 0,
  canAttackBoss: true,
  ravinQuestionThresholds: [75, 50, 25, 0], // Ask question at each 25% HP loss
});

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const keysRef = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const dialogueTimerRef = useRef<number>(0);
  const ambientTimerRef = useRef<number>(0);
  const usedQuestionsRef = useRef<Set<number>>(new Set());

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      
      // Prevent default for game keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'KeyX', 'KeyZ'].includes(e.code)) {
        e.preventDefault();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setGameState(() => ({
      ...createInitialState(),
      phase: 'prologue',
      currentLevel: 0,
    }));
    dialogueTimerRef.current = 0;
    usedQuestionsRef.current = new Set();
  }, []);

  // Start level
  const startLevel = useCallback((levelIndex: number) => {
    const level = LEVELS[levelIndex];
    if (!level) return;
    
    setGameState(prevGameState => {
      // Preserve special attack status between levels
      const newPlayer = createPlayer();
      // Keep special attack if already unlocked
      if (prevGameState.player.hasSpecialAttack) {
        newPlayer.hasSpecialAttack = true;
        newPlayer.specialCooldown = 0;
      }
      
      const newBoss = level.hasBoss && level.bossType ? createBoss(level.bossType) : null;
      
      const newState: GameState = {
        ...prevGameState,
        phase: 'playing',
        currentLevel: levelIndex,
        player: newPlayer,
        boss: newBoss,
        monsters: spawnMonsters(level.id),
        effects: [],
        dialogue: null,
        mcq: null,
        screenShake: 0,
        elapsedTime: 0,
        canAttackBoss: level.bossType !== 'garima', // Garima starts as ally
        ravinQuestionThresholds: [75, 50, 25, 0],
      };
      
      // Show intro dialogue if exists
      if (level.introTexts && level.introTexts.length > 0) {
        newState.phase = 'dialogue';
        newState.dialogue = {
          speaker: 'narrator',
          text: level.introTexts[0],
          style: 'normal',
        };
        dialogueTimerRef.current = 0;
      }
      
      // Show boss intro
      if (newBoss) {
        const introDialogue = newBoss.dialogueTriggers.find(d => d.condition === 'intro');
        if (introDialogue) {
          newState.phase = 'dialogue';
          newState.dialogue = {
            speaker: 'boss',
            text: introDialogue.text,
            style: 'normal',
          };
          introDialogue.triggered = true;
          dialogueTimerRef.current = 0;
          
          const bossSounds = createBossSounds(newBoss.type);
          if (bossSounds.intro) playSound(bossSounds.intro);
        }
      }
      
      ambientTimerRef.current = 0;
      return newState;
    });
  }, []);

  // Handle attack
  const handleAttack = useCallback(() => {
    setGameState(prev => {
      if (prev.player.state !== 'idle' && prev.player.state !== 'walk') return prev;
      
      const newPlayer = { ...prev.player, state: 'attack' as CharacterState, stateTimer: 0 };
      playSound(heroSounds.attack);
      
      let newBoss = prev.boss;
      const newEffects = [...prev.effects];
      let newMonsters = [...prev.monsters];
      
      const attackX = prev.player.facing === 'right' 
        ? prev.player.x + prev.player.width 
        : prev.player.x - PLAYER_ATTACK_RANGE;
      
      // Check hit on monsters
      newMonsters = newMonsters.map(monster => {
        if (monster.defeated || monster.invincible) return monster;
        
        const hitMonster = attackX < monster.x + monster.width &&
                          attackX + PLAYER_ATTACK_RANGE > monster.x &&
                          prev.player.y < monster.y + monster.height &&
                          prev.player.y + prev.player.height > monster.y;
        
        if (hitMonster) {
          newEffects.push({
            id: `hit-${Date.now()}-${Math.random()}`,
            type: 'hit',
            x: monster.x + monster.width / 2,
            y: monster.y + monster.height / 2,
            radius: 0,
            maxRadius: 20,
            color: '#ffffff',
            duration: 150,
            elapsed: 0,
          });
          
          const newHp = monster.hp - PLAYER_ATTACK_DAMAGE;
          if (newHp <= 0) {
            return { ...monster, hp: 0, state: 'death' as CharacterState, stateTimer: 0, defeated: true };
          }
          return { ...monster, hp: newHp, state: 'hurt' as CharacterState, stateTimer: 0, invincible: true };
        }
        return monster;
      });
      
      // Check hit on boss
      if (newBoss && !newBoss.invincible && newBoss.state !== 'death' && !newBoss.defeated && prev.canAttackBoss) {
        const hitBoss = attackX < newBoss.x + newBoss.width &&
                        attackX + PLAYER_ATTACK_RANGE > newBoss.x &&
                        prev.player.y < newBoss.y + newBoss.height &&
                        prev.player.y + prev.player.height > newBoss.y;
        
        if (hitBoss) {
          newBoss = {
            ...newBoss,
            hp: newBoss.hp - PLAYER_ATTACK_DAMAGE,
            state: 'hurt' as CharacterState,
            stateTimer: 0,
            invincible: true,
            invincibleTimer: 0,
          };
          
          newEffects.push({
            id: `hit-${Date.now()}`,
            type: 'hit',
            x: newBoss.x + newBoss.width / 2,
            y: newBoss.y + newBoss.height / 2,
            radius: 0,
            maxRadius: 30,
            color: '#ffffff',
            duration: 200,
            elapsed: 0,
          });
          
          const bossSounds = createBossSounds(newBoss.type);
          playSound(bossSounds.hurt);
        }
      }
      
      return { ...prev, player: newPlayer, boss: newBoss, effects: newEffects, monsters: newMonsters };
    });
  }, []);

  // Handle special attack (DIARRHEA)
  const handleSpecialAttack = useCallback(() => {
    setGameState(prev => {
      if (!prev.player.hasSpecialAttack) return prev;
      if (prev.player.specialCooldown > 0) return prev;
      if (prev.player.state !== 'idle' && prev.player.state !== 'walk') return prev;
      
      const newPlayer = {
        ...prev.player,
        state: 'special' as CharacterState,
        stateTimer: 0,
        specialCooldown: SPECIAL_ATTACK_COOLDOWN,
      };
      
      playSound(heroSounds.special);
      
      const newEffects = [...prev.effects];
      const playerCenterX = prev.player.x + prev.player.width / 2;
      
      // Add special effect
      newEffects.push({
        id: `special-${Date.now()}`,
        type: 'special',
        x: playerCenterX,
        y: GROUND_Y,
        radius: 0,
        maxRadius: 250,
        color: '#8b6914',
        duration: 600,
        elapsed: 0,
        damage: SPECIAL_ATTACK_DAMAGE,
      });
      
      // Damage all monsters in range
      let newMonsters = prev.monsters.map(monster => {
        if (monster.defeated) return monster;
        const dist = Math.abs((monster.x + monster.width / 2) - playerCenterX);
        if (dist < 250) {
          const newHp = monster.hp - SPECIAL_ATTACK_DAMAGE;
          if (newHp <= 0) {
            return { ...monster, hp: 0, state: 'death' as CharacterState, stateTimer: 0, defeated: true };
          }
          return { ...monster, hp: newHp, state: 'hurt' as CharacterState, stateTimer: 0 };
        }
        return monster;
      });
      
      // Damage boss if in range
      let newBoss = prev.boss;
      if (newBoss && !newBoss.defeated && prev.canAttackBoss) {
        const dist = Math.abs((newBoss.x + newBoss.width / 2) - playerCenterX);
        if (dist < 250) {
          newBoss = {
            ...newBoss,
            hp: newBoss.hp - SPECIAL_ATTACK_DAMAGE,
            state: 'hurt' as CharacterState,
            stateTimer: 0,
          };
        }
      }
      
      return {
        ...prev,
        player: newPlayer,
        boss: newBoss,
        monsters: newMonsters,
        effects: newEffects,
        screenShake: 25,
      };
    });
  }, []);

  // Get random unused question
  const getRandomQuestion = useCallback(() => {
    const availableIndices = Array.from({ length: MCQ_QUESTIONS.length }, (_, i) => i)
      .filter(i => !usedQuestionsRef.current.has(i));
    
    if (availableIndices.length === 0) {
      usedQuestionsRef.current = new Set();
      return MCQ_QUESTIONS[Math.floor(Math.random() * MCQ_QUESTIONS.length)];
    }
    
    const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedQuestionsRef.current.add(randomIdx);
    return MCQ_QUESTIONS[randomIdx];
  }, []);

  // Handle MCQ answer
  const handleMCQAnswer = useCallback((index: number) => {
    setGameState(prev => {
      if (!prev.mcq) return prev;
      
      const isCorrect = index === prev.mcq.correctIndex;
      
      if (isCorrect) {
        // Stun boss
        const newBoss = prev.boss ? {
          ...prev.boss,
          state: 'hurt' as CharacterState,
          stateTimer: 0,
          invincible: false,
        } : null;
        
        return {
          ...prev,
          phase: 'playing',
          mcq: null,
          boss: newBoss,
          dialogue: {
            speaker: 'system',
            text: 'Correct! Boss stunned!',
            style: 'flash',
          },
        };
      } else {
        // Damage player
        const newPlayer = {
          ...prev.player,
          hp: prev.player.hp - 20,
          state: 'hurt' as CharacterState,
          stateTimer: 0,
        };
        
        playSound(heroSounds.hurt);
        
        return {
          ...prev,
          phase: 'playing',
          mcq: null,
          player: newPlayer,
          dialogue: {
            speaker: 'system',
            text: 'Wrong answer! You take damage!',
            style: 'flash',
          },
          screenShake: 10,
        };
      }
    });
  }, []);

  // Dismiss dialogue
  const dismissDialogue = useCallback(() => {
    setGameState(prev => {
      if (prev.phase === 'dialogue') {
        // Check if there are more intro texts
        const level = LEVELS[prev.currentLevel];
        if (level?.introTexts) {
          const currentIndex = level.introTexts.indexOf(prev.dialogue?.text || '');
          if (currentIndex >= 0 && currentIndex < level.introTexts.length - 1) {
            return {
              ...prev,
              dialogue: {
                speaker: 'narrator',
                text: level.introTexts[currentIndex + 1],
                style: 'normal',
              },
            };
          }
        }
        return { ...prev, phase: 'playing', dialogue: null };
      }
      return { ...prev, dialogue: null };
    });
  }, []);

  // Next level
  const nextLevel = useCallback(() => {
    setGameState(prevState => {
      const nextIndex = prevState.currentLevel + 1;
      if (nextIndex >= LEVELS.length) {
        return { ...prevState, phase: 'victory' };
      }
      // Trigger startLevel for next level
      setTimeout(() => startLevel(nextIndex), 0);
      return { ...prevState, phase: 'playing' };
    });
  }, [startLevel]);

  // Restart
  const restart = useCallback(() => {
    usedQuestionsRef.current = new Set();
    setGameState(createInitialState());
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      const deltaTime = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;
      
      setGameState(prev => {
        if (prev.phase !== 'playing') return prev;
        
        const newState = { ...prev };
        const keys = keysRef.current;
        
        // Update player
        const player = { ...newState.player };
        
        // Handle input
        if (player.state === 'idle' || player.state === 'walk' || player.state === 'jump') {
          // Movement
          if (keys.has('ArrowLeft')) {
            player.vx = -PLAYER_SPEED;
            player.facing = 'left';
            if (player.state !== 'jump') player.state = 'walk';
          } else if (keys.has('ArrowRight')) {
            player.vx = PLAYER_SPEED;
            player.facing = 'right';
            if (player.state !== 'jump') player.state = 'walk';
          } else {
            player.vx = 0;
            if (player.state !== 'jump') player.state = 'idle';
          }
          
          // Jump
          if ((keys.has('ArrowUp') || keys.has('Space')) && player.y >= GROUND_Y - player.height) {
            player.vy = PLAYER_JUMP_FORCE;
            player.state = 'jump';
            playSound(heroSounds.jump);
          }
          
          // Attack (Z key) - handled via callback
          if (keys.has('KeyZ')) {
            keys.delete('KeyZ');
            handleAttack();
          }
          
          // Special attack (X key) - handle inline for better state sync
          if (keys.has('KeyX')) {
            keys.delete('KeyX');
            
            // Check if special attack can be used
            if (player.hasSpecialAttack && player.specialCooldown <= 0) {
              player.state = 'special';
              player.stateTimer = 0;
              player.specialCooldown = SPECIAL_ATTACK_COOLDOWN;
              
              playSound(heroSounds.special);
              
              const playerCenterX = player.x + player.width / 2;
              
              // Add special effect
              newState.effects.push({
                id: `special-${Date.now()}`,
                type: 'special',
                x: playerCenterX,
                y: GROUND_Y,
                radius: 0,
                maxRadius: 250,
                color: '#8b6914',
                duration: 600,
                elapsed: 0,
                damage: SPECIAL_ATTACK_DAMAGE,
              });
              
              // Damage all monsters in range
              newState.monsters = newState.monsters.map(monster => {
                if (monster.defeated) return monster;
                const dist = Math.abs((monster.x + monster.width / 2) - playerCenterX);
                if (dist < 250) {
                  const newHp = monster.hp - SPECIAL_ATTACK_DAMAGE;
                  if (newHp <= 0) {
                    return { ...monster, hp: 0, state: 'death' as CharacterState, stateTimer: 0, defeated: true };
                  }
                  return { ...monster, hp: newHp, state: 'hurt' as CharacterState, stateTimer: 0 };
                }
                return monster;
              });
              
              // Damage boss if in range
              if (newState.boss && !newState.boss.defeated && newState.canAttackBoss) {
                const bossCenterX = newState.boss.x + newState.boss.width / 2;
                const dist = Math.abs(bossCenterX - playerCenterX);
                if (dist < 250) {
                  newState.boss = {
                    ...newState.boss,
                    hp: newState.boss.hp - SPECIAL_ATTACK_DAMAGE,
                    state: 'hurt' as CharacterState,
                    stateTimer: 0,
                  };
                }
              }
              
              newState.screenShake = 25;
            }
          }
        }
        
        // Apply physics
        player.vy += GRAVITY;
        player.x += player.vx;
        player.y += player.vy;
        
        // Ground collision
        if (player.y >= GROUND_Y - player.height) {
          player.y = GROUND_Y - player.height;
          player.vy = 0;
          if (player.state === 'jump') player.state = 'idle';
        }
        
        // Bounds
        player.x = Math.max(0, Math.min(GAME_WIDTH - player.width, player.x));
        
        // Update state timer
        player.stateTimer += deltaTime;
        
        // Handle state transitions
        if (player.state === 'attack' && player.stateTimer > ATTACK_DURATION) {
          player.state = 'idle';
          player.stateTimer = 0;
        }
        if (player.state === 'hurt' && player.stateTimer > HURT_DURATION) {
          player.state = 'idle';
          player.stateTimer = 0;
        }
        if (player.state === 'special' && player.stateTimer > 600) {
          player.state = 'idle';
          player.stateTimer = 0;
        }
        
        // Update invincibility
        if (player.invincible) {
          player.invincibleTimer += deltaTime;
          if (player.invincibleTimer > INVINCIBILITY_TIME) {
            player.invincible = false;
            player.invincibleTimer = 0;
          }
        }
        
        // Update special cooldown
        if (player.specialCooldown > 0) {
          player.specialCooldown -= deltaTime;
        }
        
        // Update animation frame
        player.animationFrame = Math.floor(player.stateTimer / 150) % 4;
        
        // Check player death
        if (player.hp <= 0 && player.state !== 'death') {
          player.state = 'death';
          player.stateTimer = 0;
          playSound(heroSounds.death);
        }
        
        if (player.state === 'death' && player.stateTimer > DEATH_DURATION) {
          return { ...newState, phase: 'game_over', player };
        }
        
        newState.player = player;
        
        // Update monsters
        let monsters = newState.monsters.map(monster => {
          if (monster.defeated) {
            monster.stateTimer += deltaTime;
            if (monster.state === 'death' && monster.stateTimer > DEATH_DURATION) {
              return null; // Remove dead monster
            }
            return monster;
          }
          
          const m = { ...monster };
          
          // Monster AI
          if (m.state === 'idle' || m.state === 'walk') {
            const config = MONSTER_CONFIG[m.type];
            const dx = player.x - m.x;
            
            // Move towards player
            if (Math.abs(dx) > 50) {
              m.vx = dx > 0 ? config.speed : -config.speed;
              m.facing = dx > 0 ? 'right' : 'left';
              m.state = 'walk';
            } else {
              m.vx = 0;
              m.state = 'idle';
              
              // Attack player
              m.attackCooldown -= deltaTime;
              if (m.attackCooldown <= 0 && !player.invincible && player.state !== 'death') {
                // Deal damage
                if (Math.abs(player.x - m.x) < 60 && Math.abs(player.y - m.y) < 50) {
                  player.hp -= m.damage;
                  player.state = 'hurt';
                  player.stateTimer = 0;
                  player.invincible = true;
                  player.invincibleTimer = 0;
                  newState.screenShake = 5;
                  playSound(heroSounds.hurt);
                }
                m.attackCooldown = 1500 + Math.random() * 1000;
              }
            }
            
            // Bats float
            if (m.type === 'bat') {
              m.y = GROUND_Y - 80 + Math.sin(Date.now() / 300) * 20;
            }
          }
          
          // Apply physics
          m.x += m.vx;
          if (m.type !== 'bat' && m.type !== 'ghost') {
            m.y += m.vy;
            m.vy += GRAVITY * 0.5;
            if (m.y >= GROUND_Y - m.height) {
              m.y = GROUND_Y - m.height;
              m.vy = 0;
            }
          }
          
          // Bounds
          m.x = Math.max(0, Math.min(GAME_WIDTH - m.width, m.x));
          
          // Update state timer
          m.stateTimer += deltaTime;
          
          if (m.state === 'hurt' && m.stateTimer > HURT_DURATION / 2) {
            m.state = 'idle';
            m.stateTimer = 0;
            m.invincible = false;
          }
          
          // Update invincibility
          if (m.invincible) {
            m.invincibleTimer += deltaTime;
            if (m.invincibleTimer > INVINCIBILITY_TIME / 3) {
              m.invincible = false;
              m.invincibleTimer = 0;
            }
          }
          
          m.animationFrame = Math.floor(m.stateTimer / 150) % 4;
          
          return m;
        }).filter(m => m !== null) as Monster[];
        
        newState.monsters = monsters;
        newState.player = player;
        
        // Update boss
        if (newState.boss) {
          const boss = { ...newState.boss };
          
          // If boss is defeated, only update death animation timer
          if (boss.defeated) {
            boss.stateTimer += deltaTime;
            boss.animationFrame = Math.floor(boss.stateTimer / 150) % 4;
            
            if (boss.state === 'death' && boss.stateTimer > DEATH_DURATION) {
              newState.phase = 'level_complete';
              newState.score += 1000;
            }
            
            newState.boss = boss;
          } else {
            // Garima special behavior - ally phase
            // Use elapsedTime to track time since level start
            if (boss.type === 'garima') {
              // After 5 seconds, transition to combat
              if (boss.allyPhase === 'friendly' && newState.elapsedTime >= 5000) {
                boss.allyPhase = 'combat';
                boss.attackCooldown = 500;
                newState.canAttackBoss = true;
                newState.dialogue = {
                  speaker: 'boss',
                  text: 'I helped you... so why are you so gorgeous?',
                  style: 'glitch',
                };
                newState.screenShake = 10;
              }
              
              if (boss.allyPhase === 'friendly') {
                // Friendly phase - walk towards player but don't attack
                const dx = player.x - boss.x;
                boss.facing = dx > 0 ? 'right' : 'left';
                
                // Move towards player slowly
                if (Math.abs(dx) > 60) {
                  boss.vx = dx > 0 ? BOSS_SPEED * 0.5 : -BOSS_SPEED * 0.5;
                  boss.state = 'walk';
                } else {
                  boss.vx = 0;
                  boss.state = 'idle';
                  
                  // Trigger hug dialogue when close (only once)
                  const hugTrigger = boss.dialogueTriggers.find(d => d.hpThreshold === 95);
                  if (hugTrigger && !hugTrigger.triggered) {
                    hugTrigger.triggered = true;
                    newState.dialogue = {
                      speaker: 'boss',
                      text: hugTrigger.text,
                      style: 'normal',
                    };
                  }
                }
              } else if (boss.allyPhase === 'combat') {
                // Normal boss AI - Garima attacks
                if (boss.state === 'idle' || boss.state === 'walk') {
                  boss.attackCooldown -= deltaTime;
                  
                  const dx = player.x - boss.x;
                  if (Math.abs(dx) > BOSS_ATTACK_RANGE) {
                    boss.vx = dx > 0 ? BOSS_SPEED : -BOSS_SPEED;
                    boss.facing = dx > 0 ? 'right' : 'left';
                    boss.state = 'walk';
                  } else {
                    boss.vx = 0;
                    boss.state = 'idle';
                    
                    if (boss.attackCooldown <= 0) {
                      boss.state = 'attack';
                      boss.stateTimer = 0;
                      boss.attackCooldown = 2000 + Math.random() * 1000;
                      
                      const bossSounds = createBossSounds(boss.type);
                      playSound(bossSounds.attack);
                    }
                  }
                }
              }
            } else {
              // Normal boss AI
              if (boss.state === 'idle' || boss.state === 'walk') {
                boss.attackCooldown -= deltaTime;
                
                // Move towards player
                const dx = player.x - boss.x;
                if (Math.abs(dx) > BOSS_ATTACK_RANGE) {
                  boss.vx = dx > 0 ? BOSS_SPEED : -BOSS_SPEED;
                  boss.facing = dx > 0 ? 'right' : 'left';
                  boss.state = 'walk';
                } else {
                  boss.vx = 0;
                  boss.state = 'idle';
                  
                  // Attack
                  if (boss.attackCooldown <= 0) {
                    boss.state = 'attack';
                    boss.stateTimer = 0;
                    boss.attackCooldown = 2000 + Math.random() * 1000;
                    
                    const bossSounds = createBossSounds(boss.type);
                    playSound(bossSounds.attack);
                  }
                }
                
                // Harsh special behavior: random confusion
                if (boss.type === 'harsh' && Math.random() < 0.01) {
                  boss.vx = -boss.vx;
                  boss.facing = boss.facing === 'left' ? 'right' : 'left';
                  
                  // Random dialogue
                  const randomDialogues = boss.dialogueTriggers.filter(d => d.condition === 'random' && !d.triggered);
                  if (randomDialogues.length > 0 && Math.random() < 0.3) {
                    const dialogue = randomDialogues[Math.floor(Math.random() * randomDialogues.length)];
                    newState.dialogue = { speaker: 'boss', text: dialogue.text, style: 'glitch' };
                  }
                }
                
                // Parnika special behavior: constant dialogue spam
                if (boss.type === 'parnika' && Math.random() < 0.02) {
                  const randomDialogues = boss.dialogueTriggers.filter(d => d.condition === 'random');
                  if (randomDialogues.length > 0) {
                    const dialogue = randomDialogues[Math.floor(Math.random() * randomDialogues.length)]
                    newState.dialogue = { speaker: 'boss', text: dialogue.text, style: 'normal' };
                  }
                }
                
                // Ravin MCQ trigger at 25% HP intervals
                if (boss.type === 'ravin') {
                  const hpPercent = (boss.hp / boss.maxHp) * 100;
                  const thresholds = [...newState.ravinQuestionThresholds];
                  
                  // Check if we've crossed a threshold
                  for (let i = 0; i < thresholds.length; i++) {
                    if (hpPercent <= thresholds[i] && thresholds[i] > -1) {
                      // Mark this threshold as used
                      thresholds[i] = -1;
                      newState.ravinQuestionThresholds = thresholds;
                      
                      // Show question
                      newState.phase = 'mcq';
                      newState.mcq = getRandomQuestion();
                      boss.attackCooldown = 3000;
                      break;
                    }
                  }
                }
              }
            }
            
            // Boss attack hit detection
            if (boss.state === 'attack' && boss.stateTimer > 100 && boss.stateTimer < 200) {
              if (!player.invincible && player.state !== 'death') {
                const attackX = boss.facing === 'right'
                  ? boss.x + boss.width
                  : boss.x - BOSS_ATTACK_RANGE;
                
                const hitPlayer = attackX < player.x + player.width &&
                                 attackX + BOSS_ATTACK_RANGE > player.x &&
                                 boss.y < player.y + player.height &&
                                 boss.y + boss.height > player.y;
                
                if (hitPlayer) {
                  player.hp -= BOSS_ATTACK_DAMAGE;
                  player.state = 'hurt';
                  player.stateTimer = 0;
                  player.invincible = true;
                  player.invincibleTimer = 0;
                  newState.screenShake = 10;
                  playSound(heroSounds.hurt);
                  newState.player = player;
                }
              }
            }
            
            // Apply physics
            boss.x += boss.vx;
            boss.y += boss.vy;
            boss.x = Math.max(0, Math.min(GAME_WIDTH - boss.width, boss.x));
            
            // Update state timer
            boss.stateTimer += deltaTime;
            
            // Handle state transitions
            if (boss.state === 'attack' && boss.stateTimer > ATTACK_DURATION) {
              boss.state = 'idle';
              boss.stateTimer = 0;
            }
            if (boss.state === 'hurt' && boss.stateTimer > HURT_DURATION) {
              boss.state = 'idle';
              boss.stateTimer = 0;
              boss.invincible = false;
            }
            
            // Update invincibility
            if (boss.invincible) {
              boss.invincibleTimer += deltaTime;
              if (boss.invincibleTimer > INVINCIBILITY_TIME / 2) {
                boss.invincible = false;
                boss.invincibleTimer = 0;
              }
            }
            
            // Check HP thresholds for dialogues
            boss.dialogueTriggers.forEach(trigger => {
              if (trigger.condition === 'hp_threshold' && !trigger.triggered && trigger.hpThreshold) {
                const hpPercent = (boss.hp / boss.maxHp) * 100;
                if (hpPercent <= trigger.hpThreshold && trigger.hpThreshold !== 95) {
                  trigger.triggered = true;
                  newState.dialogue = {
                    speaker: 'boss',
                    text: trigger.text,
                    style: 'glitch',
                  };
                  
                  // Unlock special attack on Garima fight
                  if (boss.type === 'garima' && hpPercent <= 30 && !player.hasSpecialAttack) {
                    const specialTrigger = boss.dialogueTriggers.find(t => t.condition === 'special_unlock');
                    if (specialTrigger && !specialTrigger.triggered) {
                      specialTrigger.triggered = true;
                      player.hasSpecialAttack = true;
                      newState.player = player;
                      newState.dialogue = {
                        speaker: 'system',
                        text: '💥 DIARRHEA UNLOCKED 💥',
                        style: 'big',
                      };
                      newState.screenShake = 15;
                    }
                  }
                }
              }
            });
            
            // Check boss death
            if (boss.hp <= 0 && boss.state !== 'death') {
              boss.state = 'death';
              boss.stateTimer = 0;
              boss.defeated = true;
              
              const defeatDialogue = boss.dialogueTriggers.find(d => d.condition === 'defeat');
              if (defeatDialogue) {
                newState.dialogue = {
                  speaker: 'boss',
                  text: defeatDialogue.text,
                  style: 'big',
                };
              }
              
              const bossSounds = createBossSounds(boss.type);
              playSound(bossSounds.death);
              
              newState.effects.push({
                id: `explosion-${Date.now()}`,
                type: 'explosion',
                x: boss.x + boss.width / 2,
                y: boss.y + boss.height / 2,
                radius: 0,
                maxRadius: 100,
                color: '#ff4444',
                duration: 500,
                elapsed: 0,
              });
            }
            
            boss.animationFrame = Math.floor(boss.stateTimer / 150) % 4;
            newState.boss = boss;
          }
        }
        
        // Update effects
        newState.effects = newState.effects.filter(effect => {
          effect.elapsed += deltaTime;
          effect.radius = (effect.elapsed / effect.duration) * effect.maxRadius;
          return effect.elapsed < effect.duration;
        });
        
        // Update screen shake
        if (newState.screenShake > 0) {
          newState.screenShake -= deltaTime * 0.05;
          if (newState.screenShake < 0) newState.screenShake = 0;
        }
        
        // Always update elapsed time
        newState.elapsedTime += deltaTime;
        
        // Level without boss - check if all monsters are defeated or time elapsed
        const currentLevel = LEVELS[newState.currentLevel];
        if (!currentLevel?.hasBoss) {
          
          // Show ambient texts
          if (currentLevel?.ambientTexts && currentLevel.ambientTexts.length > 0) {
            ambientTimerRef.current += deltaTime;
            if (ambientTimerRef.current > 5000 && !newState.dialogue) {
              const text = currentLevel.ambientTexts[Math.floor(Math.random() * currentLevel.ambientTexts.length)];
              newState.dialogue = { speaker: 'narrator', text, style: 'normal' };
              ambientTimerRef.current = 0;
            }
          }
          
          // Check if all monsters are defeated
          const allMonstersDefeated = newState.monsters.every(m => m.defeated) || newState.monsters.length === 0;
          
          // Complete level after all monsters defeated or time elapsed
          if ((allMonstersDefeated && newState.elapsedTime > 3000) || newState.elapsedTime > 15000) {
            newState.phase = 'level_complete';
            newState.score += 500;
          }
        }
        
        return newState;
      });
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleAttack, handleSpecialAttack, getRandomQuestion]);

  return {
    gameState,
    startGame,
    startLevel,
    handleAttack,
    handleSpecialAttack,
    handleMCQAnswer,
    dismissDialogue,
    nextLevel,
    restart,
  };
};
