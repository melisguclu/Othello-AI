import React, { useState, useEffect } from 'react';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import SettingsButton from './SettingsButton';

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

  const handleCellClick = (row, col) => {
    // Hamle geçerliyse taşları çevir
    if (isValidMove(row, col)) {
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;

      // Taşları çevirme mantığı 
      // ...

      // Skor güncelle
      updateScore(newBoard);
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'B' ? 'W' : 'B');
    }
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
    // Geçerli hamle kontrolü burada yap
    // rakip taşlarını çevirme koşulunu kontrol et
    return true; // şimdilik her zaman true kabul edelim
  };

  return (
    <div className="game-container">
      <SettingsButton />
      <ScoreBoard score={score} />
      <h3>{currentPlayer === 'B' ? "Siyah'ın Sırası" : "Beyaz'ın Sırası"}</h3>
      <Board board={board} onCellClick={handleCellClick} />
    </div>
  );
};

export default Game;
