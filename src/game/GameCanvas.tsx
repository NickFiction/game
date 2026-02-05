import React, { useRef, useEffect } from 'react';
import { GameState } from './types';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, GROUND_HEIGHT } from './constants';
import { LEVELS } from './levels';
import { heroAssets, createBossAssets, renderAsset } from './assets';
import { 
  getHeroImage, 
  getBossImage, 
  getMonsterImage, 
  getBackgroundImage 
} from '../imageLoader';

interface GameCanvasProps {
  gameState: GameState;
}

// Image scaling factor for PNG images
const IMAGE_SCALE = 2.5;

// Helper function to draw scaled images
const drawScaledImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  flipX: boolean = false
): void => {
  const scaledWidth = width * IMAGE_SCALE;
  const scaledHeight = height * IMAGE_SCALE;
  const offsetX = (scaledWidth - width) / 2;
  const offsetY = (scaledHeight - height) / 2;
  
  ctx.save();
  if (flipX) {
    ctx.translate(x + scaledWidth, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, -offsetY, scaledWidth, scaledHeight);
  } else {
    ctx.drawImage(img, x - offsetX, y - offsetY, scaledWidth, scaledHeight);
  }
  ctx.restore();
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Apply screen shake
    const shakeX = gameState.screenShake > 0 ? (Math.random() - 0.5) * gameState.screenShake : 0;
    const shakeY = gameState.screenShake > 0 ? (Math.random() - 0.5) * gameState.screenShake : 0;
    
    ctx.save();
    ctx.translate(shakeX, shakeY);
    
    // Get current level
    const currentLevel = LEVELS[gameState.currentLevel];
    
    // Try to draw custom background image
    const bgImage = getBackgroundImage(gameState.currentLevel);
    if (bgImage && bgImage.complete) {
      ctx.drawImage(bgImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else {
      // Fallback to solid color
      ctx.fillStyle = currentLevel?.backgroundColor || '#1a1a2e';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    
    // Draw parallax background elements (placeholder)
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for (let i = 0; i < 20; i++) {
      const x = (i * 80 + gameState.elapsedTime * 0.01) % GAME_WIDTH;
      const y = 50 + Math.sin(i) * 30;
      ctx.fillRect(x, y, 40, 60);
    }
    
    // Draw ground
    ctx.fillStyle = currentLevel?.groundColor || '#2d4a3e';
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GROUND_HEIGHT);
    
    // Ground detail
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, 4);
    
    // Draw grass/details
    ctx.fillStyle = 'rgba(100,150,100,0.5)';
    for (let i = 0; i < GAME_WIDTH; i += 8) {
      const h = 4 + Math.sin(i * 0.5) * 2;
      ctx.fillRect(i, GROUND_Y - h, 4, h);
    }
    
    // Draw effects (behind characters)
    gameState.effects.forEach(effect => {
      ctx.save();
      ctx.globalAlpha = 1 - effect.elapsed / effect.duration;
      
      if (effect.type === 'special') {
        // DIARRHEA effect - expanding wave
        const gradient = ctx.createRadialGradient(
          effect.x, effect.y, 0,
          effect.x, effect.y, effect.radius
        );
        gradient.addColorStop(0, 'rgba(139, 105, 20, 0.8)');
        gradient.addColorStop(0.5, 'rgba(160, 120, 32, 0.5)');
        gradient.addColorStop(1, 'rgba(192, 144, 48, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(effect.x, effect.y, effect.radius, effect.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === 'explosion') {
        // Pixel explosion
        ctx.fillStyle = effect.color;
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2;
          const dist = effect.radius * (0.5 + Math.random() * 0.5);
          const px = effect.x + Math.cos(angle) * dist;
          const py = effect.y + Math.sin(angle) * dist;
          ctx.fillRect(px - 4, py - 4, 8, 8);
        }
      } else if (effect.type === 'hit') {
        // Hit flash
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === 'glitch') {
        // Glitch effect
        ctx.fillStyle = '#00ff00';
        for (let i = 0; i < 10; i++) {
          ctx.fillRect(
            effect.x + (Math.random() - 0.5) * effect.radius * 2,
            effect.y + (Math.random() - 0.5) * effect.radius,
            Math.random() * 20,
            2
          );
        }
      }
      
      ctx.restore();
    });
    
    // Draw player
    const player = gameState.player;
    const playerAssets = heroAssets[player.state];
    const playerFrame = playerAssets[player.animationFrame % playerAssets.length];
    
    // Invincibility flicker
    if (!player.invincible || Math.floor(player.invincibleTimer / 50) % 2 === 0) {
      // Try to draw custom hero image
      const heroImg = getHeroImage(player.state);
      if (heroImg && heroImg.complete) {
        drawScaledImage(
          ctx,
          heroImg,
          player.x,
          player.y,
          player.width,
          player.height,
          player.facing === 'left'
        );
      } else {
        // Fallback to placeholder
        renderAsset(
          ctx,
          playerFrame.asset,
          player.x - (playerFrame.asset.width - player.width) / 2,
          player.y - (playerFrame.asset.height - player.height),
          player.facing === 'left'
        );
      }
      
      // Draw attack hitbox indicator
      if (player.state === 'attack') {
        ctx.fillStyle = 'rgba(255, 255, 100, 0.3)';
        const attackX = player.facing === 'right'
          ? player.x + player.width
          : player.x - 60;
        ctx.fillRect(attackX, player.y, 60, player.height);
      }
      
      // Draw special attack charging
      if (player.state === 'special') {
        ctx.fillStyle = 'rgba(139, 105, 20, 0.5)';
        ctx.beginPath();
        ctx.arc(
          player.x + player.width / 2,
          player.y + player.height,
          30 + Math.sin(player.stateTimer * 0.05) * 10,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
    
    // Draw HP bar for player
    const hpBarWidth = 50;
    const hpBarHeight = 6;
    ctx.fillStyle = '#333';
    ctx.fillRect(player.x - 9, player.y - 30, hpBarWidth + 2, hpBarHeight + 2);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(player.x - 8, player.y - 29, hpBarWidth * (player.hp / player.maxHp), hpBarHeight);
    
    // Special cooldown indicator
    if (player.hasSpecialAttack) {
      const cooldownPercent = Math.max(0, player.specialCooldown / 5000);
      ctx.fillStyle = cooldownPercent > 0 ? '#666' : '#8b6914';
      ctx.fillRect(player.x - 8, player.y - 22, hpBarWidth * (1 - cooldownPercent), 3);
    }
    
    // Draw monsters
    gameState.monsters.forEach(monster => {
      if (monster.defeated && monster.state === 'death' && monster.stateTimer > 500) return;
      
      // Monster colors based on type
      const monsterColors: Record<string, string> = {
        slime: '#44cc44',
        bat: '#8844aa',
        ghost: '#aaaaee',
        shadow: '#333355',
      };
      
      const color = monsterColors[monster.type] || '#888888';
      
      // Invincibility flicker
      if (monster.invincible && Math.floor(monster.invincibleTimer / 50) % 2 === 1) return;
      
      // Death fade
      const alpha = monster.state === 'death' ? 1 - monster.stateTimer / 500 : 1;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      
      // Try custom monster image first
      const monsterImg = getMonsterImage(monster.type);
      if (monsterImg && monsterImg.complete) {
        drawScaledImage(
          ctx,
          monsterImg,
          monster.x,
          monster.y,
          monster.width,
          monster.height,
          monster.facing === 'left'
        );
      } else {
        // Draw monster body (placeholder)
        ctx.fillStyle = color;
      
        if (monster.type === 'slime') {
          // Bouncy slime shape
          const squish = Math.sin(Date.now() / 200) * 4;
          ctx.beginPath();
          ctx.ellipse(
            monster.x + monster.width / 2,
            monster.y + monster.height - squish / 2,
            monster.width / 2,
            monster.height / 2 + squish,
            0, 0, Math.PI * 2
          );
          ctx.fill();
          // Eyes
          ctx.fillStyle = '#fff';
          ctx.fillRect(monster.x + 8, monster.y + 8, 6, 6);
          ctx.fillRect(monster.x + 18, monster.y + 8, 6, 6);
          ctx.fillStyle = '#000';
          ctx.fillRect(monster.x + 10, monster.y + 10, 3, 3);
          ctx.fillRect(monster.x + 20, monster.y + 10, 3, 3);
        } else if (monster.type === 'bat') {
          // Bat with wings
          const wingFlap = Math.sin(Date.now() / 100) * 8;
          ctx.fillRect(monster.x + 8, monster.y + 8, 12, 10);
          // Wings
          ctx.beginPath();
          ctx.moveTo(monster.x + 8, monster.y + 10);
          ctx.lineTo(monster.x - 5, monster.y + wingFlap);
          ctx.lineTo(monster.x + 8, monster.y + 15);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(monster.x + 20, monster.y + 10);
          ctx.lineTo(monster.x + 33, monster.y + wingFlap);
          ctx.lineTo(monster.x + 20, monster.y + 15);
          ctx.fill();
          // Eyes
          ctx.fillStyle = '#ff0';
          ctx.fillRect(monster.x + 10, monster.y + 10, 3, 3);
          ctx.fillRect(monster.x + 15, monster.y + 10, 3, 3);
        } else if (monster.type === 'ghost') {
          // Ghostly shape
          const float = Math.sin(Date.now() / 300) * 5;
          ctx.beginPath();
          ctx.ellipse(
            monster.x + monster.width / 2,
            monster.y + 15 + float,
            monster.width / 2,
            15,
            0, Math.PI, 0
          );
          ctx.fillRect(monster.x, monster.y + 15 + float, monster.width, 25);
          // Wavy bottom
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(
              monster.x + 5 + i * 9,
              monster.y + 40 + float,
              5,
              0, Math.PI
            );
            ctx.fill();
          }
          ctx.fill();
          // Eyes
          ctx.fillStyle = '#000';
          ctx.fillRect(monster.x + 10, monster.y + 18 + float, 6, 8);
          ctx.fillRect(monster.x + 22, monster.y + 18 + float, 6, 8);
        } else if (monster.type === 'shadow') {
          // Shadow creature
          ctx.fillStyle = '#222233';
          ctx.fillRect(monster.x, monster.y + 10, monster.width, monster.height - 10);
          ctx.fillStyle = color;
          ctx.fillRect(monster.x + 5, monster.y, monster.width - 10, 15);
          // Glowing eyes
          ctx.fillStyle = '#ff0044';
          ctx.fillRect(monster.x + 10, monster.y + 20, 8, 4);
          ctx.fillRect(monster.x + 24, monster.y + 20, 8, 4);
        }
      }
      
      // HP bar
      if (monster.hp < monster.maxHp && !monster.defeated) {
        ctx.fillStyle = '#333';
        ctx.fillRect(monster.x, monster.y - 8, monster.width, 4);
        ctx.fillStyle = '#44ff44';
        ctx.fillRect(monster.x, monster.y - 8, monster.width * (monster.hp / monster.maxHp), 4);
      }
      
      ctx.restore();
    });
    
    // Draw boss
    if (gameState.boss) {
      const boss = gameState.boss;
      const bossAssets = createBossAssets(boss.type);
      const bossStateAssets = bossAssets[boss.state];
      const bossFrame = bossStateAssets[boss.animationFrame % bossStateAssets.length];
      
      // Glitch effect for Harsh
      if (boss.type === 'harsh' && Math.random() < 0.05) {
        ctx.save();
        ctx.translate((Math.random() - 0.5) * 10, 0);
      }
      
      if (!boss.invincible || Math.floor(boss.invincibleTimer / 50) % 2 === 0) {
        // Try custom boss image first
        const bossImg = getBossImage(boss.type, boss.state);
        if (bossImg && bossImg.complete) {
          drawScaledImage(
            ctx,
            bossImg,
            boss.x,
            boss.y,
            boss.width,
            boss.height,
            boss.facing === 'left'
          );
        } else {
          // Fallback to placeholder
          renderAsset(
            ctx,
            bossFrame.asset,
            boss.x - (bossFrame.asset.width - boss.width) / 2,
            boss.y - (bossFrame.asset.height - boss.height),
            boss.facing === 'left'
          );
        }
        
        // Draw attack indicator
        if (boss.state === 'attack') {
          ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
          const attackX = boss.facing === 'right'
            ? boss.x + boss.width
            : boss.x - 80;
          ctx.fillRect(attackX, boss.y, 80, boss.height);
        }
      }
      
      if (boss.type === 'harsh') {
        ctx.restore();
      }
      
      // Draw boss HP bar
      const bossHpWidth = 100;
      const hpBarOffset = boss.type === 'ravin' ? 10 : 0; // Ravin's bar is higher
      ctx.fillStyle = '#333';
      ctx.fillRect(boss.x - 18, boss.y - 35 - hpBarOffset, bossHpWidth + 4, 12);
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(boss.x - 16, boss.y - 33 - hpBarOffset, bossHpWidth * (boss.hp / boss.maxHp), 8);
      
      // Boss name and status
      ctx.fillStyle = '#fff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      const bossLabel = boss.type === 'garima' && boss.allyPhase !== 'combat' 
        ? '💚 GARIMA (ALLY)' 
        : boss.type.toUpperCase();
      ctx.fillText(bossLabel, boss.x + boss.width / 2, boss.y - 25);
      
      // Show ally indicator for Garima
      if (boss.type === 'garima' && boss.allyPhase !== 'combat') {
        ctx.font = '8px monospace';
        // Show countdown until she attacks (5 seconds from level start)
        const secondsLeft = Math.max(0, Math.ceil((5000 - gameState.elapsedTime) / 1000));
        if (secondsLeft > 0) {
          ctx.fillStyle = '#ffaa00';
          ctx.fillText(`(Attacks in ${secondsLeft}s...)`, boss.x + boss.width / 2, boss.y - 35);
        }
        if (!gameState.canAttackBoss) {
          ctx.fillStyle = '#44ff44';
          ctx.fillText('(Cannot attack yet)', boss.x + boss.width / 2, boss.y - 45);
        }
      }
    }
    
    ctx.restore();
    
    // Draw UI overlay (not affected by shake)
    // Level name
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 10, 200, 25);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(currentLevel?.name || 'Unknown', 15, 27);
    
    // Score
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${gameState.score}`, GAME_WIDTH - 15, 27);
    
    // Controls hint
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('← → Move | ↑/Space Jump | Z Attack | X Special', GAME_WIDTH / 2, GAME_HEIGHT - 10);
    
    // Special attack status
    if (player.hasSpecialAttack) {
      ctx.fillStyle = player.specialCooldown <= 0 ? '#8b6914' : '#666';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        player.specialCooldown <= 0 ? '💥 DIARRHEA READY [X]' : `DIARRHEA: ${Math.ceil(player.specialCooldown / 1000)}s`,
        15,
        GAME_HEIGHT - 25
      );
    }
    
  }, [gameState]);
  
  return (
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      className="border-4 border-gray-800 rounded-lg shadow-2xl"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
