import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPaused, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const progress = (timeLeft / duration) * 100;
  const color = timeLeft > 20 ? 'text-green-400' : timeLeft > 10 ? 'text-yellow-400' : 'text-red-500';

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute w-full h-full" viewBox="0 0 36 36">
        <path
          className="text-gray-700"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          className={`${color} transition-all duration-1000 ease-linear`}
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${progress}, 100`}
          strokeLinecap="round"
          transform="rotate(90 18 18)"
        />
      </svg>
      <span className={`text-4xl font-bold ${color}`}>{timeLeft}</span>
    </div>
  );
};

export default Timer;