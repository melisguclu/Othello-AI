import React from 'react';

const ScoreBoard = ({ score }) => {
  return (
    <div className="score-board">
      <h2>Siyah (B): {score.B}</h2>
      <h2>Beyaz (W): {score.W}</h2>
    </div>
  );
};

export default ScoreBoard;
