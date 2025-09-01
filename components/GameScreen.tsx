import React from 'react';
import { Question, Lifeline } from '../types.ts';
import Timer from './Timer.tsx';
import QuestionBox from './QuestionBox.tsx';
import PrizeLadder from './PrizeLadder.tsx';
import Lifelines from './Lifelines.tsx';
import AskAIModal from './AskAIModal.tsx';
import { TIMER_DURATION } from '../constants.ts';

interface GameScreenProps {
  currentLevel: number;
  questionData: Question;
  handleAnswer: (selectedOption: string, timedOut?: boolean) => void;
  isAnswered: boolean;
  selectedOption: string | null;
  usedLifelines: Set<Lifeline>;
  onUseFiftyFifty: () => void;
  onUseAskAI: () => void;
  hiddenOptions: string[];
  isExpertModalOpen: boolean;
  closeExpertModal: () => void;
  expertAdvice: { answer: string; explanation: string; } | null;
  isExpertLoading: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({
  currentLevel,
  questionData,
  handleAnswer,
  isAnswered,
  selectedOption,
  usedLifelines,
  onUseFiftyFifty,
  onUseAskAI,
  hiddenOptions,
  isExpertModalOpen,
  closeExpertModal,
  expertAdvice,
  isExpertLoading,
}) => {
  const handleTimeUp = () => {
    if (!isAnswered) {
      handleAnswer("", true);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center md:items-start justify-center p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 space-y-4 md:space-y-0 md:space-x-4">
      <AskAIModal
        isOpen={isExpertModalOpen}
        onClose={closeExpertModal}
        advice={expertAdvice}
        isLoading={isExpertLoading}
      />
      <div className="w-full md:w-auto md:order-2 flex flex-col items-center space-y-4">
        <Lifelines
          usedLifelines={usedLifelines}
          onUseFiftyFifty={onUseFiftyFifty}
          onUseAskAI={onUseAskAI}
          isAnswered={isAnswered}
        />
        <div className="mt-4 md:mt-0">
          <Timer
            key={currentLevel} // Reset timer on new question
            duration={TIMER_DURATION}
            onTimeUp={handleTimeUp}
            isPaused={isAnswered}
          />
        </div>
        <QuestionBox
          questionData={questionData}
          onAnswerSelect={handleAnswer}
          isAnswered={isAnswered}
          selectedOption={selectedOption}
          hiddenOptions={hiddenOptions}
        />
      </div>
      <div className="w-full md:w-auto md:order-1 mt-4 md:mt-0">
        <PrizeLadder currentLevel={currentLevel} />
      </div>
    </div>
  );
};

export default GameScreen;