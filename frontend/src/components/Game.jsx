import { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import Modal from './Modal';
import GameOverModal from './GameOverModal';
import { Button } from '@/components/ui/button';

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
import { UserContext } from '../context/userContext';
import { useSocket } from '../context/SocketContext';
import { api } from '../lib/api';

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
  const [gameOverModalOpen, setGameOverModalOpen] = useState(false);
  const [latestDisc, setLatestDisc] = useState(null);
  const [aiType, setAiType] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { user } = useContext(UserContext);
  const socket = useSocket();
  const [roomId, setRoomId] = useState('');
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);

  useEffect(() => {
    if (!socket || !roomId || playType !== 'play-with-friend') return;

    socket.emit('joinRoom', roomId);

    const handleGameState = ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
    };

    const handleReceiveMove = ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
    };

    const handlePlayerJoined = (players) => {
      if (players === 2) {
        setWaitingForPlayer(false);
        setGameStarted(true);
      }
    };

    const handlePlayerLeft = () => {
      console.log('Opponent left the room.');
      setWaitingForPlayer(true);
      setGameStarted(false);
    };

    socket.on('gameState', handleGameState);
    socket.on('receiveMove', handleReceiveMove);
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('playerLeft', handlePlayerLeft);

    return () => {
      socket.off('gameState', handleGameState);
      socket.off('receiveMove', handleReceiveMove);
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('playerLeft', handlePlayerLeft);
    };
  }, [socket, roomId, playType]);

  const checkGameOver = (newBoard) => {
    const blackValidMoves = getValidMoves(newBoard, 'B').length > 0;
    const whiteValidMoves = getValidMoves(newBoard, 'W').length > 0;

    if (!blackValidMoves && !whiteValidMoves) {
      const winner =
        score.B > score.W ? 'win' : score.B < score.W ? 'loss' : 'draw';

      if (user) {
        const gameData = {
          userId: user.id,
          mode: playType,
          aiType: aiType || null,
          result: winner,
          score: { player: score.B, opponent: score.W },
        };
        saveGameToDatabase(gameData);
      }

      setWinner(winner);
      setGameOver(true);
      setGameOverModalOpen(true);
      return true;
    }

    return false;
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

        if (playType === 'play-with-friend') {
          socket.emit('makeMove', {
            roomId,
            move: { row, col, player: currentPlayer },
          });
        }

        if (!checkGameOver(newBoard)) {
          setCurrentPlayer(currentPlayer === 'B' ? 'W' : 'B');
        }
      }
    },
    [board, currentPlayer, playType, score, gameStarted]
  );

  useEffect(() => {
    if (!gameStarted) return;

    const blackValidMoves = getValidMoves(board, 'B');
    const whiteValidMoves = getValidMoves(board, 'W');

    if (blackValidMoves.length === 0 && whiteValidMoves.length === 0) {
      if (!gameOver) {
        console.log('Both players have no valid moves. Game Over.');
        checkGameOver(board);
      }
      return;
    }

    //if no valid moves for current player skip turn
    if (currentPlayer === 'B' && blackValidMoves.length === 0) {
      console.log('B has no valid moves');
      toast.error('Black has no valid moves. Skipping turn.');
      setCurrentPlayer('W');
      return;
    }

    if (currentPlayer === 'W' && whiteValidMoves.length === 0) {
      console.log('W has no valid moves');
      toast.error('White has no valid moves. Skipping turn.');
      setCurrentPlayer('B');
      return;
    }

    if (playType === 'human-vs-ai' && currentPlayer === 'W') {
      let move;
      if (aiType === 'random') {
        move = makeRandomMove(whiteValidMoves);
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
  }, [currentPlayer, playType, aiType, board, gameStarted, gameOver]);

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

  const handleModalSelect = ({ playType, aiType, roomId, action }) => {
    setPlayType(playType);
    setRoomId(roomId);

    if (playType === 'play-with-friend') {
      if (action === 'create') {
        socket.emit('createRoom', roomId);
        setWaitingForPlayer(true);
      } else if (action === 'join') {
        socket.emit('joinRoom', roomId);
        setWaitingForPlayer(true);
      }
    } else if (playType === 'human-vs-human') {
      setWaitingForPlayer(false);
      setGameStarted(true);
    }

    if (playType === 'human-vs-ai') {
      setAiType(aiType);
      setGameStarted(true);
    }

    setShowModal(false);
  };

  const handleRestart = () => {
    if (socket && roomId) {
      socket.emit('leaveRoom', roomId);
    }

    setBoard(initialBoard());
    setScore({ B: 2, W: 2 });
    setCurrentPlayer('B');
    setGameOver(false);
    setWinner(null);
    setShowModal(true);
    setLatestDisc(null);
    setGameStarted(false);
    setPlayType('');
    setAiType('');
  };

  const handleCloseGameOverModal = () => {
    setGameOverModalOpen(false);
  };

  const saveGameToDatabase = async (gameData) => {
    try {
      console.log('Sending game data:', gameData);
      const response = await api.post('/games/save', gameData, {
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
      {waitingForPlayer && playType === 'play-with-friend' && (
        <div className="waiting-screen">
          <h2>
            Waiting for another player to join the room. Share this room ID with
            your friend: <strong>{roomId}</strong>
          </h2>
        </div>
      )}
      {gameStarted && (
        <>
          <div className="flex justify-center items-center gap-5">
            <ScoreBoard score={score} playType={playType} aiType={aiType} />
            <Button onClick={handleRestart} className="mt-4 mb-4">
              <ion-icon name="refresh"></ion-icon>
            </Button>
          </div>
        </>
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
