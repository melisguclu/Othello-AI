import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Othello</h1>
      <a href="https://github.com/melisguclu" target="_blank" rel="noopener noreferrer" className="github-icon">
        <ion-icon name="logo-github"></ion-icon>
      </a>
    </header>
  );
};

export default Header;