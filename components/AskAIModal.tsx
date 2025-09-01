import React from 'react';
import LoadingSpinner from './LoadingSpinner.tsx';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  advice: { answer: string; explanation: string; } | null;
  isLoading: boolean;
}

const AskAIModal: React.FC<AskAIModalProps> = ({ isOpen, onClose, advice, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-900 to-gray-900 rounded-2xl shadow-2xl border border-yellow-400/50 text-white max-w-lg w-full p-6 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-3xl" aria-label="Close modal">&times;</button>
        <h2 className="text-3xl font-bold text-yellow-400 mb-4 text-center">Expert Advice</h2>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48">
            <LoadingSpinner />
            <p className="mt-4 text-lg">Consulting the expert...</p>
          </div>
        ) : advice ? (
          <div className="space-y-4 text-lg">
            <p><span className="font-bold text-yellow-300">The expert suggests the answer is:</span></p>
            <p className="bg-black/30 p-3 rounded-lg border border-blue-500/30 text-center font-semibold text-xl">{advice.answer}</p>
            <p><span className="font-bold text-yellow-300">Explanation:</span></p>
            <p className="text-blue-200">{advice.explanation}</p>
          </div>
        ) : (
           <p className="text-center text-red-400">Could not get advice from the expert.</p>
        )}
      </div>
    </div>
  );
};

export default AskAIModal;