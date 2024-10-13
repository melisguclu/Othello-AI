import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick, validMoves }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => {
            const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                piece={cell}
                onClick={() => onCellClick(rowIndex, colIndex)}
                isValidMove={isValidMove}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
