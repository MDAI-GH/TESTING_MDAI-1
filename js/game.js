// Interfaz y flujo de la partida.
const HUMAN = "X";
const AI = "O";
const AI_DELAY_MS = 350;

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const difficultyEl = document.getElementById("difficulty");
const firstPlayerEl = document.getElementById("first-player");
const scoreEls = {
  human: document.getElementById("score-human"),
  draw: document.getElementById("score-draw"),
  ai: document.getElementById("score-ai"),
};

const score = { human: 0, draw: 0, ai: 0 };
let board;
let gameOver;
let aiThinking;
let aiTimer;

const cells = Array.from({ length: 9 }, (_, i) => {
  const cell = document.createElement("button");
  cell.className = "cell";
  cell.setAttribute("aria-label", `Casilla ${i + 1}`);
  cell.addEventListener("click", () => onHumanMove(i));
  boardEl.appendChild(cell);
  return cell;
});

function render(winLine = []) {
  board.forEach((value, i) => {
    const cell = cells[i];
    cell.textContent = value ?? "";
    cell.classList.toggle("x", value === HUMAN);
    cell.classList.toggle("o", value === AI);
    cell.classList.toggle("win", winLine.includes(i));
    cell.disabled = Boolean(value) || gameOver || aiThinking;
  });
}

function updateScore() {
  for (const key of Object.keys(score)) scoreEls[key].textContent = score[key];
}

// Revisa si la partida terminó; devuelve true si es así.
function checkEnd() {
  const winner = getWinner(board);
  if (winner) {
    gameOver = true;
    const humanWon = winner.player === HUMAN;
    statusEl.textContent = humanWon ? "¡Ganaste! 🎉" : "La IA gana 🤖";
    score[humanWon ? "human" : "ai"]++;
    updateScore();
    render(winner.line);
    return true;
  }
  if (emptyCells(board).length === 0) {
    gameOver = true;
    statusEl.textContent = "Empate 🤝";
    score.draw++;
    updateScore();
    render();
    return true;
  }
  return false;
}

function onHumanMove(i) {
  if (gameOver || aiThinking || board[i]) return;
  board[i] = HUMAN;
  render();
  if (!checkEnd()) playAi();
}

function playAi() {
  aiThinking = true;
  statusEl.textContent = "La IA está pensando…";
  render();
  aiTimer = setTimeout(() => {
    board[chooseAiMove(board, AI, HUMAN, difficultyEl.value)] = AI;
    aiThinking = false;
    render();
    if (!checkEnd()) statusEl.textContent = "Tu turno (X)";
  }, AI_DELAY_MS);
}

function newGame() {
  clearTimeout(aiTimer);
  board = Array(9).fill(null);
  gameOver = false;
  aiThinking = false;
  statusEl.textContent = "Tu turno (X)";
  render();
  if (firstPlayerEl.value === "ai") playAi();
}

document.getElementById("restart").addEventListener("click", newGame);
firstPlayerEl.addEventListener("change", newGame);

newGame();
