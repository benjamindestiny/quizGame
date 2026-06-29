// ============================================
// LEADERBOARD - COMPLETE JAVASCRIPT
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
    if (confirm('Are you sure you want to clear all leaderboard scores?')) {
        localStorage.removeItem('quizLeaderboard');
        renderLeaderboard();
    }
}

// ---------- BACK TO QUIZ ----------
function backToQuiz() {
    window.location.href = 'index.html';
}

// ---------- EVENT LISTENERS ----------
document.getElementById('backToQuizBtn').addEventListener('click', backToQuiz);
document.getElementById('clearLeaderboardBtn').addEventListener('click', clearLeaderboard);

// ---------- INITIALISE ----------
renderLeaderboard();

console.log('🏆 Leaderboard loaded!');
console.log('📊 Total entries:', JSON.parse(localStorage.getItem('quizLeaderboard') || '[]').length);