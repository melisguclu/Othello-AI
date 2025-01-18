import { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import Modal from './Modal';
import GameOverModal from './GameOverModal';
import axios from 'axios';

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
import { toast } from 'react-hot-toast';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

// const initialBoard = () => {
//   const board = Array(8)
//     .fill(null)
//     .map(() => Array(8).fill(null));
//   board[3][3] = 'W';
//   board[3][4] = 'B';
//   board[4][3] = 'B';
//   board[4][4] = 'W';
//   return board;
// };

//for fast test
const initialBoard = () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  board[0][0] = 'W';
  board[0][1] = 'W';
  board[0][2] = 'W';
  board[0][3] = 'W';
  board[0][4] = 'W';
  board[0][5] = 'B';
  board[0][6] = 'B';
  board[0][7] = 'B';

  board[1][0] = 'W';
  board[1][1] = 'W';
  board[1][2] = 'W';
  board[1][3] = 'W';
  board[1][4] = 'W';
  board[1][5] = 'B';
  board[1][6] = 'B';
  board[1][7] = 'B';

  board[2][0] = 'W';
  board[2][1] = 'W';
  board[2][2] = 'W';
  board[2][4] = 'W';
  board[2][5] = 'B';
  board[2][6] = 'B';
  board[2][7] = 'B';

  board[3][0] = 'W';
  board[3][1] = 'W';
  board[3][3] = 'B';
  board[3][4] = 'W';
  board[3][5] = 'B';
  board[3][6] = 'B';
  board[3][7] = 'B';

  board[4][0] = 'W';
  board[4][1] = 'W';
  board[4][2] = 'W';
  board[4][3] = 'W';
  board[4][4] = 'B';
  board[4][6] = 'B';
  board[4][7] = 'B';

  board[5][0] = 'B';
  board[5][1] = 'B';
  board[5][2] = 'B';
  board[5][3] = 'B';
  board[5][5] = 'B';
  board[5][6] = 'B';
  board[5][7] = 'B';

  board[6][0] = 'B';
  board[6][1] = 'B';
  board[6][2] = 'B';
  board[6][3] = 'B';
  board[6][4] = 'B';
  board[6][5] = 'B';
  board[6][6] = 'W';
  board[6][7] = 'W';

  board[7][0] = 'B';
  board[7][1] = 'B';
  board[7][2] = 'B';
  board[7][3] = 'B';
  board[7][4] = 'B';
  board[7][5] = 'B';
  board[7][6] = 'B';
  board[7][7] = 'W';

  return board;
};

const Game = () => {
  const [board, setBoard] = useState(initialBoard());
  const [score, setScore] = useState({ B: 2, W: 2 });
  const [currentPlayer, setCurrentPlayer] = useState('B');
  const [validMoves, setValidMoves] = useState([]);
  const [playType, setPlayType] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [gameOverModalOpen, setGameOverModalOpen] = useState(false);
  const [latestDisc, setLatestDisc] = useState(null);
  const [aiType, setAiType] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { user } = useContext(UserContext);

  // if (!user) {
  //   console.error('User is not defined. Please ensure the user is logged in.');
  // }
  // if (user) {
  //   console.log('User is defined:', user);
  //   console.log('User ID:', user.id);
  // }
  // Kullanıcı değiştiğinde gerekli işlemleri yap
  useEffect(() => {
    if (user) {
      console.log('User logged in:', user);
    } else {
      console.log('User logged out or not defined.');
    }
  }, [user]);

  const checkGameOver = (newBoard) => {
    if (isGameOver(newBoard)) {
      const winner =
        score.B > score.W ? 'win' : score.B < score.W ? 'loss' : 'draw';

      if (user) {
        const gameData = {
          userId: user._id, // Giriş yapmış kullanıcıyı al
          mode: playType,
          aiType: aiType || null,
          result: winner,
          score: { player: score.B, opponent: score.W },
        };
        saveGameToDatabase(gameData);
      } else {
        console.log('User is not logged in. Skipping game save.');
      }

      setWinner(winner);
      setGameOver(true);
      setGameOverModalOpen(true);
      return true; // Oyun bitti
    }
    return false; // Oyun devam ediyor
  };

  useEffect(() => {
    setValidMoves(getValidMoves(board, currentPlayer));
  }, [board, currentPlayer]);

  const handleCellClick = useCallback(
    (row, col) => {
      if (playType === 'human-vs-ai' && currentPlayer === 'W') {
        return; //if it's AI's turn, dont let human player make a move
      }

      if (!gameStarted) {
        toast.error(
          'The game has not started yet! Please click the start game button'
        );
        return;
      }
      if (!isValidMove(board, row, col, currentPlayer)) {
        toast.error('Invalid move! Please select a valid move (grey cells)');
        return;
      }

      if (isValidMove(board, row, col, currentPlayer)) {
        const newBoard = copyBoard(board);
        makeMove(newBoard, row, col, currentPlayer);
        setLatestDisc({ row, col });
        updateScore(newBoard);
        setBoard(newBoard);

        if (!checkGameOver(newBoard)) {
          setCurrentPlayer(currentPlayer === 'B' ? 'W' : 'B');
        }
      }
    },
    [board, currentPlayer, playType, score]
  );

  useEffect(() => {
    if (playType === 'human-vs-ai' && currentPlayer === 'W') {
      if (validMoves.length === 0) {
        setCurrentPlayer('B'); //if AI has no valid moves, skip its turn
        return;
      }

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
          const newBoard = copyBoard(board);
          makeMove(newBoard, row, col, currentPlayer);
          setLatestDisc({ row, col });
          updateScore(newBoard);
          setBoard(newBoard);

          if (!checkGameOver(newBoard)) {
            setCurrentPlayer('B');
          }
        }, 1000);
      }
    }
  }, [currentPlayer, playType, aiType, validMoves, board, score]);

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

  const handleModalSelect = ({ playType, aiType }) => {
    setPlayType(playType);
    if (playType === 'human-vs-ai') {
      setAiType(aiType);
    }
    setShowModal(false);
    setGameStarted(true);
  };

  const handleRestart = () => {
    setBoard(initialBoard());
    setScore({ B: 2, W: 2 });
    setCurrentPlayer('B');
    setGameOver(false);
    setWinner(null);
    setShowModal(true);
    setLatestDisc(null);
    setGameStarted(false);
  };

  const handleCloseGameOverModal = () => {
    setGameOverModalOpen(false);
  };

  const saveGameToDatabase = async (gameData) => {
    try {
      console.log('Sending game data:', gameData);
      const response = await axios.post('/games/save', gameData, {
        withCredentials: true,
      });
      console.log('Game saved successfully:', response.data);
    } catch (error) {
      console.error(
        'Error saving game:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="game-container">
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSelect={handleModalSelect}
        />
      )}
      {gameOver && (
        <GameOverModal
          open={gameOverModalOpen}
          onClose={handleCloseGameOverModal}
          winner={winner}
          score={score}
          onRestart={handleRestart}
        />
      )}
      {gameStarted && (
        <ScoreBoard score={score} playType={playType} aiType={aiType} />
      )}
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
