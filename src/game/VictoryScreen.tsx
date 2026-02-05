import React, { useEffect, useState } from 'react';
import { ENDING_TEXTS } from './levels';

interface VictoryScreenProps {
  score: number;
  onRestart: () => void;
}

// Confetti colors
const CONFETTI_COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', 
  '#c56cf0', '#ff9ff3', '#54a0ff', '#5f27cd', '#ff9f43'
];

// Heart emoji positions for floating hearts
const generateHearts = () => {
  return [...Array(30)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 20 + Math.random() * 30,
  }));
};

// Generate confetti pieces
const generateConfetti = () => {
  return [...Array(100)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    size: 8 + Math.random() * 12,
  }));
};

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ score, onRestart }) => {
  const [showBirthday, setShowBirthday] = useState(false);
  const [hearts] = useState(generateHearts);
  const [confetti] = useState(generateConfetti);
  const [sparkles, setSparkles] = useState<{id: number, x: number, y: number}[]>([]);

  useEffect(() => {
    // Show birthday message after a short delay
    const timer = setTimeout(() => setShowBirthday(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Add sparkle effect on mouse move
  useEffect(() => {
    let sparkleId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.7) {
        const newSparkle = { id: sparkleId++, x: e.clientX, y: e.clientY };
        setSparkles(prev => [...prev.slice(-20), newSparkle]);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 25%, #4a1942 50%, #2d1b4e 75%, #1a0a2e 100%)'
      }}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,100,150,0.3) 0%, transparent 50%)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />

      {/* Floating hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-red-500 pointer-events-none"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
            fontSize: `${heart.size}px`,
            animation: `floatUp ${heart.duration}s ease-in-out infinite`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute pointer-events-none"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size * 0.6}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confettiFall ${piece.duration}s linear infinite`,
            animationDelay: `${piece.delay}s`,
            borderRadius: '2px',
          }}
        />
      ))}

      {/* Sparkles from mouse */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="fixed pointer-events-none text-yellow-300"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            animation: 'sparkle 0.5s ease-out forwards',
            fontSize: '20px',
          }}
        >
          ✨
        </div>
      ))}

      {/* Main celebration content */}
      <div className="relative z-10 text-center px-4">
        {/* Crown emoji */}
        <div className="text-6xl mb-4 animate-bounce">👑</div>

        {/* HAPPY BIRTHDAY text with rainbow animation */}
        {showBirthday && (
          <div className="mb-6">
            <h1 
              className="text-5xl md:text-7xl font-bold font-mono mb-4"
              style={{
                background: 'linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c56cf0, #ff6b6b)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'rainbow 3s linear infinite',
                textShadow: '0 0 30px rgba(255,100,150,0.5)',
              }}
            >
              HAPPY BIRTHDAY
            </h1>
            <h2 
              className="text-4xl md:text-6xl font-bold font-mono text-pink-400"
              style={{
                animation: 'glow 2s ease-in-out infinite alternate',
                textShadow: '0 0 20px #ff6eb4, 0 0 40px #ff6eb4, 0 0 60px #ff6eb4',
              }}
            >
              MY LOVE 💕
            </h2>
          </div>
        )}

        {/* Decorative hearts row */}
        <div className="flex justify-center gap-2 text-3xl mb-8">
          {['💖', '💝', '💗', '💓', '💕', '💓', '💗', '💝', '💖'].map((heart, i) => (
            <span 
              key={i} 
              className="inline-block"
              style={{
                animation: `heartBeat 1s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {heart}
            </span>
          ))}
        </div>

        {/* Cake emoji */}
        <div className="text-8xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>
          🎂
        </div>

        {/* Ending text */}
        <div className="mb-6 space-y-2 max-w-md mx-auto">
          {ENDING_TEXTS.map((text, index) => (
            <p 
              key={index} 
              className="text-lg text-pink-200 font-mono opacity-0"
              style={{
                animation: `fadeInUp 0.5s ease-out forwards`,
                animationDelay: `${1 + index * 0.3}s`,
              }}
            >
              {text}
            </p>
          ))}
        </div>

        {/* Score with sparkle */}
        <div className="text-gray-300 font-mono mb-6 text-xl">
          ⭐ Final Score: <span className="text-yellow-400 text-3xl font-bold">{score}</span> ⭐
        </div>

        {/* Party emojis */}
        <div className="flex justify-center gap-4 text-4xl mb-8">
          <span style={{ animation: 'wiggle 0.5s ease-in-out infinite' }}>🎉</span>
          <span style={{ animation: 'wiggle 0.5s ease-in-out infinite', animationDelay: '0.1s' }}>🎊</span>
          <span style={{ animation: 'wiggle 0.5s ease-in-out infinite', animationDelay: '0.2s' }}>🥳</span>
          <span style={{ animation: 'wiggle 0.5s ease-in-out infinite', animationDelay: '0.3s' }}>🎁</span>
          <span style={{ animation: 'wiggle 0.5s ease-in-out infinite', animationDelay: '0.4s' }}>🎈</span>
        </div>

        {/* Play again button */}
        <button
          onClick={onRestart}
          className="
            px-10 py-5 text-2xl font-bold font-mono
            bg-gradient-to-r from-pink-500 via-red-500 to-pink-500
            hover:from-pink-400 hover:via-red-400 hover:to-pink-400
            text-white rounded-full
            border-4 border-pink-300
            shadow-lg shadow-pink-900/50
            transition-all duration-300
            hover:scale-110 active:scale-95
            relative overflow-hidden
          "
          style={{
            backgroundSize: '200% auto',
            animation: 'shimmer 2s linear infinite',
          }}
        >
          <span className="relative z-10">🎮 PLAY AGAIN 🎮</span>
        </button>

        {/* Love message */}
        <div className="mt-8 text-2xl font-mono text-pink-300 flex items-center justify-center gap-2"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        >
          <span>Made with</span>
          <span className="text-red-500 text-3xl" style={{ animation: 'heartBeat 1s ease-in-out infinite' }}>❤️</span>
          <span>for you</span>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes rainbow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes glow {
          0% { text-shadow: 0 0 20px #ff6eb4, 0 0 40px #ff6eb4; }
          100% { text-shadow: 0 0 40px #ff6eb4, 0 0 80px #ff6eb4, 0 0 120px #ff6eb4; }
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes sparkle {
          0% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(180deg);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
