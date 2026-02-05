import React, { useState, useEffect } from 'react';
import { LEVELS } from './levels';

interface PrologueScreenProps {
  onComplete: () => void;
}

export const PrologueScreen: React.FC<PrologueScreenProps> = ({ onComplete }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  
  const prologueTexts = LEVELS[0]?.introTexts || [
    'She finds your message.',
    'The world glitches.',
    'Something feels wrong...',
  ];
  
  const currentText = prologueTexts[textIndex] || '';
  const displayedText = currentText.slice(0, charIndex);
  
  useEffect(() => {
    if (charIndex < currentText.length) {
      const timer = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setShowContinue(true);
    }
  }, [charIndex, currentText.length]);
  
  const handleClick = () => {
    if (charIndex < currentText.length) {
      setCharIndex(currentText.length);
    } else if (textIndex < prologueTexts.length - 1) {
      setTextIndex(prev => prev + 1);
      setCharIndex(0);
      setShowContinue(false);
    } else {
      onComplete();
    }
  };
  
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-black cursor-pointer"
      onClick={handleClick}
    >
      {/* Glitch effect background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-green-500"
            style={{
              left: 0,
              right: 0,
              top: `${Math.random() * 100}%`,
              opacity: Math.random(),
              animation: `glitch ${0.5 + Math.random()}s linear infinite`,
            }}
          />
        ))}
      </div>
      
      <div className="text-center px-8 max-w-2xl">
        <div className="text-3xl font-mono text-gray-300 min-h-[2em]">
          {displayedText}
          <span className="animate-pulse">|</span>
        </div>
      </div>
      
      {showContinue && (
        <div className="absolute bottom-16 text-gray-600 font-mono text-sm animate-pulse">
          {textIndex < prologueTexts.length - 1 ? 'Click to continue...' : 'Click to begin...'}
        </div>
      )}
      
      {/* Progress dots */}
      <div className="absolute bottom-8 flex gap-2">
        {prologueTexts.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i <= textIndex ? 'bg-gray-400' : 'bg-gray-700'}`}
          />
        ))}
      </div>
    </div>
  );
};
