const express = require('express');
const { saveGameData, getGameHistory } = require('../controllers/memoryController');
const router = express.Router();

// Route to save game data
router.post('/save', saveGameData);

// Route to fetch game history
router.get('/history', getGameHistory);

module.exports = router;
