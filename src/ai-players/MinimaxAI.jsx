export const makeMinimaxMove = (board, currentPlayer, depth = 3) => {
  const opponent = currentPlayer === 'B' ? 'W' : 'B';

  const copyBoard = (board) => {
    return board.map(row => row.slice());
  };

  const minimax = (board, depth, isMaximizing, alpha, beta) => {
    if (depth === 0 || isGameOver(board)) {
      return evaluateBoard(board, currentPlayer);
    }

    const validMoves = getValidMoves(board, isMaximizing ? currentPlayer : opponent);

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
        if (beta <= alpha) break; // Alfa-Beta Pruning
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
        if (beta <= alpha) break; // Alfa-Beta Pruning
      }
      return minEval;
    }
  };

  // En iyi hamleyi seçme
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

// Oyun bitti mi kontrol eder
const isGameOver = (board) => {
  // Tahtada geçerli hamle kalmadıysa veya diğer bitiş koşulları sağlanıyorsa true döner
  return getValidMoves(board, 'B').length === 0 && getValidMoves(board, 'W').length === 0;
};

// Tahtayı değerlendiren fonksiyon
const evaluateBoard = (board, currentPlayer) => {
  let score = 0;
  board.forEach(row => {
    row.forEach(cell => {
      if (cell === currentPlayer) score++;
      else if (cell !== null) score--;
    });
  });
  return score;
};

// Geçerli hamleleri bulan fonksiyon
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

// Tahtada verilen hamleyi yapan ve taşları çeviren fonksiyon
const makeMove = (board, row, col, player) => {
  board[row][col] = player;
  flipPieces(board, row, col, player);
};

// Geçerli bir hamle olup olmadığını kontrol eden fonksiyon
const isValidMove = (board, row, col, player) => {
  if (board[row][col] !== null) return false;
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

// Taşları çeviren fonksiyon
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
