const express = require('express');
const { saveGame, getGamesByUser, getUserStatistics } = require('../controllers/gameController');

const router = express.Router();

router.post('/save', saveGame);
router.get('/user/:userId', getGamesByUser)
router.get('/statistics/:userId', getUserStatistics);


module.exports = router;
