const mongoose = require('mongoose');
const Game = require('../models/game');

const saveGame = async (req, res) => {
  try {
    const { userId, mode, aiType, result, score } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      console.error('Invalid or missing userId:', userId);
      return res.json({ error: 'Invalid or missing userId' });
    }

    const newGame = new Game({
      userId, 
      mode,
      aiType,
      result,
      score,
    });

    await newGame.save();
    res.json({ message: 'Game saved successfully', game: newGame });
  } catch (error) {
    console.error('Error saving game:', error);
    res.json({ error: 'Failed to save game' });
  }
};


const getGamesByUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    return res.json({ error: 'Invalid or missing userId' });
  }

  try {
    const games = await Game.find({ userId }).sort({ date: -1 }); // sort by date in descending order
    res.json({ games });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.json({ error: 'Failed to fetch games' });
  }
};


const getUserStatistics = async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    return res.json({ error: 'Invalid or missing userId' });
  }

  try {
    const games = await Game.find({ userId });

    const totalGames = games.length;
    const wins = games.filter((game) => game.result === 'win').length;
    const losses = games.filter((game) => game.result === 'loss').length;
    const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : '0.00';

    res.json({ totalGames, wins, losses, winRate });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.json({ error: 'Failed to fetch statistics' });
  }
};

const getMonthlyStatistics = async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    return res.json({ error: 'Invalid or missing userId' });
  }

  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const games = await Game.find({
      userId,
      date: { $gte: startOfYear },
    });

    const monthlyStats = Array(12).fill({ played: 0, won: 0 });

    games.forEach((game) => {
      const month = new Date(game.date).getMonth();
      monthlyStats[month] = {
        played: (monthlyStats[month]?.played || 0) + 1,
        won:
          (monthlyStats[month]?.won || 0) +
          (game.result === 'win' ? 1 : 0),
      };
    });

    const response = monthlyStats.map((stats, index) => ({
      month: new Date(0, index).toLocaleString('en-US', { month: 'long' }),
      played: stats.played,
      won: stats.won,
    }));

    res.status(200).json({ statistics: response });
  } catch (error) {
    console.error('Error fetching monthly statistics:', error);
    res.json({ error: 'Failed to fetch monthly statistics' });
  }
};

module.exports = { saveGame, getGamesByUser, getUserStatistics, getMonthlyStatistics };




