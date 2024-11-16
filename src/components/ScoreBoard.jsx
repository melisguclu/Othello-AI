import React from 'react';

const ScoreBoard = ({ score }) => {
  return (
    <div className="score-board" style={ 
      { 
        display: 'flex', 
        justifyContent: 'space-around', 
        backgroundColor: 'lightgray' ,
        gap: '20px',
      }
     } >
      <h2>Black: {score.B}</h2>
      <h2>White: {score.W}</h2>
    </div>
  );
};

export default ScoreBoard;
