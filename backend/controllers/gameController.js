const mongoose = require('mongoose');
const Game = require('../models/game');

const saveGame = async (req, res) => {
  try {
    const { userId, mode, aiType, result, score } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      console.error('Invalid or missing userId:', userId);
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    const newGame = new Game({
      userId, 
      mode,
      aiType,
      result,
      score,
    });

    await newGame.save();
    res.status(201).json({ message: 'Game saved successfully', game: newGame });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
};


const getGamesByUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: 'Invalid or missing userId' });
  }

  try {
    const games = await Game.find({ userId }).sort({ date: -1 }); // sort by date in descending order
    res.status(200).json({ games });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

module.exports = { saveGame, getGamesByUser };


