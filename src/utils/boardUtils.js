// utility functions for the game board
export const copyBoard = (board) => {
  return board.map((row) => row.slice());
};

export const isGameOver = (board) => {
  return (
    getValidMoves(board, 'B').length === 0 &&
    getValidMoves(board, 'W').length === 0
  );
};

export const evaluateBoard = (board, player) => {
  let score = 0;
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell === player) score++;
      else if (cell !== null) score--;
    });
  });
  return score;
};

export const getValidMoves = (board, player) => {
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

export const makeMove = (board, row, col, player) => {
  board[row][col] = player;
  flipPieces(board, row, col, player);
};

export const isValidMove = (board, row, col, player) => {
  if (board[row][col] !== null) return false;
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
  ];
  const opponent = player === 'B' ? 'W' : 'B';

  for (const { x, y } of directions) {
    let r = row + y;
    let c = col + x;
    let hasOpponentPiece = false;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (board[r][c] === null) break;
      if (board[r][c] === player) {
        if (hasOpponentPiece) return true;
        break;
      }
      if (board[r][c] === opponent) hasOpponentPiece = true;
      r += y;
      c += x;
    }
  }
  return false;
};

export const flipPieces = (board, row, col, player) => {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
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
