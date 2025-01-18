const express = require('express');
const { saveGame, getGamesByUser } = require('../controllers/gameController');

const router = express.Router();

router.post('/save', saveGame);
router.get('/user/:userId', getGamesByUser)

module.exports = router;
