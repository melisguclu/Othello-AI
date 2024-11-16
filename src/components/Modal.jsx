import React, { useState } from 'react';
import '../styles/Modal.css';

const Modal = ({ onClose, onSelect }) => {
  const [playType, setPlayType] = useState('human-vs-ai');

  const handleSelect = (event) => {
    setPlayType(event.target.value);
  };

  const handleSubmit = () => {
    onSelect(playType);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Select Play Type</h2>
        <select value={playType} onChange={handleSelect}>
          <option value="human-vs-ai">Human vs AI</option>
          <option value="human-vs-human">Human vs Human</option>
        </select>
        <button onClick={handleSubmit}>Start Game</button>
      </div>
    </div>
  );
};

export default Modal;