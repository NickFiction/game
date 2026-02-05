import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-red-950 via-gray-900 to-black">
      <div className="text-6xl font-bold text-red-500 font-mono mb-4 animate-pulse">
        GAME OVER
      </div>
      
      <div className="text-gray-400 font-mono mb-8">
        Final Score: <span className="text-white">{score}</span>
      </div>
      
      <button
        onClick={onRestart}
        className="
          px-8 py-4 text-xl font-bold font-mono
          bg-gradient-to-r from-red-600 to-orange-600
          hover:from-red-500 hover:to-orange-500
          text-white rounded-lg
          border-4 border-red-400
          shadow-lg shadow-red-900/50
          transition-all duration-200
          hover:scale-105 active:scale-95
        "
      >
        TRY AGAIN
      </button>
    </div>
  );
};
