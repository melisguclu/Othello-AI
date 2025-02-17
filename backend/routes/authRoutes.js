const express = require('express');
const router = express.Router();
const { test, registerUser, loginUser, getProfile, logoutUser } = require('../controllers/authController');

const  ensureAuth = require('../middleware/ensure-authentication');

router.get('/', test)

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile, ensureAuth);
router.post('/logout', logoutUser); 


module.exports = router;