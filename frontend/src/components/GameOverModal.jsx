import React from 'react';

const GameOverModal = ({ winner, score, onRestart }) => {
  return (
    <div className="game-over-modal">
      <div className="modal-content">
        <h2>Game Over!</h2>
        <p>
          <strong>Winner:</strong> {winner ? winner : 'Draw!'}
        </p>
        <p>
          <strong>Score:</strong> Black: {score.B} - White: {score.W}
        </p>
        <button onClick={onRestart} className="restart-button">
          Play Again
        </button>
      </div>
      <style jsx>{`
        .game-over-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        .modal-content h2 {
          margin-bottom: 10px;
          color: #333;
        }
        .modal-content p {
          margin: 10px 0;
          color: #555;
        }
        .restart-button {
          padding: 10px 20px;
          border: none;
          background: rgb(0, 0, 0);
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
        .restart-button:hover {
          background: #007bff;
        }
      `}</style>
    </div>
  );
};

export default GameOverModal;
