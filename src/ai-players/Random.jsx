export const makeRandomMove = (validMoves) => {
  if (validMoves.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * validMoves.length);
  return validMoves[randomIndex];
};
