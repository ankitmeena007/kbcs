import React from 'react';
import { PRIZE_MONEY, TOTAL_LEVELS } from '../constants.ts';

interface PrizeLadderProps {
  currentLevel: number;
}

const PrizeLadder: React.FC<PrizeLadderProps> = ({ currentLevel }) => {
  return (
    <div className="w-full md:w-64 lg:w-72 bg-black bg-opacity-40 p-4 rounded-lg border border-blue-500/30 text-white">
      <ul className="flex flex-row-reverse md:flex-col justify-center">
        {PRIZE_MONEY.map((amount, index) => {
          const level = TOTAL_LEVELS - index;
          const isCurrent = level === currentLevel + 1;
          const isCleared = level <= currentLevel;
          
          let styles = "text-gray-400";
          if (isCurrent) styles = "bg-yellow-500 text-black font-bold scale-105";
          if (isCleared) styles = "text-yellow-400";

          return (
            <li key={amount} className={`p-2 my-1 md:my-0.5 text-sm md:text-base lg:text-lg rounded-md transition-all duration-300 text-center md:text-left ${styles}`}>
              <span className="font-semibold mr-2 text-gray-500">{level.toString().padStart(2, '0')}</span>
              {amount}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PrizeLadder;