import React from 'react';
import '../styles/Cell.css';

const Cell = ({ value }) => {
  return (
    <div className="cell">
      {value && <div className={`piece ${value}`}></div>}
    </div>
  );
};

export default Cell;
