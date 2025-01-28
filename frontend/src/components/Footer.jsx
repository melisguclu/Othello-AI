import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Footer() {
  return (
    <>
      <TooltipProvider>
        <footer style={footerStyle}>
          {/* How to Play */}
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <button style={linkStyle}>How to Play Othello?</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How to Play</DialogTitle>
                  <DialogDescription>
                    Othello is a strategy board game for two players. The goal
                    is to have the majority of your color disks on the board at
                    the end of the game.
                  </DialogDescription>
                </DialogHeader>
                <ul style={listStyle}>
                  <li>Place your disk to flank your opponent's disks.</li>
                  <li>Flanked disks are flipped to your color.</li>
                  <li>Try to control the board strategically!</li>
                </ul>
                <p style={moreInfoStyle}>
                  For more details, visit the{' '}
                  <a
                    href="https://www.worldothello.org/about/about-othello/othello-rules/official-rules/english"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    official Othello website
                  </a>
                  .
                </p>
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com/melisguclu"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={githubIconStyle}
                >
                  <ion-icon name="logo-github"></ion-icon>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to GitHub repository</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </footer>
      </TooltipProvider>
    </>
  );
}

const footerStyle = {
  backgroundColor: '#d0d0d0',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'fixed',
  bottom: '0',
  width: '100%',
  height: '50px',
};

const linkStyle = {
  color: '#5c5c5c',
  cursor: 'pointer',
  fontSize: '1rem',
};

const githubIconStyle = {
  color: '#5c5c5c',
  fontSize: '2rem',
  display: 'flex',
  alignItems: 'center',
};

const listStyle = {
  marginTop: '1rem',
  textAlign: 'justify',
};

const moreInfoStyle = {
  marginTop: '1rem',
  textDecoration: 'underline',
  textAlign: 'justify',
};
