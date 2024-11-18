import React from 'react';
import { useEffect, useState } from 'react';
import '../styles/Cell.css';

const Cell = ({ piece, onClick, isValidMove , isLatest }) => {

  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (piece) {
      setIsFlipping(true);
      const timer = setTimeout(() => setIsFlipping(false), 900); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [piece]);

  return (
    <div
      className={`cell ${isFlipping ? 'flipping' : ''} ${isValidMove ? 'valid-move' : ''} ${isLatest ? 'latest' : ''}`}
      onClick={onClick}
      style={{ backgroundColor: isValidMove ? 'gray' : 'transparent' }} // Geçerli hamleler gri renkte olacak
    >
      {piece && <span className={piece === 'B' ? 'black-piece' : 'white-piece'}></span>}
    </div>
  );
};

export default Cell;
