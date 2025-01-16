import {
  copyBoard,
  getValidMoves,
  makeMove,
  evaluateBoard,
  isGameOver,
} from '../utils/boardUtils';

export const makeMinimaxMove = (board, currentPlayer, depth = 3) => {
  const opponent = currentPlayer === 'B' ? 'W' : 'B';

  const minimax = (board, depth, isMaximizing, alpha, beta) => {
    if (depth === 0 || isGameOver(board)) {
      return evaluateBoard(board, currentPlayer);
    }

    const validMoves = getValidMoves(
      board,
      isMaximizing ? currentPlayer : opponent
    );

    if (validMoves.length === 0) {
      return evaluateBoard(board, currentPlayer);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const [row, col] of validMoves) {
        const newBoard = copyBoard(board);
        makeMove(newBoard, row, col, currentPlayer);
        const evaluation = minimax(newBoard, depth - 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Alpha-Beta Pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const [row, col] of validMoves) {
        const newBoard = copyBoard(board);
        makeMove(newBoard, row, col, opponent);
        const evaluation = minimax(newBoard, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha-Beta Pruning
      }
      return minEval;
    }
  };

  let bestMove = null;
  let bestValue = -Infinity;
  const validMoves = getValidMoves(board, currentPlayer);

  for (const [row, col] of validMoves) {
    const newBoard = copyBoard(board);
    makeMove(newBoard, row, col, currentPlayer);
    const moveValue = minimax(newBoard, depth - 1, false, -Infinity, Infinity);
    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = [row, col];
    }
  }

  return bestMove;
};
