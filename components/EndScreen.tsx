import React from 'react';
import { GameStatus } from '../types.ts';
import { PRIZE_MONEY, TOTAL_LEVELS } from '../constants.ts';

interface EndScreenProps {
  status: GameStatus;
  currentLevel: number;
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ status, currentLevel, onRestart }) => {
  const prizeWon = status === GameStatus.Won 
    ? PRIZE_MONEY[0]
    : currentLevel > 0 
    ? PRIZE_MONEY[TOTAL_LEVELS - currentLevel] 
    : "₹ 0";

  const message = status === GameStatus.Won 
    ? "Congratulations! You are a Crorepati!" 
    : "Game Over!";

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="bg-black bg-opacity-50 p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-blue-500/30">
        <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-4 tracking-wider" style={{ fontFamily: 'serif' }}>{message}</h1>
        <p className="text-2xl md:text-3xl text-blue-200 mb-8">
          {status === GameStatus.Won ? `You have won ${prizeWon}!` : `You walk away with ${prizeWon}.`}
        </p>
        <button 
          onClick={onRestart} 
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-2xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default EndScreen;