export const makeRandomMove = (validMoves) => {
  if (validMoves.length === 0) return null; // Geçerli hamle yoksa
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};
