const cells = document.querySelectorAll('[data-cell]');
const winnerDisplay = document.getElementById('winnerDisplay');
const winnerText = document.getElementById('winnerText');
const restartButton = document.getElementById('restartButton');
let currentPlayer = 'X'; // Player starts first
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);

function handleCellClick(e) {
    const cell = e.target;
    if (cell.textContent !== '' || !gameActive) {
        return;
    }
    cell.textContent = currentPlayer;
    checkWinner();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O') {
            aiMove();
        }
    }
}

function aiMove() {
    // Disable player interaction
    cells.forEach(cell => cell.classList.add('thinking'));
    const bestMove = findBestMove();

    // Simulate thinking time
    setTimeout(() => {
        if (bestMove !== null) {
            cells[bestMove].textContent = currentPlayer;
            checkWinner();
            if (gameActive) {
                currentPlayer = 'X';
            }
        }
        // Re-enable player interaction
        cells.forEach(cell => cell.classList.remove('thinking'));
    }, 1000); // 1 second delay for AI thinking
}

// Enhanced AI logic
function findBestMove() {
    // Check if AI can win
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (cells[a].textContent === 'O' && cells[b].textContent === 'O' && cells[c].textContent === '') {
            return c;
        }
        if (cells[a].textContent === 'O' && cells[c].textContent === 'O' && cells[b].textContent === '') {
            return b;
        }
        if (cells[b].textContent === 'O' && cells[c].textContent === 'O' && cells[a].textContent === '') {
            return a;
        }
    }
    // Check if player can win and block them
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (cells[a].textContent === 'X' && cells[b].textContent === 'X' && cells[c].textContent === '') {
            return c;
        }
        if (cells[a].textContent === 'X' && cells[c].textContent === 'X' && cells[b].textContent === '') {
            return b;
        }
        if (cells[b].textContent === 'X' && cells[c].textContent === 'X' && cells[a].textContent === '') {
            return a;
        }
    }
    // Choose a random available cell if no immediate win/block
    const availableCells = [...cells].filter(cell => cell.textContent === '');
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    return randomCell ? [...cells].indexOf(randomCell) : null;
}

function checkWinner() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
            declareWinner(cells[a].textContent);
            highlightWinningCells(condition);
            return;
        }
    }
    if ([...cells].every(cell => cell.textContent)) {
        declareWinner(null); // Draw
    }
}

function declareWinner(winner) {
    gameActive = false;
    const winnerName = winner === 'X' ? 'You 🎉 wins!' : winner === 'O' ? 'Soham Dalwadi 🤖 wins!' : 'It\'s a draw! 🤝';
    winnerText.textContent = `${winnerName}`;
    winnerDisplay.classList.add('visible');
}

function highlightWinningCells(condition) {
    condition.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

function restartGame() {
    location.reload(); // Refresh the page
}

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    cells.forEach(cell => {
        cell.classList.toggle('light');
    });
    winnerDisplay.classList.toggle('light');

    // Toggle icon between sun and moon
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.textContent = document.body.classList.contains('light') ? '🌞' : '🌙';
});
