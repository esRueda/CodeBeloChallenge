const Save = require('../models/save');

// Controller to handle saving game data
exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body); 

    try {
        // Check if all required fields are present
        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Create a new Save instance with the provided data
        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });
        // Save to the database
        await newSave.save(); 
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};

// Controller to fetch game history
exports.getGameHistory = async (req, res) => {
    const { userID } = req.query;
    try {
      // If a userID is provided in the query, filter by it. Otherwise, return all game records.
      const filter = userID ? { userID } : {};
      // Query the database and sort results by date (most recent first)
      const history = await Save.find(filter)
        .sort({ gameDate: -1 })    
        .lean();                   // Convert Mongoose documents to plain JS objects
  
      res.status(200).json({ history });
    } catch (error) {
      console.error('Error fetching game history:', error);
      res.status(500).json({
        message: 'Error fetching game history',
        error: error.message,
      });
    }
  };
