import React from 'react';
import { Dialogue } from './types';

interface DialogueBoxProps {
  dialogue: Dialogue;
  onDismiss: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onDismiss }) => {
  const getStyleClasses = () => {
    switch (dialogue.style) {
      case 'glitch':
        return 'animate-pulse border-green-500 text-green-400';
      case 'big':
        return 'text-2xl font-bold text-yellow-400 animate-bounce';
      case 'flash':
        return 'animate-pulse text-white bg-gradient-to-r from-purple-600 to-pink-600';
      default:
        return 'text-white border-gray-600';
    }
  };
  
  const getSpeakerColor = () => {
    switch (dialogue.speaker) {
      case 'boss':
        return 'text-red-400';
      case 'system':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };
  
  return (
    <div 
      className="absolute inset-0 flex items-end justify-center pb-20 bg-black/30"
      onClick={onDismiss}
    >
      <div 
        className={`
          max-w-xl w-full mx-4 p-4 
          bg-gray-900/95 border-2 rounded-lg
          cursor-pointer select-none
          ${getStyleClasses()}
        `}
      >
        {dialogue.speaker !== 'narrator' && (
          <div className={`text-sm mb-1 uppercase font-bold ${getSpeakerColor()}`}>
            {dialogue.speaker === 'boss' ? '???' : dialogue.speaker}
          </div>
        )}
        <div className={`font-mono ${dialogue.style === 'big' ? 'text-center' : ''}`}>
          {dialogue.text}
        </div>
        <div className="text-xs text-gray-500 mt-2 text-right">
          Click or press any key to continue...
        </div>
      </div>
    </div>
  );
};
