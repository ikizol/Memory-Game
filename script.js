// Define different themes
const themes = {
    fruits: ['🍌', '🍌', '🍓', '🍓', '🍒', '🍒', '🫐', '🫐', '🍉', '🍉', '🍎', '🍎', '🍊', '🍊', '🍋', '🍋'],
    animals: ['🐶', '🐶', '🐱', '🐱', '🦁', '🦁', '🐮', '🐮', '🐸', '🐸', '🐵', '🐵', '🐰', '🐰', '🐼', '🐼'],
    nature: ['🌻', '🌻', '🌲', '🌲', '🌊', '🌊', '🌋', '🌋', '🌟', '🌟', '🍂', '🍂', '🌴', '🌴', '🌤️', '🌤️']
};

let gameMode = 'solo'; // Default to solo mode


// DOM Elements
const startPage = document.getElementById("start-screen");
const startBtn = document.getElementById("start-button");
const memPage = document.getElementById("container-hidden");
const gameArea = document.querySelector('.game');
const timerDisplay = document.querySelector('.timer');
const resetBtn = document.getElementById("reset"); 
const backBtn = document.getElementById("back-Btn");
const themeSelector = document.getElementById("theme-selector");

// Timer variables
let seconds = 0;
let minutes = 0;
let timerInterval = null;
let gameStarted = false;

// Shuffled emojis array
let shuffledEmojis = [];

// Player State Variables
let currentPlayer = 1; // Start with Player 1
let player1Points = 0;
let player2Points = 0;

// DOM Elements for Scoreboard
const player1Score = document.getElementById("player1-score");
const player2Score = document.getElementById("player2-score");
const currentPlayerDisplay = document.getElementById("current-player");

// Update Scoreboard Function
function updateScoreboard() {
    player1Score.innerText = `Player 1: ${player1Points} points`;
    player2Score.innerText = `Player 2: ${player2Points} points`;
    currentPlayerDisplay.innerText = `Current Turn: Player ${currentPlayer}`;
}

// Shuffle emojis for the selected theme
function shuffleEmojis(theme) {
    const selectedTheme = themes[theme];
    shuffledEmojis = [...selectedTheme].sort(() => Math.random() - 0.5);
}

// Start Timer Function
function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            timerDisplay.innerText = `Time: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }, 1000);
    }
}

// Stop Timer Function
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Generate Game Board
function generateBoard() {
    gameArea.innerHTML = ''; // Clear any existing game board
    shuffledEmojis.forEach((emoji) => {
        const box = document.createElement('div');
        box.className = 'item';
        box.innerHTML = emoji;

        box.onclick = function () {
            startTimer(); // Start timer on first click
            this.classList.add('boxOpen');

            setTimeout(() => {
                const openBoxes = document.querySelectorAll('.boxOpen');
                if (openBoxes.length === 2) {
                    if (openBoxes[0].innerHTML === openBoxes[1].innerHTML) {
                        // Correct Match
                        openBoxes.forEach((box) => {
                            box.classList.add('boxMatch');
                            box.classList.remove('boxOpen');
                        });
                        // Award Points in 2-Player Mode
                        if (gameMode === 'two-player') {
                            if (currentPlayer === 1) {
                                player1Points++;
                            } else {
                                player2Points++;
                            }
                        }
                    } else {
                        // Incorrect Match
                        openBoxes.forEach((box) => box.classList.remove('boxOpen'));
                        if (gameMode === 'two-player') {
                            currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch turns
                        }
                    }

                    // Update scoreboard only in 2-Player Mode
                    if (gameMode === 'two-player') {
                        updateScoreboard();
                    }
                }

                // Check if all pairs are matched
                if (document.querySelectorAll('.boxMatch').length === shuffledEmojis.length) {
                    stopTimer();
                    if (gameMode === 'two-player') {
                        // Show winner for 2-Player Mode
                        if (player1Points > player2Points) {
                            alert(`Player 1 Wins! Score: ${player1Points} - ${player2Points}`);
                        } else if (player2Points > player1Points) {
                            alert(`Player 2 Wins! Score: ${player2Points} - ${player1Points}`);
                        } else {
                            alert(`It's a Tie! Score: ${player1Points} - ${player2Points}`);
                        }
                    } else {
                        // Solo Mode Completion
                        alert(`Congratulations! You matched all pairs in ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
                    }
                }
            }, 600);
        };

        gameArea.appendChild(box);
    });
}


// Reset Game State
function resetGame() {
    stopTimer();
    seconds = 0;
    minutes = 0;
    gameStarted = false;
    player1Points = 0;
    player2Points = 0;
    currentPlayer = 1;
    timerDisplay.innerText = 'Time: 0:00'; // Reset timer display
    const selectedTheme = themeSelector.value;
    shuffleEmojis(selectedTheme);
    generateBoard();

    // Hide the scoreboard in solo mode
    if (gameMode === 'solo') {
        player1Score.style.display = 'none';
        player2Score.style.display = 'none';
        currentPlayerDisplay.style.display = 'none';
    } else {
        player1Score.style.display = 'block';
        player2Score.style.display = 'block';
        currentPlayerDisplay.style.display = 'block';
        updateScoreboard();
    }
}



// Event Listeners
startBtn.addEventListener('click', () => {
    const selectedTheme = themeSelector.value; // Get the selected theme
    gameMode = document.getElementById('mode-selector').value; // Get the selected mode
    shuffleEmojis(selectedTheme); // Shuffle emojis for the selected theme
    startPage.style.display = 'none'; // Hide the start page
    memPage.style.display = 'flex'; // Show the memory game content
    resetGame(); // Reset and start a new game
});


backBtn.addEventListener('click', () => {
    resetGame();
    startPage.style.display = 'flex'; // Show the start page
    memPage.style.display = 'none'; // Hide the memory game content
});

// Reset Button Event Listener
resetBtn.addEventListener('click', resetGame);

// Reset Button Onclick (Specific Implementation)
// Reset Button Event Listener
resetBtn.addEventListener('click', () => {
    stopTimer(); // Stops the timer
    seconds = 0; // Reset seconds
    minutes = 0; // Reset minutes
    gameStarted = false; // Reset game state
    timerDisplay.innerText = 'Time: 0:00'; // Reset timer display

    // Reset player states
    player1Points = 0;
    player2Points = 0;
    currentPlayer = 1;
    updateScoreboard(); // Reset and display updated scoreboard

    // Get selected theme and regenerate the board
    const selectedTheme = themeSelector.value;
    shuffleEmojis(selectedTheme);
    generateBoard();

    // Hide the scoreboard if in solo mode
    if (gameMode === 'solo') {
        player1Score.style.display = 'none';
        player2Score.style.display = 'none';
        currentPlayerDisplay.style.display = 'none';
    } else {
        player1Score.style.display = 'block';
        player2Score.style.display = 'block';
        currentPlayerDisplay.style.display = 'block';
    }
});
