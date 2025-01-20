const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  mode: { type: String, required: true },
  aiType: { type: String },
  result: { type: String, required: true },
  score: {
    player: { type: Number, required: true },
    opponent: { type: Number, required: true },
  },
  date: { type: Date, default: Date.now }, 
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
