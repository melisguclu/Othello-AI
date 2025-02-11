import React from 'react';
import styled from 'styled-components';

const ScoreBoard = ({ score, playType, aiType, currentPlayer }) => {
  return (
    <>
      <ScoreBoardContainer>
        <ScoreHeading>Play Type: {playType}</ScoreHeading>
        {playType === 'human-vs-ai' && (
          <ScoreHeading>AI Type: {aiType}</ScoreHeading>
        )}
        <ScoreHeading $isactive={currentPlayer === 'B'}>
          Black: {score.B}
        </ScoreHeading>
        <ScoreHeading $isactive={currentPlayer === 'W'}>
          White: {score.W}
        </ScoreHeading>
      </ScoreBoardContainer>
    </>
  );
};

const ScoreBoardContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 20px;
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const ScoreHeading = styled.h2`
  font-size: 16px;
  margin: 0;
  flex: 1 1 auto;
  text-align: center;
  text-decoration: ${({ $isactive }) => ($isactive ? 'underline' : 'none')};

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export default ScoreBoard;
