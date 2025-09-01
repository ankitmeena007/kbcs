export interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  tags: {
    year: number;
    subject: string;
  };
}

export enum GameStatus {
  Loading,
  Start,
  Playing,
  ShowExplanation,
  GameOver,
  Won,
}

export type Lifeline = 'fiftyFifty' | 'askAI';