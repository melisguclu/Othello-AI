import React, { useState } from 'react';
import '../styles/Modal.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useNavigate } from 'react-router-dom';

const Modal = ({ onClose, onSelect }) => {
  const [playType, setPlayType] = useState('human-vs-ai');
  const [aiType, setAiType] = useState('minimax');
  const navigate = useNavigate();

  const handlePlayTypeSelect = (option) => {
    setPlayType(option.value);
  };

  const handleSubmit = () => {
    if (playType === 'human-vs-ai') {
      onSelect({ playType, aiType });
    } else {
      onSelect({ playType });
    }
    onClose();
  };

  const playTypeOptions = [
    { value: 'human-vs-ai', label: 'Human vs AI' },
    { value: 'human-vs-human', label: 'Human vs Human' },
  ];

  const aiTypeOptions = [
    { value: 'minimax', label: 'Minimax' },
    { value: 'random', label: 'Random' },
    { value: 'mcts', label: 'Monte Carlo Tree Search' },
  ];

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Play Type</h2>
        <Dropdown
          options={playTypeOptions}
          onChange={handlePlayTypeSelect}
          value={playTypeOptions.find((option) => option.value === playType)}
          placeholder="Select Play Type"
        />
        {playType === 'human-vs-ai' && (
          <>
            <h2>Select AI Type</h2>
            <Dropdown
              options={aiTypeOptions}
              onChange={(option) => setAiType(option.value)}
              value={aiTypeOptions.find((option) => option.value === aiType)}
              placeholder="Select AI Type"
            />
          </>
        )}

        <button
          onClick={handleSubmit}
          className="submit-button"
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px',
            marginTop: '30px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Start Game
        </button>

        <button
          className="login-button"
          onClick={() => navigate('/register')}
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px',
            marginTop: '30px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Modal;
