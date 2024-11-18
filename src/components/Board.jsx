import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick, validMoves , latestDisc }) => {
  return (
    <table className="board">
      <tbody>
        {board.map((row, rowIndex) => (
          <tr key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => {
              const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
              return (
                <td key={`${rowIndex}-${colIndex}`} className="board-cell">
                  <Cell
                    piece={cell}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                    isValidMove={isValidMove}
                    isLatest={latestDisc && latestDisc.row === rowIndex && latestDisc.col === colIndex}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;