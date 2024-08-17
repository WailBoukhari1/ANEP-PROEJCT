const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// Define the route to get stats
router.get('/designations-and-interest', statisticsController.getDesignationsAndInterest);
router.get('/presence-distribution', statisticsController.getPresenceDistribution);

module.exports = router;
