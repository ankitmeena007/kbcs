import React from 'react';
import { Question } from '../types.ts';

interface ExplanationScreenProps {
  questionData: Question;
  onProceed: () => void;
  onGameOver: () => void;
  isCorrect: boolean;
  isTimedOut: boolean;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({ questionData, onProceed, onGameOver, isCorrect, isTimedOut }) => {
  const getTitle = () => {
    if (isTimedOut) return "Time's Up!";
    return isCorrect ? "Correct!" : "Incorrect";
  };
  
  const getTitleColor = () => {
    if (isTimedOut) return "text-yellow-400";
    return isCorrect ? "text-green-400" : "text-red-500";
  };
  
  const title = getTitle();
  const titleColor = getTitleColor();
  const isGameOver = !isCorrect || isTimedOut;
  const buttonText = isGameOver ? "View Results" : "Continue";
  const buttonAction = isGameOver ? onGameOver : onProceed;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="bg-black bg-opacity-50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-blue-500/30 max-w-4xl w-full space-y-6">
        <div className="text-center">
          <h1 className={`text-5xl md:text-6xl font-bold ${titleColor} mb-6`}>{title}</h1>
        </div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-semibold text-blue-200 mb-4">{questionData.question}</h2>
          <p className="text-xl lg:text-2xl">
            <span className="font-bold text-yellow-400">Correct Answer: </span>
            <span className="text-green-400">{questionData.answer}</span>
          </p>
        </div>
        <div className="border-t border-blue-500/30 pt-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Explanation</h3>
            <p className="text-lg text-blue-200 leading-relaxed">{questionData.explanation}</p>
        </div>
        <div className="text-center pt-4">
            <button
                onClick={buttonAction}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-2xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
                {buttonText}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationScreen;