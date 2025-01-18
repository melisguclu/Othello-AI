import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
    <Dialog>
      <DialogTrigger asChild>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '40px',
          }}
        >
          Start Game
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Select Play Type</DialogTitle>
        <div style={{ marginBottom: '20px' }}>
          <Dropdown
            options={playTypeOptions}
            onChange={handlePlayTypeSelect}
            value={playTypeOptions.find((option) => option.value === playType)}
            placeholder="Select Play Type"
          />
        </div>
        {playType === 'human-vs-ai' && (
          <div style={{ marginBottom: '20px' }}>
            <DialogTitle style={{ marginBottom: '15px' }}>
              Select AI Type
            </DialogTitle>
            <Dropdown
              options={aiTypeOptions}
              onChange={(option) => setAiType(option.value)}
              value={aiTypeOptions.find((option) => option.value === aiType)}
              placeholder="Select AI Type"
            />
          </div>
        )}
        <Button
          onClick={handleSubmit}
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            height: '45px',
          }}
        >
          Start Game
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
