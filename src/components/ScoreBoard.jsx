import React from 'react';

const ScoreBoard = ({ score }) => {
  return (
    <div className="score-board">
      <h2>Player 1: {score.player1}</h2>
      <h2>Player 2: {score.player2}</h2>
    </div>
  );
};

export default ScoreBoard;
