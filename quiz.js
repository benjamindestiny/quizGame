// ============================================
// QUIZ GAME - COMPLETE JAVASCRIPT
// ============================================

// ---------- QUIZ DATA ----------
const quizData = [
    {
        question: "What is the capital of Nigeria?",
        options: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
        correct: 1
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correct: 2
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "HCl"],
        correct: 0
    },
    {
        question: "Who wrote 'Things Fall Apart'?",
        options: ["Wole Soyinka", "Chinua Achebe", "Chimamanda Adichie", "Ben Okri"],
        correct: 1
    },
    {
        question: "What is the largest continent on Earth?",
        options: ["Africa", "Europe", "Asia", "North America"],
        correct: 2
    },
    {
        question: "How many sides does a hexagon have?",
        options: ["4", "5", "6", "7"],
        correct: 2
    },
    {
        question: "What does CPU stand for?",
        options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Core Processing Unit"],
        correct: 0
    },
    {
        question: "Which country has the largest population?",
        options: ["India", "China", "USA", "Indonesia"],
        correct: 0
    },
    {
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        correct: 2
    },
    {
        question: "Which year did Nigeria gain independence?",
        options: ["1957", "1960", "1963", "1966"],
        correct: 1
    }
];

// ---------- GAME STATE ----------
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval = null;
let isAnswered = false;
let startTime = 0;
let totalTime = 0;
let correctCount = 0;
let wrongCount = 0;
let playerName = '';

// ---------- DOM ELEMENTS ----------
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const optionsArea = document.getElementById('optionsArea');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');

const progressFill = document.getElementById('progressFill');
const questionCounter = document.getElementById('questionCounter');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');

const finalScore = document.getElementById('finalScore');
const resultMessage = document.getElementById('resultMessage');
const resultPercentage = document.getElementById('resultPercentage');
const resultIcon = document.getElementById('resultIcon');
const correctCountEl = document.getElementById('correctCount');
const wrongCountEl = document.getElementById('wrongCount');
const timeTakenEl = document.getElementById('timeTaken');

// ---------- NAME INPUT ----------
document.getElementById('nameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        startQuiz();
    }
});

// ---------- START QUIZ ----------
document.getElementById('startBtn').addEventListener('click', startQuiz);
document.getElementById('restartBtn').addEventListener('click', restartQuiz);
document.getElementById('leaderboardBtn').addEventListener('click', showLeaderboard);
document.getElementById('leaderboardBtn2').addEventListener('click', showLeaderboard);
nextBtn.addEventListener('click', nextQuestion);

function startQuiz() {
    const nameInput = document.getElementById('nameInput');
    playerName = nameInput.value.trim();
    if (!playerName) {
        nameInput.style.borderColor = '#ef4444';
        nameInput.placeholder = '⚠️ Please enter your name!';
        setTimeout(() => {
            nameInput.style.borderColor = '#e5e7eb';
            nameInput.placeholder = 'Enter your name...';
        }, 2000);
        return;
    }

    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    totalTime = 0;
    startTime = Date.now();
    loadQuestion();
}

function restartQuiz() {
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    totalTime = 0;
    startTime = Date.now();
}

// ---------- LEADERBOARD ----------
function showLeaderboard() {
    // Redirect to leaderboard page
    window.location.href = 'leaderboard.html';
}

// ---------- SAVE SCORE ----------
function saveScore() {
    const totalQuestions = quizData.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    const entry = {
        name: playerName,
        score: score,
        total: totalQuestions,
        percentage: percentage,
        time: totalTime,
        date: new Date().toLocaleDateString(),
        correct: correctCount,
        wrong: wrongCount
    };

    let leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
    leaderboard.push(entry);
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
    });
    leaderboard = leaderboard.slice(0, 20);
    localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));
}

// ---------- LOAD QUESTION ----------
function loadQuestion() {
    const question = quizData[currentQuestionIndex];
    const totalQuestions = quizData.length;

    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    questionText.textContent = question.question;
    questionCounter.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;

    const progress = ((currentQuestionIndex) / totalQuestions) * 100;
    progressFill.style.width = `${progress}%`;

    isAnswered = false;
    feedback.className = 'feedback';
    feedback.style.display = 'none';
    nextBtn.style.display = 'none';

    optionsArea.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span>${option}</span>
        `;
        btn.dataset.index = index;
        btn.addEventListener('click', () => selectAnswer(index));
        optionsArea.appendChild(btn);
    });

    clearInterval(timerInterval);
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;
    timerDisplay.parentElement.style.color = '#ef4444';
    startTimer();

    scoreDisplay.textContent = score;
}

// ---------- TIMER ----------
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 5) {
            timerDisplay.parentElement.style.color = '#ef4444';
            timerDisplay.style.animation = 'pulse 0.5s ease infinite';
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    if (isAnswered) return;
    isAnswered = true;

    feedback.className = 'feedback show timeout';
    feedback.textContent = '⏰ Time\'s up! Moving to next question...';
    feedback.style.display = 'block';

    const question = quizData[currentQuestionIndex];
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach((btn, index) => {
        btn.classList.add('disabled');
        if (index === question.correct) {
            btn.classList.add('correct');
        }
    });

    wrongCount++;
    nextBtn.style.display = 'block';
    if (currentQuestionIndex === quizData.length - 1) {
        nextBtn.innerHTML = 'See Results <i class="fas fa-trophy"></i>';
    }
}

// ---------- SELECT ANSWER ----------
function selectAnswer(selectedIndex) {
    if (isAnswered) return;
    clearInterval(timerInterval);
    isAnswered = true;

    const question = quizData[currentQuestionIndex];
    const allOptions = document.querySelectorAll('.option-btn');

    allOptions.forEach(btn => btn.classList.add('disabled'));

    const isCorrect = selectedIndex === question.correct;

    if (isCorrect) {
        score++;
        correctCount++;
        allOptions[selectedIndex].classList.add('correct');
        feedback.className = 'feedback show correct';
        feedback.textContent = '✅ Correct! Well done! 🎉';
        feedback.style.display = 'block';
        allOptions[selectedIndex].style.transform = 'scale(1.02)';
        setTimeout(() => { allOptions[selectedIndex].style.transform = ''; }, 300);
    } else {
        wrongCount++;
        allOptions[selectedIndex].classList.add('wrong');
        allOptions.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            }
        });
        feedback.className = 'feedback show wrong';
        feedback.textContent = `❌ Oops! The correct answer was: ${question.options[question.correct]}`;
        feedback.style.display = 'block';
    }

    scoreDisplay.textContent = score;
    nextBtn.style.display = 'block';

    if (currentQuestionIndex === quizData.length - 1) {
        nextBtn.innerHTML = 'See Results <i class="fas fa-trophy"></i>';
    } else {
        nextBtn.innerHTML = 'Next Question <i class="fas fa-arrow-right"></i>';
    }
}

// ---------- NEXT QUESTION ----------
function nextQuestion() {
    if (!isAnswered) return;

    if (currentQuestionIndex === quizData.length - 1) {
        endQuiz();
        return;
    }

    currentQuestionIndex++;
    loadQuestion();
}

// ---------- END QUIZ ----------
function endQuiz() {
    clearInterval(timerInterval);
    totalTime = Math.round((Date.now() - startTime) / 1000);

    saveScore();

    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    const percentage = Math.round((score / quizData.length) * 100);

    finalScore.textContent = score;
    correctCountEl.textContent = correctCount;
    wrongCountEl.textContent = wrongCount;
    timeTakenEl.textContent = `${totalTime}s`;
    resultPercentage.textContent = `${percentage}%`;

    let message, icon;
    if (percentage === 100) {
        message = '🌟 PERFECT SCORE! You\'re a genius! 🎉';
        icon = '🏆';
    } else if (percentage >= 80) {
        message = '🎉 Excellent! You really know your stuff!';
        icon = '🌟';
    } else if (percentage >= 60) {
        message = '👍 Good job! Keep learning and you\'ll improve!';
        icon = '📚';
    } else if (percentage >= 40) {
        message = '💪 Not bad! Review and try again!';
        icon = '💪';
    } else {
        message = '📖 Keep studying! Practice makes perfect!';
        icon = '📖';
    }

    resultMessage.textContent = message;
    resultIcon.textContent = icon;
}

// ---------- KEYBOARD SHORTCUTS ----------
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (nextBtn.style.display === 'block') {
            nextBtn.click();
        }
        if (startScreen.classList.contains('active')) {
            document.getElementById('startBtn').click();
        }
    }
    if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        const options = document.querySelectorAll('.option-btn:not(.disabled)');
        if (options[index]) {
            options[index].click();
        }
    }
});

// ---------- PULSE ANIMATION ----------
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

console.log('🎯 Quiz Game with Leaderboard loaded!');
console.log('📝 Total questions:', quizData.length);
console.log('💡 Press 1-4 to select answers, Enter for next.');