import React from 'react';
import { LEVELS } from './levels';

interface LevelCompleteScreenProps {
  levelIndex: number;
  score: number;
  onNextLevel: () => void;
}

export const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  levelIndex,
  score,
  onNextLevel,
}) => {
  const currentLevel = LEVELS[levelIndex];
  const nextLevel = LEVELS[levelIndex + 1];
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-green-950 via-gray-900 to-black">
      <div className="text-4xl font-bold text-green-400 font-mono mb-4">
        LEVEL COMPLETE!
      </div>
      
      <div className="text-xl text-gray-400 font-mono mb-2">
        {currentLevel?.name}
      </div>
      
      <div className="text-gray-500 font-mono mb-8">
        Score: <span className="text-white">{score}</span>
      </div>
      
      {nextLevel && (
        <div className="text-sm text-gray-600 font-mono mb-4">
          Next: {nextLevel.name}
        </div>
      )}
      
      <button
        onClick={onNextLevel}
        className="
          px-8 py-4 text-xl font-bold font-mono
          bg-gradient-to-r from-green-600 to-teal-600
          hover:from-green-500 hover:to-teal-500
          text-white rounded-lg
          border-4 border-green-400
          shadow-lg shadow-green-900/50
          transition-all duration-200
          hover:scale-105 active:scale-95
        "
      >
        {nextLevel ? 'NEXT LEVEL' : 'FINISH'}
      </button>
    </div>
  );
};
