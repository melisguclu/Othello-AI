import React, { useState } from 'react';
import '../styles/Modal.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

//we need to make some changes in order to do that, so in the modal: if the user selects "human vs ai" game , then 2 checkboxes should appear on the modal that says -random -minimax algorithm.


const Modal = ({ onClose, onSelect , onAISelect }) => {
  const [playType, setPlayType] = useState('human-vs-ai');
  const [aiType, setAiType] = useState('random');


  const handleSelect = (option) => {
    setPlayType(option.value);
    onSelect(option.value);
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
        <h2>Select AI Type</h2>
        <Dropdown options={[{ value: 'random', label: 'Random' }, { value: 'minimax', label: 'Minimax' }]} onChange={(option) => setAiType(option.value)} value={aiType} placeholder="Select an option" />
      </div>
    </div>
  );
};

export default Modal;