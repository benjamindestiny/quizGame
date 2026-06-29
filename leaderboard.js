// ============================================
// LEADERBOARD - COMPLETE JAVASCRIPT (FIXED)
// ============================================

// ---------- DOM ELEMENTS ----------
const leaderboardList = document.getElementById('leaderboardList');
const leaderboardCount = document.getElementById('leaderboardCount');

// ---------- RENDER LEADERBOARD ----------
function renderLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
    
    leaderboardCount.textContent = `${leaderboard.length} entries`;

    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = `
            <div class="empty-leaderboard">
                <i class="fas fa-trophy"></i>
                <p>No scores yet. Be the first to play!</p>
            </div>
        `;
        return;
    }

    const medals = ['🥇', '🥈', '🥉'];
    
    leaderboardList.innerHTML = leaderboard.map((entry, index) => `
        <div class="leaderboard-item ${index < 3 ? 'top-three' : ''}">
            <div class="rank">
                ${index < 3 ? medals[index] : `#${index + 1}`}
            </div>
            <div class="player-info">
                <span class="player-name">${escapeHTML(entry.name)}</span>
                <span class="player-date">${entry.date}</span>
            </div>
            <div class="player-score">
                <span class="score-value">${entry.score}/${entry.total}</span>
                <span class="score-percentage">${entry.percentage}%</span>
            </div>
        </div>
    `).join('');
}

// ---------- ESCAPE HTML ----------
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ---------- CLEAR LEADERBOARD ----------
function clearLeaderboard() {
    if (confirm('⚠️ Are you sure you want to clear all leaderboard scores?')) {
        localStorage.removeItem('quizLeaderboard');
        renderLeaderboard();
        showToast('🗑️ Leaderboard cleared!');
    }
}

// ---------- BACK TO QUIZ ----------
function backToQuiz() {
    // 🔧 FIX: Change this to 'quiz.html' if your main file is quiz.html
    window.location.href = 'quiz.html';  // or 'index.html'
}

// ---------- TOAST NOTIFICATION ----------
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        // Create toast if it doesn't exist
        const toastEl = document.createElement('div');
        toastEl.id = 'toast';
        toastEl.className = 'toast';
        toastEl.textContent = message;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 3000);
        return;
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---------- EVENT LISTENERS ----------
const backBtn = document.getElementById('backToQuizBtn');
const clearBtn = document.getElementById('clearLeaderboardBtn');

if (backBtn) backBtn.addEventListener('click', backToQuiz);
if (clearBtn) clearBtn.addEventListener('click', clearLeaderboard);

// ---------- INITIALISE ----------
renderLeaderboard();

console.log('🏆 Leaderboard loaded!');
console.log('📊 Total entries:', JSON.parse(localStorage.getItem('quizLeaderboard') || '[]').length);