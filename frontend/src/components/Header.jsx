import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      console.log('user', user);
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
          <button onClick={handleProfileClick} style={button}>
            <ion-icon name="person"></ion-icon>
          </button>
          <a
            href="https://github.com/melisguclu"
            target="_blank"
            rel="noopener noreferrer"
            style={githubIconStyle}
          >
            <ion-icon name="logo-github"></ion-icon>
          </a>
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

const githubIconStyle = {
  color: 'white',
  fontSize: '2rem',
  display: 'flex',
  alignItems: 'center',
};

const headerLeft = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
};

const button = {
  color: 'white',
  fontSize: '2rem',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  border: '2px solid white',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  padding: '1px',
};

export default Header;
