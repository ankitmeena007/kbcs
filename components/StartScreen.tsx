import React from 'react';
import { TOTAL_LEVELS } from '../constants.ts';

interface StartScreenProps {
  onStart: () => void;
  error?: string | null;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="bg-black bg-opacity-50 p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-blue-500/30">
        <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 mb-2 tracking-wider font-kbc-title">KBCS</h1>
        <p className="text-xl md:text-2xl font-semibold text-yellow-200 mb-6">(Kaun Banega Civil Servant)</p>
        <p className="text-lg md:text-xl text-blue-200 mb-8 max-w-2xl">
          Welcome to the ultimate test of knowledge! Answer {TOTAL_LEVELS} questions from UPSC Prelims and win the grand prize.
        </p>
        <button 
          onClick={onStart} 
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-2xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Play Now
        </button>
        {error && <p className="text-red-500 mt-6 text-lg">{error}</p>}
      </div>
    </div>
  );
};

export default StartScreen;