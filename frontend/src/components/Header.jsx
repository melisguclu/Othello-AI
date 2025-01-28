import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/register');
    }
  };

  return (
    <div>
      <header style={headerStyle}>
        <h1
          style={h1Style}
          onClick={() => {
            navigate('/');
          }}
        >
          Othello
        </h1>
        <div style={headerLeft}>
          <button onClick={handleProfileClick}>Dashboard</button>
        </div>
      </header>
    </div>
  );
};

const headerStyle = {
  backgroundColor: 'black',
  color: 'white',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100vw',
  boxSizing: 'border-box',
  maxWidth: '100%',
  position: 'relative',
};

const h1Style = {
  margin: 0,
  fontSize: '2rem',
  textAlign: 'left',
  fontWeight: 600,
  cursor: 'pointer',
};

const headerLeft = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
};

export default Header;
