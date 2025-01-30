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
import { nanoid } from 'nanoid';
import { toast } from 'react-hot-toast';

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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard');
  };

  const handlePasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    setRoomId(text);
    toast.success('Room ID pasted from clipboard');
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
        <Button
          style={{
            ...buttonStyle,
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          Start Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Select Play Type</DialogTitle>
        <DialogDescription>Choose a play mode.</DialogDescription>
        <div>
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
                  ...buttonStyle,
                  backgroundColor: action === 'create' ? '#000' : '#ccc',
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
                  ...buttonStyle,
                  backgroundColor: action === 'join' ? '#000' : '#ccc',
                }}
              >
                Join Room
              </Button>
            </div>
            {action && (
              <div className="flex justify-center items-center gap-1">
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
                  style={{ ...inputStyle }}
                />
                {action === 'create' && (
                  <Button onClick={handleCopyToClipboard} style={buttonStyle}>
                    Copy
                  </Button>
                )}
                {action === 'join' && (
                  <Button
                    onClick={handlePasteFromClipboard}
                    style={buttonStyle}
                  >
                    Paste
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <Button onClick={handleSubmit} style={{ ...buttonStyle }}>
          Start Game
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#000',
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '10px 20px',
  height: '45px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
  textAlign: 'center',
};

export default Modal;
