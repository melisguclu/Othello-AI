const express = require('express');
const { saveGame, getGamesByUser, getUserStatistics, getMonthlyStatistics } = require('../controllers/gameController');

const router = express.Router();

router.post('/save', saveGame);
router.get('/user/:userId', getGamesByUser)
router.get('/statistics/:userId', getUserStatistics);
router.get('/statistics/monthly/:userId', getMonthlyStatistics);


module.exports = router;
