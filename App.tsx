import React, { useState, useCallback, useEffect } from 'react';
import { GameStatus, Question, Lifeline } from './types.ts';
import { fetchQuestions, getAIExpertAnswer } from './services/geminiService.ts';
import { TOTAL_LEVELS } from './constants.ts';
import StartScreen from './components/StartScreen.tsx';
import EndScreen from './components/EndScreen.tsx';
import GameScreen from './components/GameScreen.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ExplanationScreen from './components/ExplanationScreen.tsx';

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Start);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean>(false);
  const [wasTimedOut, setWasTimedOut] = useState<boolean>(false);

  const [usedLifelines, setUsedLifelines] = useState<Set<Lifeline>>(new Set());
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [expertAdvice, setExpertAdvice] = useState<{ answer: string; explanation: string } | null>(null);
  const [isExpertLoading, setIsExpertLoading] = useState(false);

  const resetGameState = useCallback(() => {
    setQuestions([]);
    setCurrentLevel(0);
    setError(null);
    setIsAnswered(false);
    setSelectedOption(null);
    setLastAnswerCorrect(false);
    setUsedLifelines(new Set());
    setHiddenOptions([]);
    setIsExpertModalOpen(false);
    setExpertAdvice(null);
    setIsExpertLoading(false);
    setWasTimedOut(false);
  }, []);

  const startGame = useCallback(async () => {
    resetGameState();
    setGameStatus(GameStatus.Loading);
    
    try {
      const allQuestions = await fetchQuestions();
      if (allQuestions.length < TOTAL_LEVELS) {
        throw new Error("Not enough questions available to start the game.");
      }
      // Take a slice of TOTAL_LEVELS questions for one game session
      setQuestions(allQuestions.slice(0, TOTAL_LEVELS));
      setGameStatus(GameStatus.Playing);
    } catch (err) {
      setError(`Failed to load questions. Please check your connection or try again later. Error: ${(err as Error).message}`);
      setGameStatus(GameStatus.Start);
    }
  }, [resetGameState]);

  const handleAnswer = useCallback((option: string, timedOut: boolean = false) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(option);
    setWasTimedOut(timedOut);

    const isCorrect = !timedOut && questions[currentLevel].answer === option;
    setLastAnswerCorrect(isCorrect);

    setTimeout(() => {
      setGameStatus(GameStatus.ShowExplanation);
    }, 3000); // Wait 3 seconds to show result before moving to explanation
  }, [currentLevel, questions, isAnswered]);

  const handleProceed = useCallback(() => {
    if (currentLevel === TOTAL_LEVELS - 1) {
      setGameStatus(GameStatus.Won);
    } else {
      setCurrentLevel(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setHiddenOptions([]);
      setGameStatus(GameStatus.Playing);
      setWasTimedOut(false);
    }
  }, [currentLevel]);
  
  const handleShowGameOver = useCallback(() => {
    setGameStatus(GameStatus.GameOver);
  }, []);

  const restartGame = useCallback(() => {
    setGameStatus(GameStatus.Start);
    resetGameState();
  }, [resetGameState]);
  
  const handleUseFiftyFifty = useCallback(() => {
    if (usedLifelines.has('fiftyFifty') || isAnswered) return;
    
    const currentQuestion = questions[currentLevel];
    const correctAnswer = currentQuestion.answer;
    const wrongOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
    
    const randomWrongOptionToKeep = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    const optionsToHide = wrongOptions.filter(opt => opt !== randomWrongOptionToKeep);
    
    setHiddenOptions(optionsToHide);
    setUsedLifelines(prev => new Set(prev).add('fiftyFifty'));
  }, [usedLifelines, isAnswered, questions, currentLevel]);

  const handleUseAskAI = useCallback(() => {
    if (usedLifelines.has('askAI') || isAnswered) return;

    setIsExpertModalOpen(true);
    setIsExpertLoading(true);
    setUsedLifelines(prev => new Set(prev).add('askAI'));

    // Simulate AI thinking time
    setTimeout(() => {
        try {
            const advice = getAIExpertAnswer(questions[currentLevel]);
            setExpertAdvice(advice);
        } catch (e) {
            setExpertAdvice(null); // Should not happen in offline mode
            console.error(e);
        } finally {
            setIsExpertLoading(false);
        }
    }, 1500);
  }, [usedLifelines, isAnswered, questions, currentLevel]);


  const renderContent = () => {
    switch (gameStatus) {
      case GameStatus.Start:
        return <StartScreen onStart={startGame} error={error} />;
      case GameStatus.Loading:
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
            <LoadingSpinner />
            <p className="mt-4 text-xl">Fetching latest questions...</p>
          </div>
        );
      case GameStatus.Playing:
        if (questions.length > 0) {
          return (
            <GameScreen
              currentLevel={currentLevel}
              questionData={questions[currentLevel]}
              handleAnswer={handleAnswer}
              isAnswered={isAnswered}
              selectedOption={selectedOption}
              usedLifelines={usedLifelines}
              onUseFiftyFifty={handleUseFiftyFifty}
              onUseAskAI={handleUseAskAI}
              hiddenOptions={hiddenOptions}
              isExpertModalOpen={isExpertModalOpen}
              closeExpertModal={() => setIsExpertModalOpen(false)}
              expertAdvice={expertAdvice}
              isExpertLoading={isExpertLoading}
            />
          );
        }
        return null;
      case GameStatus.ShowExplanation:
        return (
          <ExplanationScreen 
            questionData={questions[currentLevel]} 
            onProceed={handleProceed}
            onGameOver={handleShowGameOver}
            isCorrect={lastAnswerCorrect}
            isTimedOut={wasTimedOut}
          />
        );
      case GameStatus.GameOver:
      case GameStatus.Won:
        return <EndScreen status={gameStatus} currentLevel={currentLevel} onRestart={restartGame} />;
      default:
        return <StartScreen onStart={startGame} error={error} />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default App;