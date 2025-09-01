import React from 'react';
import { Lifeline } from '../types.ts';

interface LifelinesProps {
  usedLifelines: Set<Lifeline>;
  onUseFiftyFifty: () => void;
  onUseAskAI: () => void;
  isAnswered: boolean;
}

const LifelineButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  label: string;
}> = ({ onClick, disabled, children, label }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Use ${label} lifeline`}
      className={`
        w-24 h-24 md:w-28 md:h-28 rounded-full border-4 flex items-center justify-center 
        transition-all duration-300 transform 
        ${disabled 
          ? 'border-red-500/50 bg-gray-800/50 cursor-not-allowed opacity-50' 
          : 'border-yellow-400 bg-blue-900/50 hover:bg-yellow-500 hover:text-black hover:scale-110'
        }
      `}
    >
      <span className="text-lg font-bold">{children}</span>
    </button>
  );
};

const Lifelines: React.FC<LifelinesProps> = ({ usedLifelines, onUseFiftyFifty, onUseAskAI, isAnswered }) => {
  const isFiftyFiftyUsed = usedLifelines.has('fiftyFifty');
  const isAskAIUsed = usedLifelines.has('askAI');

  return (
    <div className="flex justify-center items-center space-x-4 md:space-x-6 text-white mb-4">
      <LifelineButton label="50-50" onClick={onUseFiftyFifty} disabled={isFiftyFiftyUsed || isAnswered}>
        50:50
      </LifelineButton>
      <LifelineButton label="Ask AI" onClick={onUseAskAI} disabled={isAskAIUsed || isAnswered}>
        Ask AI
      </LifelineButton>
    </div>
  );
};

export default Lifelines;