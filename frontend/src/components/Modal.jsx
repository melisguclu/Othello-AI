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
import { nanoid } from 'nanoid'; // Import nanoid

const Modal = ({ onClose, onSelect }) => {
  const [playType, setPlayType] = useState('human-vs-ai');
  const [aiType, setAiType] = useState('minimax');
  const [roomId, setRoomId] = useState('');
  const [action, setAction] = useState(''); //create or join a room

  const navigate = useNavigate();

  const handlePlayTypeSelect = (option) => {
    setPlayType(option.value);
  };

  const handleCreateRoom = () => {
    const generatedRoomId = `room-${nanoid(10)}`; // Use uuid to generate a unique room ID
    setRoomId(generatedRoomId);
    setAction('create');
  };

  const handleJoinRoom = () => {
    if (!roomId) {
      alert('Please enter a valid Room ID');
      return;
    }
    setAction('join');
  };

  const handleSubmit = () => {
    if (playType === 'human-vs-ai') {
      onSelect({ playType, aiType });
    } else if (playType === 'human-vs-human') {
      onSelect({ playType });
    } else if (playType === 'play-with-friend') {
      if (!roomId || !action) {
        alert('Please create or join a room before starting the game.');
        return;
      }
      onSelect({ playType, roomId, action });
    }
    onClose();
  };

  const playTypeOptions = [
    { value: 'human-vs-ai', label: 'Human vs AI' },
    { value: 'human-vs-human', label: 'Human vs Human' },
    { value: 'play-with-friend', label: 'Play With Your Friend' },
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
        {playType === 'play-with-friend' && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '15px',
              }}
            >
              <Button
                onClick={() => {
                  handleCreateRoom();
                  setAction('create');
                }}
                style={{
                  backgroundColor: action === 'create' ? '#000' : '#ccc',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Create Room
              </Button>
              <Button
                onClick={() => {
                  setAction('join');
                  setRoomId('');
                }}
                style={{
                  backgroundColor: action === 'join' ? '#000' : '#ccc',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Join Room
              </Button>
            </div>
            {action && (
              <div>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder={
                    action === 'create'
                      ? 'Room ID (generated)'
                      : 'Enter Room ID'
                  }
                  readOnly={action === 'create'}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    textAlign: 'center',
                  }}
                />
              </div>
            )}
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
