const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  mode: { type: String, enum: ['human-vs-human', 'human-vs-ai'], required: true },
  aiType: { type: String, enum: ['minimax', 'random', 'mcts'], default: null },
  result: { type: String, enum: ['win', 'loss', 'draw'], required: true },
  score: {
    player: { type: Number, required: true },
    opponent: { type: Number, required: true },
  },
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
