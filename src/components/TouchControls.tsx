import React, { useRef } from 'react';

interface TouchControlsProps {
  onMove: (direction: 'left' | 'right' | null) => void;
  onJump: () => void;
  onAttack: () => void;
  onSpecial: () => void;
  specialUnlocked: boolean;
  specialReady: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onJump,
  onAttack,
  onSpecial,
  specialUnlocked,
  specialReady
}) => {
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);

  const handleLeftStart = () => {
    leftPressed.current = true;
    onMove('left');
  };

  const handleLeftEnd = () => {
    leftPressed.current = false;
    if (rightPressed.current) {
      onMove('right');
    } else {
      onMove(null);
    }
  };

  const handleRightStart = () => {
    rightPressed.current = true;
    onMove('right');
  };

  const handleRightEnd = () => {
    rightPressed.current = false;
    if (leftPressed.current) {
      onMove('left');
    } else {
      onMove(null);
    }
  };

  const buttonStyle = (color: string, active: boolean = true) => ({
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: active ? `linear-gradient(135deg, ${color}, ${color}99)` : '#333',
    border: `3px solid ${active ? '#fff' : '#555'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: active ? '#fff' : '#666',
    userSelect: 'none' as const,
    touchAction: 'none' as const,
    cursor: active ? 'pointer' : 'not-allowed',
    boxShadow: active ? `0 4px 15px ${color}66` : 'none',
  });

  const dpadStyle = {
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #4a4a4a, #333)',
    border: '2px solid #666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#fff',
    userSelect: 'none' as const,
    touchAction: 'none' as const,
    cursor: 'pointer',
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50 md:hidden">
      {/* Left side - D-pad */}
      <div 
        className="absolute bottom-8 left-4 pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        <div className="flex flex-col items-center gap-1">
          {/* Jump button */}
          <button
            style={{ ...dpadStyle, borderRadius: '8px 8px 0 0' }}
            onTouchStart={(e) => { e.preventDefault(); onJump(); }}
            onMouseDown={onJump}
          >
            ▲
          </button>
          
          <div className="flex gap-1">
            {/* Left button */}
            <button
              style={{ ...dpadStyle, borderRadius: '8px 0 0 8px' }}
              onTouchStart={(e) => { e.preventDefault(); handleLeftStart(); }}
              onTouchEnd={(e) => { e.preventDefault(); handleLeftEnd(); }}
              onMouseDown={handleLeftStart}
              onMouseUp={handleLeftEnd}
              onMouseLeave={handleLeftEnd}
            >
              ◀
            </button>
            
            {/* Center */}
            <div style={{ ...dpadStyle, background: '#222', cursor: 'default' }}>
              ●
            </div>
            
            {/* Right button */}
            <button
              style={{ ...dpadStyle, borderRadius: '0 8px 8px 0' }}
              onTouchStart={(e) => { e.preventDefault(); handleRightStart(); }}
              onTouchEnd={(e) => { e.preventDefault(); handleRightEnd(); }}
              onMouseDown={handleRightStart}
              onMouseUp={handleRightEnd}
              onMouseLeave={handleRightEnd}
            >
              ▶
            </button>
          </div>
          
          {/* Down (unused but for symmetry) */}
          <div style={{ ...dpadStyle, borderRadius: '0 0 8px 8px', opacity: 0.3 }}>
            ▼
          </div>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div 
        className="absolute bottom-8 right-4 pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Special Attack (top) */}
          <button
            style={buttonStyle('#9333ea', specialUnlocked && specialReady)}
            onTouchStart={(e) => { e.preventDefault(); if (specialUnlocked && specialReady) onSpecial(); }}
            onMouseDown={() => { if (specialUnlocked && specialReady) onSpecial(); }}
            disabled={!specialUnlocked || !specialReady}
          >
            {specialUnlocked ? (specialReady ? '💥' : '⏳') : '🔒'}
          </button>
          
          <div className="flex gap-3">
            {/* Jump button (left) */}
            <button
              style={buttonStyle('#22c55e')}
              onTouchStart={(e) => { e.preventDefault(); onJump(); }}
              onMouseDown={onJump}
            >
              ⬆
            </button>
            
            {/* Attack button (right) */}
            <button
              style={buttonStyle('#ef4444')}
              onTouchStart={(e) => { e.preventDefault(); onAttack(); }}
              onMouseDown={onAttack}
            >
              ⚔
            </button>
          </div>
        </div>
        
        {/* Labels */}
        <div className="flex justify-center gap-8 mt-2 text-xs text-white/60">
          <span>JUMP</span>
          <span>ATK</span>
        </div>
        {specialUnlocked && (
          <div className="text-center text-xs text-purple-400 mt-1">
            {specialReady ? 'SPECIAL' : 'Cooldown...'}
          </div>
        )}
      </div>
    </div>
  );
};
