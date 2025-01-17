import React from 'react';
const Header = () => {
  return (
    <header style={headerStyle}>
      <h1 style={h1Style}>Othello</h1>
      <a
        href="https://github.com/melisguclu"
        target="_blank"
        rel="noopener noreferrer"
        style={githubIconStyle}
      >
        <ion-icon name="logo-github"></ion-icon>
      </a>
    </header>
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
};

const githubIconStyle = {
  color: 'white',
  fontSize: '2rem',
  display: 'flex',
  alignItems: 'center',
};

export default Header;
