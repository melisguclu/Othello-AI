import React from 'react';

const Cell = ({ piece, onClick, isValidMove }) => {
  return (
    <div
      className="cell"
      onClick={onClick}
      style={{ backgroundColor: isValidMove ? 'gray' : 'transparent' }} // Geçerli hamleler gri renkte olacak
    >
      {piece && <span className={piece === 'B' ? 'black-piece' : 'white-piece'}>{piece}</span>}
    </div>
  );
};

export default Cell;
