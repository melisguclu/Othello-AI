import { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import Modal from './Modal';
import GameOverModal from './GameOverModal';

import { makeMinimaxMove } from '../ai-players/MinimaxAI';
import { makeMCTSMove } from '../ai-players/MCTS';
import { makeRandomMove } from '../ai-players/Random';
import {
  copyBoard,
  isValidMove,
  getValidMoves,
  makeMove,
  isGameOver,
} from '../utils/boardUtils';

const initialBoard = () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  board[3][3] = 'W';
  board[3][4] = 'B';
  board[4][3] = 'B';
  board[4][4] = 'W';
  return board;
};

const Game = () => {
  const [board, setBoard] = useState(initialBoard());
  const [score, setScore] = useState({ B: 2, W: 2 });
  const [currentPlayer, setCurrentPlayer] = useState('B');
  const [validMoves, setValidMoves] = useState([]);
  const [playType, setPlayType] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [latestDisc, setLatestDisc] = useState(null);
  const [aiType, setAiType] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    setValidMoves(getValidMoves(board, currentPlayer));
  }, [board, currentPlayer]);

  const handleCellClick = useCallback(
    (row, col) => {
      if (isValidMove(board, row, col, currentPlayer)) {
        const newBoard = copyBoard(board);
        makeMove(newBoard, row, col, currentPlayer);
        setLatestDisc({ row, col });
        updateScore(newBoard);
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'B' ? 'W' : 'B');

        if (isGameOver(newBoard)) {
          const winner =
            score.B > score.W
              ? 'Siyah (B)'
              : score.B < score.W
                ? 'Beyaz (W)'
                : null;
          setWinner(winner);
          setGameOver(true);
        }
      }
    },
    [board, currentPlayer, score]
  );

  useEffect(() => {
    if (playType === 'human-vs-ai' && currentPlayer === 'W') {
      if (validMoves.length === 0) return;

      let move;
      if (aiType === 'random') {
        move = makeRandomMove(validMoves);
      } else if (aiType === 'minimax') {
        move = makeMinimaxMove(board, currentPlayer);
      } else if (aiType === 'mcts') {
        move = makeMCTSMove(board, currentPlayer);
      }

      if (move) {
        const [row, col] = move;
        setTimeout(() => {
          handleCellClick(row, col);
        }, 1000);
      }
    }
  }, [currentPlayer, playType, aiType, validMoves, board, handleCellClick]);

  const updateScore = (newBoard) => {
    const newScore = { B: 0, W: 0 };
    newBoard.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 'B') newScore.B++;
        if (cell === 'W') newScore.W++;
      });
    });
    setScore(newScore);
  };

  // Modal Seçimi
  const handleModalSelect = ({ playType, aiType }) => {
    setPlayType(playType);
    if (playType === 'human-vs-ai') {
      setAiType(aiType);
    }
    setShowModal(false);
  };

  const handleRestart = () => {
    setBoard(initialBoard());
    setScore({ B: 2, W: 2 });
    setCurrentPlayer('B');
    setGameOver(false);
    setWinner(null);
    setShowModal(true);
  };

  return (
    <div className="game-container">
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSelect={({ playType, aiType }) => {
            setPlayType(playType);
            setAiType(aiType);
          }}
        />
      )}
      {gameOver && (
        <GameOverModal
          winner={winner}
          score={score}
          onRestart={handleRestart}
        />
      )}
      <ScoreBoard score={score} playType={playType} aiType={aiType} />
      {/* <h3>{currentPlayer === 'B' ? "Siyah'ın Sırası" : "Beyaz'ın Sırası"}</h3> */}
      <Board
        board={board}
        onCellClick={handleCellClick}
        validMoves={validMoves}
        latestDisc={latestDisc}
      />
    </div>
  );
};

export default Game;
