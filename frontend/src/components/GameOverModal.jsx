import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const GameOverModal = ({ open, onClose, winner, score, onRestart }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Over!</DialogTitle>
          <DialogDescription>
            <p>
              <strong>Winner:</strong> {winner ? winner : 'Draw!'}
            </p>
            <p>
              <strong>Score:</strong> Black: {score.B} - White: {score.W}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Button
            onClick={onRestart}
            className="w-full  hover:bg-blue-700 text-white"
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverModal;
