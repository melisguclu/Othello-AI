import {
  copyBoard,
  getValidMoves,
  makeMove,
  evaluateBoard,
  isGameOver,
  isValidMove,
} from '../utils/boardUtils';

class Node {
  constructor(state, parent = null, currentPlayer = 'B') {
    this.state = state;
    this.parent = parent;
    this.children = [];
    this.currentPlayer = currentPlayer;
    this.visits = 0;
    this.wins = 0;
  }

  isFullyExpanded() {
    const validMoves = getValidMoves(this.state, this.currentPlayer);
    return this.children.length === validMoves.length;
  }

  bestChild() {
    const epsilon = 1e-6;
    return this.children.reduce((best, child) => {
      const bestUCB =
        best.wins / (best.visits + epsilon) +
        Math.sqrt(
          (2 * Math.log(this.visits + epsilon)) / (best.visits + epsilon)
        );
      const childUCB =
        child.wins / (child.visits + epsilon) +
        Math.sqrt(
          (2 * Math.log(this.visits + epsilon)) / (child.visits + epsilon)
        );
      return childUCB > bestUCB ? child : best;
    }, this.children[0]);
  }
}

const selection = (node, currentPlayer) => {
  while (node.isFullyExpanded()) {
    const bestChild = node.bestChild();
    if (!bestChild) return node;
    node = bestChild;
  }
  return expansion(node, currentPlayer);
};

const expansion = (node, currentPlayer) => {
  const validMoves = getValidMoves(node.state, currentPlayer);

  validMoves.forEach(([row, col]) => {
    if (
      !node.children.some((child) => child.state[row][col] === currentPlayer)
    ) {
      const newState = copyBoard(node.state);
      makeMove(newState, row, col, currentPlayer);
      const childNode = new Node(newState, node, currentPlayer);
      node.children.push(childNode);
    }
  });

  return node.children[0];
};

const simulation = (state, player) => {
  const simulatedState = copyBoard(state);
  let currentSimPlayer = player;

  while (!isGameOver(simulatedState)) {
    const validMoves = getValidMoves(simulatedState, currentSimPlayer);
    if (validMoves.length === 0) {
      currentSimPlayer = currentSimPlayer === 'B' ? 'W' : 'B';
      continue;
    }
    const randomMove =
      validMoves[Math.floor(Math.random() * validMoves.length)];
    if (
      isValidMove(
        simulatedState,
        randomMove[0],
        randomMove[1],
        currentSimPlayer
      )
    ) {
      makeMove(simulatedState, randomMove[0], randomMove[1], currentSimPlayer);
    }
    currentSimPlayer = currentSimPlayer === 'B' ? 'W' : 'B';
  }

  return evaluateBoard(simulatedState, player);
};

const backPropagation = (node, result) => {
  while (node !== null) {
    node.visits++;
    node.wins += result > 0 ? 1 : 0;
    node = node.parent;
  }
};

export const makeMCTSMove = (board, currentPlayer, iterations = 1000) => {
  const root = new Node(board, null, currentPlayer);

  for (let i = 0; i < iterations; i++) {
    const node = selection(root, currentPlayer);
    if (!node) break;
    const result = simulation(node.state, currentPlayer);
    backPropagation(node, result);
  }

  const bestMoveNode = root.bestChild();
  return bestMoveNode
    ? getMoveFromStateDifference(board, bestMoveNode.state)
    : null;
};

const getMoveFromStateDifference = (oldState, newState) => {
  let difference = null;
  for (let row = 0; row < oldState.length; row++) {
    for (let col = 0; col < oldState[row].length; col++) {
      if (oldState[row][col] !== newState[row][col]) {
        // If a piece was added to the board
        if (oldState[row][col] === null && newState[row][col] !== null) {
          difference = [row, col];
        }
      }
    }
  }
  return difference;
};
