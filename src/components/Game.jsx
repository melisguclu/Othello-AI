import React, { useState, useEffect } from 'react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import Modal from './Modal';
import { makeRandomMove} from '../ai-players/RandomAI';

const initialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
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
  const [validMoves, setValidMoves] = useState([]); // geçerli hamleleri tutmak için state
  const [playType, setPlayType] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [latestDisc, setLatestDisc] = useState(null);


  useEffect(() => {
    if (playType === 'human-vs-ai') {
      // Initialize game for Human vs AI
    } else if (playType === 'human-vs-human') {
      // Initialize game for Human vs Human
    }
  }, [playType]);

  useEffect(() => {
    highlightValidMoves(); 
  }, [board, currentPlayer]);

  useEffect(() => {
    if (playType === 'human-vs-ai' && currentPlayer === 'W') {
      if (validMoves.length > 0) {
        const [row, col] = makeRandomMove(validMoves);
        setTimeout(() => {
          handleCellClick(row, col);
        }, 1000);
      }
    }
  }, [currentPlayer, validMoves, playType]);

  const handleCellClick = (row, col) => {
    setLatestDisc({ row, col });
    if (isValidMove(row, col)) {
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;

      flipPieces(newBoard, row, col);
      updateScore(newBoard);
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'B' ? 'W' : 'B');
      checkGameOver();
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  const handlePlayTypeSelect = (type) => {
    setPlayType(type);
    setShowModal(false);
  };

  const updateScore = (newBoard) => {
    const newScore = { B: 0, W: 0 };
    newBoard.forEach(row => {
      row.forEach(cell => {
        if (cell === 'B') newScore.B++;
        if (cell === 'W') newScore.W++;
      });
    });
    setScore(newScore);
  };

  const isValidMove = (row, col) => {
    if (board[row][col] !== null) return false; // doluysa
    const directions = [
      { x: 1, y: 0 }, { x: -1, y: 0 },
      { x: 0, y: 1 }, { x: 0, y: -1 },
      { x: 1, y: 1 }, { x: -1, y: -1 },
      { x: 1, y: -1 }, { x: -1, y: 1 }
    ];
  
    let isValid = false; // Geçerli hamle olup olmadığını kontrol etmek için
  
    for (const { x, y } of directions) {
      let r = row + y;
      let c = col + x;
      let hasOpponentPiece = false;
  
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === null) break; // Boş hücreye ulaşırsak, yönü bırakıyoruz
        if (board[r][c] === currentPlayer) {
          if (hasOpponentPiece) {
            isValid = true; // Rakip taşı geçtikten sonra kendi taşımıza ulaşırsak, hamle geçerli
          }
          break; // Kendi taşımıza ulaştığımızda o yönü bırakabiliriz
        }
        hasOpponentPiece = true; // Rakip taş bulundu
        r += y;
        c += x;
      }
    }
    return isValid;
  };
  

  const highlightValidMoves = () => {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(row, col)) {
          moves.push([row, col]); // Geçerli hamleleri kaydet
        }
      }
    }
    setValidMoves(moves); // State'e geçerli hamleleri güncelle
  };

  const checkGameOver = () => {
    const hasMoves = (player) => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (isValidMove(row, col)) {
            return true;
          }
        }
      }
      return false;
    };

    if (!hasMoves('B') && !hasMoves('W')) {
      alert("Oyun Bitti! Skor: B: " + score.B + " W: " + score.W);
    }
  };

  const flipPieces = (newBoard, row, col) => {
    const directions = [
      { x: 1, y: 0 }, { x: -1, y: 0 },
      { x: 0, y: 1 }, { x: 0, y: -1 },
      { x: 1, y: 1 }, { x: -1, y: -1 },
      { x: 1, y: -1 }, { x: -1, y: 1 }
    ];

    for (const { x, y } of directions) {
      let r = row + y;
      let c = col + x;
      let piecesToFlip = [];

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (newBoard[r][c] === null) break;
        if (newBoard[r][c] === currentPlayer) {
          piecesToFlip.forEach(([flipRow, flipCol]) => {
            newBoard[flipRow][flipCol] = currentPlayer; 
          });
          break;
        }
        piecesToFlip.push([r, c]);
        r += y;
        c += x;
      }
    }
  };

  return (
    <div className="game-container">
      {showModal && <Modal onClose={handleModalClose} onSelect={handlePlayTypeSelect} />}
      <ScoreBoard score={score} playType={playType} />
      <h3>{currentPlayer === 'B' ? "Siyah'ın Sırası" : "Beyaz'ın Sırası"}</h3>
      <Board board={board} onCellClick={handleCellClick} validMoves={validMoves} latestDisc= { latestDisc } />
    </div>
  );
};

export default Game;
