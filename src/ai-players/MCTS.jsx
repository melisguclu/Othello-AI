// MCTS.js

// Monte Carlo Tree Search fonksiyonu
export const makeMCTSMove = (board, currentPlayer, iterations = 3000) => {
  class Node {
    constructor(state, parent = null) {
      this.state = state;
      this.parent = parent;
      this.children = [];
      this.visits = 0;
      this.wins = 0;
    }

    isFullyExpanded() {
      const validMoves = getValidMoves(this.state, currentPlayer);
      return this.children.length === validMoves.length;
    }

    bestChild() {
      if (this.children.length === 0) {
        return null;
      }

      return this.children.reduce((best, child) => {
        const bestUCB = (best.wins / best.visits) + Math.sqrt(2 * Math.log(this.visits) / best.visits);
        const childUCB = (child.wins / child.visits) + Math.sqrt(2 * Math.log(this.visits) / child.visits);
        return childUCB > bestUCB ? child : best;
      }, this.children[0]);
    }
  }

  const root = new Node(board);

  for (let i = 0; i < iterations; i++) {
    let node = selection(root);
    if (!node) break;
    let result = simulation(node.state, currentPlayer);
    backPropagation(node, result);
  }

  const bestMoveNode = root.bestChild();
  return bestMoveNode ? getMoveFromStateDifference(board, bestMoveNode.state) : null;

  function selection(node) {
    while (node.isFullyExpanded()) {
      const bestChild = node.bestChild();
      if (!bestChild) return node;
      node = bestChild;
    }
    return expansion(node);
  }

  function expansion(node) {
    const validMoves = getValidMoves(node.state, currentPlayer);
    for (const [row, col] of validMoves) {
      const newState = copyBoard(node.state);
      makeMove(newState, row, col, currentPlayer);
      const childNode = new Node(newState, node);
      node.children.push(childNode);
      return childNode;
    }
    return node;
  }

  function simulation(state, player) {
    let simulatedState = copyBoard(state);
    let currentSimPlayer = player;

    while (!isGameOver(simulatedState)) {
      const validMoves = getValidMoves(simulatedState, currentSimPlayer);
      if (validMoves.length === 0) break;
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      makeMove(simulatedState, randomMove[0], randomMove[1], currentSimPlayer);
      currentSimPlayer = currentSimPlayer === 'B' ? 'W' : 'B';
    }

    return evaluateBoard(simulatedState, player);
  }

  function backPropagation(node, result) {
    while (node !== null) {
      node.visits++;
      node.wins += result;
      node = node.parent;
    }
  }
};

// Yardımcı fonksiyonlar
const copyBoard = (board) => {
  return board.map(row => row.slice());
};

const isGameOver = (board) => {
  return getValidMoves(board, 'B').length === 0 && getValidMoves(board, 'W').length === 0;
};

const evaluateBoard = (board, player) => {
  let score = 0;
  board.forEach(row => {
    row.forEach(cell => {
      if (cell === player) score++;
      else if (cell !== null) score--;
    });
  });
  return score;
};

const getValidMoves = (board, player) => {
  const validMoves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isValidMove(board, row, col, player)) {
        validMoves.push([row, col]);
      }
    }
  }
  return validMoves;
};

const makeMove = (board, row, col, player) => {
  board[row][col] = player;
  flipPieces(board, row, col, player);
};

const isValidMove = (board, row, col, currentPlayer) => {
  if (row < 0 || row >= 8 || col < 0 || col >= 8) return false;
  if (board[row][col] !== null) return false;

  const directions = [
    { x: 1, y: 0 }, { x: -1, y: 0 },
    { x: 0, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 1 }, { x: -1, y: -1 },
    { x: 1, y: -1 }, { x: -1, y: 1 }
  ];

  let isValid = false;

  for (const { x, y } of directions) {
    let r = row + y;
    let c = col + x;
    let hasOpponentPiece = false;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (board[r][c] === null) break;
      if (board[r][c] === currentPlayer) {
        if (hasOpponentPiece) {
          isValid = true;
        }
        break;
      }
      hasOpponentPiece = true;
      r += y;
      c += x;
    }
  }

  return isValid;
};

const flipPieces = (board, row, col, player) => {
  const directions = [
    { x: 1, y: 0 }, { x: -1, y: 0 },
    { x: 0, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 1 }, { x: -1, y: -1 },
    { x: 1, y: -1 }, { x: -1, y: 1 }
  ];
  const opponent = player === 'B' ? 'W' : 'B';

  for (const { x, y } of directions) {
    let r = row + y;
    let c = col + x;
    const piecesToFlip = [];

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (board[r][c] === null) break;
      if (board[r][c] === player) {
        piecesToFlip.forEach(([flipRow, flipCol]) => {
          board[flipRow][flipCol] = player;
        });
        break;
      }
      if (board[r][c] === opponent) piecesToFlip.push([r, c]);
      r += y;
      c += x;
    }
  }
};

const getMoveFromStateDifference = (oldState, newState) => {
  for (let row = 0; row < oldState.length; row++) {
    for (let col = 0; col < oldState[row].length; col++) {
      if (oldState[row][col] !== newState[row][col]) {
        return [row, col];
      }
    }
  }
  return null;
};
