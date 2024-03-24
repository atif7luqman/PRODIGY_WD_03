// Define constants for players
const PLAYER_X = 'X';
const PLAYER_O = 'O';
let currentPlayer = PLAYER_X;
let gameActive = true;
let board = ['', '', '', '', '', '', '', '', ''];
let aiPlayer = PLAYER_O;

// Function to handle game mode selection
function handleGameModeChange() {
  const gameMode = document.querySelector('input[name="gameMode"]:checked').value;
  const playerNamesContainer = document.querySelector('.player-names');
  if (gameMode === 'twoPlayers') {
    playerNamesContainer.style.display = 'block';
    aiPlayer = null; // Reset AI player
  } else {
    playerNamesContainer.style.display = 'none';
    aiPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X; // Set AI player
    if (currentPlayer === aiPlayer) {
      // AI makes the first move
      aiMakeMove();
    }
  }
}

// Function to handle cell click
function handleCellClick(cellIndex) {
  // Check if the game is active
  if (!gameActive) return;

  // Update the board with the current player's marker
  if (board[cellIndex] === '' && (aiPlayer !== currentPlayer || currentPlayer === PLAYER_X)) {
    board[cellIndex] = currentPlayer;
    renderBoard();
    checkWinCondition();
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;

    // If playing against AI and it's AI's turn, let AI make a move
    if (aiPlayer === currentPlayer) {
      aiMakeMove();
    }
  }
}

// Function for AI to make a move
function aiMakeMove() {
  // Simple AI: Choose the first empty cell
  const emptyCells = board.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cellIndex = emptyCells[randomIndex];
    board[cellIndex] = aiPlayer;
    renderBoard();
    checkWinCondition();
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  }
}

// Function to render the tic-tac-toe board
function renderBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
  });
}

/// Function to check for a winning condition or a tie
function checkWinCondition() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
  
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        // Highlight winning cells
        const cells = document.querySelectorAll('.cell');
        cells[a].classList.add('win');
        cells[b].classList.add('win');
        cells[c].classList.add('win');
  
        // Determine the winning message based on the game mode
        let winnerName;
        if (aiPlayer) {
          if (board[a] === aiPlayer) {
            winnerName = 'AI';
          } else {
            winnerName = 'User';
          }
        } else {
          // Get the names of the players
          const playerXName = document.getElementById('playerXName').value || 'Player X';
          const playerOName = document.getElementById('playerOName').value || 'Player O';
          winnerName = board[a] === PLAYER_X ? playerXName : playerOName;
        }
  
        // Display winning message with the winner's name
        document.getElementById('status').textContent = `${winnerName} wins!`;
  
        // End the game
        gameActive = false;
        return;
      }
    }
  
    // Check for a tie
    if (!board.includes('')) {
      // Display tie message
      document.getElementById('status').textContent = 'It\'s a tie!';
  
      // End the game
      gameActive = false;
      return;
    }
  }
       

// Function to restart the game
function restartGame() {
  // Reset game state
  currentPlayer = PLAYER_X;
  gameActive = true;
  board = ['', '', '', '', '', '', '', '', ''];

  // Clear cell content and remove win class
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('win');
  });

  // Clear status message
  document.getElementById('status').textContent = '';

  // If playing against AI and it's AI's turn, let AI make a move
  if (aiPlayer === currentPlayer) {
    aiMakeMove();
  }
}

// Add event listeners
document.querySelectorAll('.cell').forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});

document.getElementById('restartBtn').addEventListener('click', restartGame);
document.querySelectorAll('input[name="gameMode"]').forEach(mode => {
  mode.addEventListener('change', handleGameModeChange);
});

// Render initial board
renderBoard();
