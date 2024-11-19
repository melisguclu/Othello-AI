import React from 'react';

const ScoreBoard = ({ score, playType, aiType }) => {
  return (
    <div className="score-board" style={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
      <h2>Play Type: {playType}</h2>
      {playType === 'human-vs-ai' && <h2>AI Type: {aiType}</h2>}
      <h2>Black: {score.B}</h2>
      <h2>White: {score.W}</h2>
    </div>
  );
};

export default ScoreBoard;
