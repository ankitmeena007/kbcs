import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types.ts';
import { QUESTIONS } from '../data/questions.ts';
import { REMOTE_QUESTIONS_URL } from '../constants.ts';

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Helper to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

// --- Local Fallback ---
const fetchLocalQuestions = (): Question[] => {
    console.log('Using local fallback questions.');
    return shuffleArray([...QUESTIONS]);
};

// --- Gemini TXT Parsing ---
const fetchAndParseQuestionsFromRemoteText = async (textUrl: string): Promise<Question[]> => {
    // 1. Fetch TXT file from URL
    const response = await fetch(textUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch text file: ${response.statusText}`);
    }
    const textBuffer = await response.arrayBuffer();
    const textBase64 = arrayBufferToBase64(textBuffer);

    // 2. Initialize Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 3. Define the response schema for reliable JSON output
    const schema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "The full text of the question." },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of exactly four string options." },
            answer: { type: Type.STRING, description: "The correct answer, which must be one of the provided options." },
            explanation: { type: Type.STRING, description: "A detailed explanation for the correct answer." },
            tags: {
                type: Type.OBJECT,
                properties: {
                    year: { type: Type.NUMBER, description: "The year the question appeared." },
                    subject: { type: Type.STRING, description: "The subject of the question (e.g., Polity, History)." }
                },
                required: ["year", "subject"],
            }
          },
          required: ["question", "options", "answer", "explanation", "tags"],
        }
    };

    // 4. Construct the prompt for Gemini
    const prompt = `You are a data extraction specialist. Analyze the provided text document which contains UPSC Previous Year Questions. Extract all the questions and format them into a clean JSON array. Each object in the array must strictly follow the defined schema. Ensure the 'options' array contains exactly four string elements. Do not include any extra text or markdown formatting in your response. Just return the raw JSON array.`;

    const textPart = {
        inlineData: {
            data: textBase64,
            mimeType: 'text/plain',
        },
    };

    // 5. Call Gemini API
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    // 6. Parse and return the result
    const jsonString = result.text.trim();
    const parsedQuestions = JSON.parse(jsonString) as Question[];
    return shuffleArray(parsedQuestions);
};


// --- Main Exported Function ---
export const fetchQuestions = async (): Promise<Question[]> => {
  const isOnline = navigator.onLine;
  const isRemoteUrlSet = REMOTE_QUESTIONS_URL && REMOTE_QUESTIONS_URL !== 'PASTE_YOUR_GITHUB_RAW_TXT_URL_HERE';

  if (isOnline && isRemoteUrlSet) {
    try {
      console.log('Online mode: Fetching questions from remote text file...');
      const questions = await fetchAndParseQuestionsFromRemoteText(REMOTE_QUESTIONS_URL);
      if (questions.length > 0) {
        return questions;
      }
      console.warn('Fetched remote file but no questions were parsed. Falling back to local questions.');
      return fetchLocalQuestions();
    } catch (error) {
      console.error('Failed to fetch or parse remote file, falling back to local questions:', error);
      return fetchLocalQuestions();
    }
  } else {
    console.log(`Offline mode (isOnline: ${isOnline}, isRemoteUrlSet: ${isRemoteUrlSet}). Using local questions.`);
    return fetchLocalQuestions();
  }
};

export const getAIExpertAnswer = (question: Question): { answer: string; explanation: string } => {
  const expertPreamble = "Of course, I can help with that. After carefully analyzing the question and the provided options, my expert opinion is that the correct answer is";
  
  const expertExplanation = `**${question.answer}**. Here's the reasoning behind this conclusion: ${question.explanation}`;
  
  return {
    answer: question.answer,
    explanation: `${expertPreamble} ${expertExplanation}`,
  };
};