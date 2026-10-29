// Lógica del tablero y la IA (minimax) para el juego del gato.
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }
  return null;
}

function emptyCells(board) {
  return board.reduce((acc, v, i) => (v ? acc : [...acc, i]), []);
}

// Devuelve el puntaje desde la perspectiva de `ai`; prefiere ganar rápido y perder tarde.
function minimax(board, depth, isAiTurn, ai, human) {
  const winner = getWinner(board);
  if (winner) return winner.player === ai ? 10 - depth : depth - 10;
  const moves = emptyCells(board);
  if (moves.length === 0) return 0;

  let best = isAiTurn ? -Infinity : Infinity;
  for (const i of moves) {
    board[i] = isAiTurn ? ai : human;
    const score = minimax(board, depth + 1, !isAiTurn, ai, human);
    board[i] = null;
    best = isAiTurn ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

function bestMove(board, ai, human) {
  let bestScore = -Infinity;
  let candidates = [];
  for (const i of emptyCells(board)) {
    board[i] = ai;
    const score = minimax(board, 0, false, ai, human);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      candidates = [i];
    } else if (score === bestScore) {
      candidates.push(i);
    }
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function randomMove(board) {
  const moves = emptyCells(board);
  return moves[Math.floor(Math.random() * moves.length)];
}

// Probabilidad de jugar de forma óptima según la dificultad.
const DIFFICULTY_SKILL = { easy: 0.2, medium: 0.65, hard: 1 };

function chooseAiMove(board, ai, human, difficulty) {
  const skill = DIFFICULTY_SKILL[difficulty] ?? 1;
  return Math.random() < skill ? bestMove(board, ai, human) : randomMove(board);
}

if (typeof module !== "undefined") {
  module.exports = { getWinner, emptyCells, bestMove, chooseAiMove };
}
