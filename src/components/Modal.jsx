import React, { useState } from 'react';
import '../styles/Modal.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const Modal = ({ onClose, onSelect }) => {
  const [playType, setPlayType] = useState('human-vs-ai');

  const handleSelect = (option) => {
    setPlayType(option.value);
    console.log(option.value);
  };

  const options = [
    { value: 'human-vs-ai', label: 'Human vs AI' },
    { value: 'human-vs-human', label: 'Human vs Human' }
  ];
  const defaultOption = options[0];

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Select Play Type</h2>
        <Dropdown options={options} onChange={handleSelect} value={defaultOption} placeholder="Select an option" />
      </div>
    </div>
  );
};

export default Modal;