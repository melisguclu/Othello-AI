const express = require('express');
const { saveGame, getGamesByUser, getUserStatistics, getMonthlyStatistics } = require('../controllers/gameController');
const  ensureAuth  = require('../middleware/ensure-authentication');

const router = express.Router();

router.post('/save', ensureAuth, saveGame)
router.get('/user', ensureAuth, getGamesByUser)
router.get('/statistics', ensureAuth, getUserStatistics)
router.get('/statistics/monthly', ensureAuth, getMonthlyStatistics)


module.exports = router;
