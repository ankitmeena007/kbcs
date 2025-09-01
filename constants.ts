export const TOTAL_LEVELS = 14;
export const TIMER_DURATION = 60; // seconds

/**
 * URL for the text file containing the full question bank.
 * To use this feature:
 * 1. Create a public GitHub repository.
 * 2. Upload your questions.txt file to it.
 * 3. Navigate to the file on GitHub and click the "Raw" button.
 * 4. Copy the URL from your browser's address bar and paste it here.
 *
 * If this is left as the default, the app will use the built-in offline question set.
 */
export const REMOTE_QUESTIONS_URL = 'PASTE_YOUR_GITHUB_RAW_TXT_URL_HERE';


export const PRIZE_MONEY = [
  "₹ 5,000",
  "₹ 10,000",
  "₹ 20,000",
  "₹ 40,000",
  "₹ 80,000",
  "₹ 1,60,000",
  "₹ 3,20,000",
  "₹ 6,40,000",
  "₹ 12,50,000",
  "₹ 25,00,000",
  "₹ 50,00,000",
  "₹ 1 Crore",
  "₹ 3 Crore",
  "₹ 7 Crore",
].reverse();