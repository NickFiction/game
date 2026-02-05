import React from 'react';
import { MCQuestion } from './types';

interface MCQOverlayProps {
  question: MCQuestion;
  onAnswer: (index: number) => void;
}

export const MCQOverlay: React.FC<MCQOverlayProps> = ({ question, onAnswer }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
      <div className="max-w-lg w-full mx-4 p-6 bg-gradient-to-br from-amber-900 to-amber-950 border-4 border-amber-600 rounded-lg shadow-2xl">
        <div className="text-amber-400 text-sm uppercase tracking-wider mb-2">
          🧠 RAVIN'S RIDDLE 🧠
        </div>
        
        <h2 className="text-xl font-bold text-white mb-6 font-mono">
          {question.question}
        </h2>
        
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              className="
                p-3 text-left font-mono
                bg-gray-800 hover:bg-amber-800
                border-2 border-gray-600 hover:border-amber-500
                rounded-lg transition-all duration-200
                text-white hover:text-amber-200
                active:scale-95
              "
            >
              <span className="inline-block w-8 h-8 mr-3 text-center leading-8 bg-gray-700 rounded">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>
        
        <div className="text-xs text-amber-600 mt-4 text-center">
          Choose wisely! Wrong answers deal damage!
        </div>
      </div>
    </div>
  );
};
