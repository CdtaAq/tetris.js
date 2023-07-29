const gameBoard = document.querySelector(".game-board");
const scoreDisplay = document.querySelector(".score");

const ROWS = 20;
const COLS = 10;
const EMPTY_BLOCK = 0;

const colors = ["#000", "#f00", "#0f0", "#00f", "#f80", "#f0f", "#0ff", "#888"];

let board = [];
let currentPiece = { shape: [], x: 0, y: 0, color: "" };
let score = 0;

function initializeBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY_BLOCK));
}

function drawBoard() {
  gameBoard.innerHTML = board
    .map((row) =>
      row
        .map((cell) => `<div class="block" style="background-color:${colors[cell]}"></div>`)
        .join("")
    )
    .join("");
}

function generatePiece() {
  const pieces = [
    { shape: [[1, 1, 1, 1]], color: 1 }, // I
    { shape: [[1, 1, 1], [0, 1, 0]], color: 2 }, // T
    { shape: [[1, 1, 1], [1, 0, 0]], color: 3 }, // L
    // Add more shapes here
  ];

  const piece = pieces[Math.floor(Math.random() * pieces.length)];
  currentPiece.shape = piece.shape;
  currentPiece.color = piece.color;
  currentPiece.x = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
  currentPiece.y = 0;
}

function canMove(x, y, shape) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;

        if (newX < 0 || newX >= COLS || newY >= ROWS) return false;

        if (newY >= 0 && board[newY][newX] !== EMPTY_BLOCK) return false;
      }
    }
  }
  return true;
}

function mergePiece() {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const x = currentPiece.x + col;
        const y = currentPiece.y + row;
        board[y][x] = currentPiece.color;
      }
    }
  }
}

function clearLines() {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every((cell) => cell !== EMPTY_BLOCK)) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(EMPTY_BLOCK));
      score += 10;
    }
  }
}

function updateGame() {
  if (canMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
    currentPiece.y++;
  } else {
    mergePiece();
    clearLines();
    generatePiece();

    if (!canMove(currentPiece.x, currentPiece.y, currentPiece.shape)) {
      alert("Game Over! Your score: " + score);
      initializeBoard();
      score = 0;
    }
  }

  drawBoard();
  scoreDisplay.textContent = "Score: " + score;

  setTimeout(updateGame, 500); // Adjust the speed of the game
}

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 37 && canMove(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
    currentPiece.x--;
    drawBoard();
  } else if (event.keyCode === 39 && canMove(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
    currentPiece.x++;
    drawBoard();
  } else if (event.keyCode === 40) {
    updateGame();
  }
});

initializeBoard();
generatePiece();
updateGame();
