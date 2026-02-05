import React from 'react';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900">
      {/* Pixel art style title */}
      <div className="relative mb-8">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 font-mono tracking-wider">
          TERRA
        </h1>
        <div className="text-xl text-gray-400 text-center mt-2 font-mono">
          A Pixel Demake
        </div>
        {/* Decorative pixels */}
        <div className="absolute -top-4 -left-4 w-4 h-4 bg-purple-500 animate-pulse" />
        <div className="absolute -top-4 -right-4 w-4 h-4 bg-pink-500 animate-pulse delay-100" />
        <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-red-500 animate-pulse delay-200" />
        <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-orange-500 animate-pulse delay-300" />
      </div>
      
      {/* Story teaser */}
      <div className="text-gray-500 text-sm font-mono mb-8 text-center max-w-md px-4">
        <p>She finds your message.</p>
        <p>The world glitches.</p>
        <p>Something feels wrong...</p>
      </div>
      
      {/* Start button */}
      <button
        onClick={onStart}
        className="
          px-8 py-4 text-xl font-bold font-mono
          bg-gradient-to-r from-purple-600 to-pink-600
          hover:from-purple-500 hover:to-pink-500
          text-white rounded-lg
          border-4 border-purple-400
          shadow-lg shadow-purple-900/50
          transition-all duration-200
          hover:scale-105 active:scale-95
          animate-pulse
        "
      >
        START GAME
      </button>
      
      {/* Controls */}
      <div className="mt-12 text-gray-600 text-sm font-mono space-y-1">
        <p>← → : Move</p>
        <p>↑ / Space : Jump</p>
        <p>Z : Attack</p>
        <p>X : Special (when unlocked)</p>
      </div>
      
      {/* Version */}
      <div className="absolute bottom-4 text-gray-700 text-xs font-mono">
        v1.0 - Placeholder Mode (Ready for Custom Assets)
      </div>
    </div>
  );
};
