document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTS ---
    const TOTAL_LEVELS = 14;
    const TIMER_DURATION = 60;
    const PRIZE_MONEY = [
        "₹ 5,000", "₹ 10,000", "₹ 20,000", "₹ 40,000", "₹ 80,000",
        "₹ 1,60,000", "₹ 3,20,000", "₹ 6,40,000", "₹ 12,50,000", "₹ 25,00,000",
        "₹ 50,00,000", "₹ 1 Crore", "₹ 3 Crore", "₹ 7 Crore",
    ].reverse();

    // --- DOM ELEMENTS ---
    const screens = {
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen'),
        explanation: document.getElementById('explanation-screen'),
        end: document.getElementById('end-screen'),
    };
    const startButton = document.getElementById('start-button');
    const startScreenLevels = document.getElementById('start-screen-levels');
    
    const prizeList = document.getElementById('prize-list');
    const questionText = document.getElementById('question-text');
    const questionTags = document.getElementById('question-tags');
    const optionsContainer = document.getElementById('options-container');
    
    const timerText = document.getElementById('timer-text');
    const timerProgress = document.getElementById('timer-progress');

    const lifelineFiftyFifty = document.getElementById('lifeline-fiftyFifty');
    const lifelineAskAI = document.getElementById('lifeline-askAI');

    const explanationTitle = document.getElementById('explanation-title');
    const explanationQuestion = document.getElementById('explanation-question');
    const explanationAnswer = document.getElementById('explanation-answer');
    const explanationText = document.getElementById('explanation-text');
    const proceedButton = document.getElementById('proceed-button');

    const endTitle = document.getElementById('end-title');
    const endPrize = document.getElementById('end-prize');
    const restartButton = document.getElementById('restart-button');

    const askAIModal = document.getElementById('ask-ai-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalLoadingState = document.getElementById('modal-loading-state');
    const modalAdviceState = document.getElementById('modal-advice-state');
    const modalAnswer = document.getElementById('modal-answer');
    const modalExplanation = document.getElementById('modal-explanation');


    // --- GAME STATE ---
    let currentLevel = 0;
    let gameQuestions = [];
    let usedLifelines = new Set();
    let isAnswered = false;
    let timerInterval;

    // --- GAME LOGIC ---

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const showScreen = (screenName) => {
        Object.values(screens).forEach(screen => screen.classList.add('hidden'));
        screens[screenName].classList.remove('hidden');
    };

    const startGame = () => {
        currentLevel = 0;
        usedLifelines.clear();
        gameQuestions = shuffleArray([...QUESTIONS]).slice(0, TOTAL_LEVELS);
        
        if (gameQuestions.length < TOTAL_LEVELS) {
            alert("Not enough questions to start the game!");
            return;
        }

        updateLifelineButtons();
        displayQuestion();
        showScreen('game');
    };

    const displayQuestion = () => {
        isAnswered = false;
        const questionData = gameQuestions[currentLevel];
        
        // Update Prize Ladder
        prizeList.innerHTML = PRIZE_MONEY.map((amount, index) => {
            const level = TOTAL_LEVELS - index;
            const isCurrent = level === currentLevel + 1;
            const isCleared = level <= currentLevel;
            
            let styles = "text-gray-400";
            if (isCurrent) styles = "bg-yellow-500 text-black font-bold scale-105";
            if (isCleared) styles = "text-yellow-400";

            return `<li class="p-2 my-1 md:my-0.5 text-sm md:text-base lg:text-lg rounded-md transition-all duration-300 text-center md:text-left ${styles}">
              <span class="font-semibold mr-2 text-gray-500">${level.toString().padStart(2, '0')}</span>
              ${amount}
            </li>`;
        }).join('');

        // Update Question
        questionText.textContent = questionData.question;
        questionTags.innerHTML = `
            <span class="bg-yellow-600/50 text-yellow-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">${questionData.tags.year}</span>
            <span class="bg-blue-600/50 text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">${questionData.tags.subject}</span>`;
        
        // Update Options
        optionsContainer.innerHTML = '';
        const optionPrefixes = ['A', 'B', 'C', 'D'];
        questionData.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = "w-full text-left p-4 rounded-lg border-2 border-blue-400/50 transition-all duration-300 transform bg-blue-900/50 hover:bg-blue-700/70 hover:scale-105";
            button.innerHTML = `<span class="font-bold text-yellow-400 mr-3">${optionPrefixes[index]}:</span> ${option}`;
            button.dataset.option = option;
            button.addEventListener('click', () => handleAnswer(option, false));
            optionsContainer.appendChild(button);
        });

        startTimer();
    };

    const handleAnswer = (selectedOption, timedOut) => {
        if (isAnswered) return;
        isAnswered = true;
        clearInterval(timerInterval);
        
        const questionData = gameQuestions[currentLevel];
        const isCorrect = !timedOut && selectedOption === questionData.answer;

        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = true;
            const option = btn.dataset.option;
            if (option === questionData.answer) {
                btn.classList.remove('bg-blue-900/50');
                btn.classList.add('bg-green-600', 'animate-pulse');
            } else if (option === selectedOption) {
                btn.classList.remove('bg-blue-900/50');
                btn.classList.add('bg-red-600');
            } else {
                 btn.classList.add('opacity-50');
            }
        });

        setTimeout(() => {
            showExplanation(isCorrect, timedOut);
        }, 3000);
    };

    const showExplanation = (isCorrect, isTimedOut) => {
        const questionData = gameQuestions[currentLevel];
        
        if (isTimedOut) {
            explanationTitle.textContent = "Time's Up!";
            explanationTitle.className = "text-5xl md:text-6xl font-bold mb-6 text-yellow-400";
        } else if (isCorrect) {
            explanationTitle.textContent = "Correct!";
            explanationTitle.className = "text-5xl md:text-6xl font-bold mb-6 text-green-400";
        } else {
            explanationTitle.textContent = "Incorrect";
            explanationTitle.className = "text-5xl md:text-6xl font-bold mb-6 text-red-500";
        }

        explanationQuestion.textContent = questionData.question;
        explanationAnswer.textContent = questionData.answer;
        explanationText.textContent = questionData.explanation;

        if (!isCorrect || isTimedOut) {
            proceedButton.textContent = "View Results";
            proceedButton.onclick = showEndScreen;
        } else if (currentLevel === TOTAL_LEVELS - 1) {
             proceedButton.textContent = "View Results";
             proceedButton.onclick = () => showEndScreen(true); // Won
        } else {
            proceedButton.textContent = "Continue";
            proceedButton.onclick = nextQuestion;
        }
        
        showScreen('explanation');
    };

    const nextQuestion = () => {
        currentLevel++;
        displayQuestion();
        showScreen('game');
    };

    const showEndScreen = (isWinner = false) => {
        if (isWinner) {
            const prizeWon = PRIZE_MONEY[0];
            endTitle.textContent = "Congratulations!";
            endPrize.textContent = `You have won the grand prize of ${prizeWon}!`;
        } else {
            const prizeWon = currentLevel > 0 ? PRIZE_MONEY[TOTAL_LEVELS - currentLevel] : "₹ 0";
            if (currentLevel > 0) {
                endTitle.textContent = "Well Played!";
                endPrize.textContent = `You have won ${prizeWon}.`;
            } else {
                endTitle.textContent = "Game Over";
                endPrize.textContent = `You walk away with ${prizeWon}.`;
            }
        }
        showScreen('end');
    };
    
    // --- TIMER ---
    const startTimer = () => {
        clearInterval(timerInterval);
        let timeLeft = TIMER_DURATION;
        
        const updateTimerDisplay = () => {
            timerText.textContent = timeLeft;
            const progress = (timeLeft / TIMER_DURATION) * 100;
            timerProgress.setAttribute('stroke-dasharray', `${progress}, 100`);

            let colorClass = 'text-green-400';
            if (timeLeft <= 10) colorClass = 'text-red-500';
            else if (timeLeft <= 20) colorClass = 'text-yellow-400';
            
            timerText.className = `text-4xl font-bold ${colorClass}`;
            timerProgress.className = `transition-all duration-1000 ease-linear ${colorClass}`;
        }
        
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleAnswer("", true);
            }
        }, 1000);
    };

    // --- LIFELINES ---
    const updateLifelineButtons = () => {
        lifelineFiftyFifty.disabled = usedLifelines.has('fiftyFifty') || isAnswered;
        lifelineAskAI.disabled = usedLifelines.has('askAI') || isAnswered;
        
        document.querySelectorAll('.lifeline-button').forEach(btn => {
            if(btn.disabled) {
                btn.classList.add('disabled-lifeline');
            } else {
                btn.classList.remove('disabled-lifeline');
            }
        });
    };
    
    const useFiftyFifty = () => {
        if (usedLifelines.has('fiftyFifty') || isAnswered) return;
        usedLifelines.add('fiftyFifty');
        updateLifelineButtons();

        const questionData = gameQuestions[currentLevel];
        const wrongOptions = questionData.options.filter(opt => opt !== questionData.answer);
        const randomWrongOptionToKeep = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        const optionsToHide = wrongOptions.filter(opt => opt !== randomWrongOptionToKeep);

        Array.from(optionsContainer.children).forEach(btn => {
            if (optionsToHide.includes(btn.dataset.option)) {
                btn.classList.add('opacity-40', 'cursor-not-allowed');
                btn.disabled = true;
            }
        });
    };

    const useAskAI = () => {
        if (usedLifelines.has('askAI') || isAnswered) return;
        usedLifelines.add('askAI');
        updateLifelineButtons();
        
        askAIModal.classList.remove('hidden');
        modalLoadingState.classList.remove('hidden');
        modalAdviceState.classList.add('hidden');

        setTimeout(() => {
            const questionData = gameQuestions[currentLevel];
            modalAnswer.textContent = questionData.answer;
            modalExplanation.textContent = `Of course, I can help with that. After carefully analyzing the question and the provided options, my expert opinion is that the correct answer is **${questionData.answer}**. Here's the reasoning behind this conclusion: ${questionData.explanation}`;
            modalLoadingState.classList.add('hidden');
            modalAdviceState.classList.remove('hidden');
        }, 1500);
    };
    
    const closeModal = () => {
        askAIModal.classList.add('hidden');
    };

    // --- INITIALIZATION ---
    const initialize = () => {
        startScreenLevels.textContent = `Welcome to the ultimate test of knowledge! Answer ${TOTAL_LEVELS} questions from UPSC Prelims and win the grand prize.`;
        startButton.addEventListener('click', startGame);
        restartButton.addEventListener('click', () => showScreen('start'));
        lifelineFiftyFifty.addEventListener('click', useFiftyFifty);
        lifelineAskAI.addEventListener('click', useAskAI);
        modalCloseButton.addEventListener('click', closeModal);
        showScreen('start');
    };

    initialize();
});
