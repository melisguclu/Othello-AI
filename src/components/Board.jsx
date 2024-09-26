import React from 'react'
import Cell from './Cell.jsx'
import '../styles/Board.css'
import  { useState } from 'react';


const Board = () => {
  const initialBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  const [board, setBoard] = useState(initialBoard);

  const renderCells = () => {
    return board.map((row, rowIndex) => (
      row.map((cell, cellIndex) => (
        <Cell key={`${rowIndex}-${cellIndex}`} value={cell} />
      ))
    ));
  };

  return (
    <div className="board">
      {renderCells()}
    </div>
  );
};

export default Board;