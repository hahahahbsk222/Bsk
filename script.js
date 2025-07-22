let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameMode = "";
let invisibleMode = false;

function startGame(mode) {
  gameMode = mode;
  invisibleMode = (mode === "invisible");
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  document.querySelector(".menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  drawBoard();
  if (gameMode !== "friend" && currentPlayer === "O") aiMove();
}

function drawBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  board.forEach((cell, i) => {
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell";
    cellDiv.dataset.index = i;
    cellDiv.onclick = () => handleMove(i);
    cellDiv.textContent = invisibleMode && cell === "" ? "" : cell;
    boardDiv.appendChild(cellDiv);
  });
  updateStatus();
}

function handleMove(index) {
  if (board[index] !== "") return;
  board[index] = currentPlayer;
  drawBoard();
  if (checkWinner(currentPlayer)) {
    document.getElementById("status").textContent = `${currentPlayer} Menang!`;
    setTimeout(restartGame, 3000);
    return;
  }
  if (board.every(cell => cell !== "")) {
    document.getElementById("status").textContent = "Seri!";
    setTimeout(restartGame, 3000);
    return;
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (gameMode !== "friend" && currentPlayer === "O") {
    setTimeout(aiMove, 300);
  }
}

function updateStatus() {
  document.getElementById("status").textContent = `Giliran: ${currentPlayer}`;
}

function aiMove() {
  let move;
  if (gameMode === "easy") {
    move = getRandomMove();
  } else if (gameMode === "medium") {
    move = getBestMove(false);
  } else {
    move = getBestMove(true);
  }
  if (move !== undefined) handleMove(move);
}

function getRandomMove() {
  const empty = board.map((val, i) => val === "" ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function getBestMove(isHard) {
  let bestScore = -Infinity;
  let move;
  board.forEach((cell, i) => {
    if (cell === "") {
      board[i] = "O";
      let score = minimax(board, 0, false, isHard);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });
  return move;
}

function minimax(newBoard, depth, isMaximizing, isHard) {
  if (checkWinner("O", newBoard)) return 10 - depth;
  if (checkWinner("X", newBoard)) return depth - 10;
  if (newBoard.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    newBoard.forEach((cell, i) => {
      if (cell === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false, isHard);
        newBoard[i] = "";
        best = Math.max(score, best);
      }
    });
    return best;
  } else {
    let best = Infinity;
    newBoard.forEach((cell, i) => {
      if (cell === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true, isHard);
        newBoard[i] = "";
        best = Math.min(score, best);
      }
    });
    return best;
  }
}

function checkWinner(player, customBoard = board) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => customBoard[index] === player)
  );
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  drawBoard();
  document.getElementById("status").textContent = "Permainan Baru Dimulai!";
}