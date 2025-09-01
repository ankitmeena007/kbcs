import React from 'react';
import { Question } from '../types.ts';

interface QuestionBoxProps {
  questionData: Question;
  onAnswerSelect: (selectedOption: string) => void;
  isAnswered: boolean;
  selectedOption: string | null;
  hiddenOptions: string[];
}

const Option: React.FC<{
    prefix: string;
    text: string;
    onClick: () => void;
    isAnswered: boolean;
    isSelected: boolean;
    isCorrect: boolean;
    isHidden: boolean;
}> = ({ prefix, text, onClick, isAnswered, isSelected, isCorrect, isHidden }) => {

  const getOptionClass = () => {
    if (isAnswered) {
      if (isCorrect) return 'bg-green-600 animate-pulse';
      if (isSelected) return 'bg-red-600';
      return 'bg-blue-900/50 opacity-50';
    }
    if (isHidden) {
        return 'bg-gray-800/50 opacity-40 cursor-not-allowed';
    }
    return 'bg-blue-900/50 hover:bg-blue-700/70';
  };

  return (
    <button 
      onClick={onClick}
      disabled={isAnswered || isHidden}
      className={`w-full text-left p-4 rounded-lg border-2 border-blue-400/50 transition-all duration-300 transform ${getOptionClass()} ${!isAnswered && !isHidden ? 'hover:scale-105' : ''}`}
    >
      <span className="font-bold text-yellow-400 mr-3">{prefix}:</span>
      {text}
    </button>
  );
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ questionData, onAnswerSelect, isAnswered, selectedOption, hiddenOptions }) => {
  const { question, options, answer, tags } = questionData;
  const optionPrefixes = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-4xl text-white flex flex-col items-center">
      <div className="w-full bg-black bg-opacity-40 p-6 rounded-lg border border-blue-500/30 text-center mb-6">
        <div className="flex justify-center space-x-2 mb-4">
            <span className="bg-yellow-600/50 text-yellow-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tags.year}</span>
            <span className="bg-blue-600/50 text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tags.subject}</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-semibold leading-relaxed">{question}</h2>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <Option
            key={index}
            prefix={optionPrefixes[index]}
            text={option}
            onClick={() => onAnswerSelect(option)}
            isAnswered={isAnswered}
            isSelected={selectedOption === option}
            isCorrect={option === answer}
            isHidden={hiddenOptions.includes(option)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionBox;