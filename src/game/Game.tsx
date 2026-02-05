import React, { useEffect } from 'react';
import { useGameEngine } from './useGameEngine';
import { GameCanvas } from './GameCanvas';
import { TitleScreen } from './TitleScreen';
import { PrologueScreen } from './PrologueScreen';
import { DialogueBox } from './DialogueBox';
import { MCQOverlay } from './MCQOverlay';
import { LevelCompleteScreen } from './LevelCompleteScreen';
import { GameOverScreen } from './GameOverScreen';
import { VictoryScreen } from './VictoryScreen';
import { TouchControls } from '../components/TouchControls';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';

export const Game: React.FC = () => {
  const {
    gameState,
    startGame,
    startLevel,
    handleMCQAnswer,
    dismissDialogue,
    nextLevel,
    restart,
  } = useGameEngine();

  // Handle keyboard for dialogues
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.phase === 'dialogue' && gameState.dialogue) {
        dismissDialogue();
      }
      
      if (gameState.phase === 'title' && (e.code === 'Enter' || e.code === 'Space')) {
        startGame();
      }
      
      if (gameState.phase === 'level_complete' && (e.code === 'Enter' || e.code === 'Space')) {
        nextLevel();
      }
      
      if ((gameState.phase === 'game_over' || gameState.phase === 'victory') && 
          (e.code === 'Enter' || e.code === 'Space')) {
        restart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase, gameState.dialogue, dismissDialogue, startGame, nextLevel, restart]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-950">
      {/* Game container */}
      <div 
        className="relative"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Always render canvas as background */}
        <GameCanvas gameState={gameState} />
        
        {/* Overlay screens */}
        {gameState.phase === 'title' && (
          <TitleScreen onStart={startGame} />
        )}
        
        {gameState.phase === 'prologue' && (
          <PrologueScreen onComplete={() => startLevel(1)} />
        )}
        
        {gameState.phase === 'dialogue' && gameState.dialogue && (
          <DialogueBox 
            dialogue={gameState.dialogue} 
            onDismiss={dismissDialogue}
          />
        )}
        
        {gameState.phase === 'mcq' && gameState.mcq && (
          <MCQOverlay 
            question={gameState.mcq}
            onAnswer={handleMCQAnswer}
          />
        )}
        
        {gameState.phase === 'level_complete' && (
          <LevelCompleteScreen
            levelIndex={gameState.currentLevel}
            score={gameState.score}
            onNextLevel={nextLevel}
          />
        )}
        
        {gameState.phase === 'game_over' && (
          <GameOverScreen
            score={gameState.score}
            onRestart={restart}
          />
        )}
        
        {gameState.phase === 'victory' && (
          <VictoryScreen
            score={gameState.score}
            onRestart={restart}
          />
        )}
        
        {/* In-game dialogue overlay (non-blocking) */}
        {gameState.phase === 'playing' && gameState.dialogue && (
          <div 
            className="absolute bottom-4 left-4 right-4 p-3 bg-gray-900/80 border border-gray-700 rounded-lg cursor-pointer"
            onClick={dismissDialogue}
          >
            <div className={`font-mono text-sm ${
              gameState.dialogue.style === 'glitch' ? 'text-green-400 animate-pulse' :
              gameState.dialogue.style === 'big' ? 'text-yellow-400 text-lg font-bold' :
              gameState.dialogue.style === 'flash' ? 'text-white' : 'text-gray-300'
            }`}>
              {gameState.dialogue.text}
            </div>
          </div>
        )}
      </div>
      
      {/* Touch controls for mobile */}
      {gameState.phase === 'playing' && (
        <TouchControls
          onMove={(dir) => {
            if (dir === 'left') {
              window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
              window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }));
            } else if (dir === 'right') {
              window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
              window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }));
            } else {
              window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }));
              window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }));
            }
          }}
          onJump={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
            setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' })), 100);
          }}
          onAttack={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyZ' }));
          }}
          onSpecial={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyX' }));
          }}
          specialUnlocked={gameState.player.hasSpecialAttack}
          specialReady={gameState.player.specialCooldown <= 0}
        />
      )}
      
      {/* Game info sidebar */}
      <div className="hidden lg:block ml-8 p-4 bg-gray-900 rounded-lg border border-gray-800 max-w-xs">
        <h2 className="text-xl font-bold text-white mb-4 font-mono">TERRA LOVE 💕</h2>
        
        <div className="space-y-2 text-sm text-gray-400 font-mono">
          <p><span className="text-gray-600">Phase:</span> {gameState.phase}</p>
          <p><span className="text-gray-600">Level:</span> {gameState.currentLevel + 1}</p>
          <p><span className="text-gray-600">HP:</span> {gameState.player.hp}/{gameState.player.maxHp}</p>
          {gameState.boss && (
            <p><span className="text-gray-600">Boss HP:</span> {gameState.boss.hp}/{gameState.boss.maxHp}</p>
          )}
          <p><span className="text-gray-600">Score:</span> {gameState.score}</p>
          <p><span className="text-gray-600">Special:</span> {gameState.player.hasSpecialAttack ? '✓' : '✗'}</p>
        </div>
        
        <hr className="my-4 border-gray-800" />
        
        <div className="text-xs text-gray-600 font-mono space-y-1">
          <p>← → Move</p>
          <p>↑ / Space: Jump</p>
          <p>Z: Attack</p>
          <p>X: Special Attack</p>
        </div>
        
        <hr className="my-4 border-gray-800" />
        
        <div className="text-xs text-gray-700 font-mono">
          <p className="text-gray-500 mb-1">Asset Mode:</p>
          <p>PLACEHOLDER</p>
          <p className="mt-2 text-gray-600">Ready for custom PNGs & sounds</p>
        </div>
      </div>
    </div>
  );
};
