import React from 'react';

const Cell = ({ piece, onClick }) => {
  return (
    <div className="cell" onClick={onClick}>
      {piece && <span className={piece === 'B' ? 'black-piece' : 'white-piece'}>{piece}</span>}
    </div>
  );
};

export default Cell;
