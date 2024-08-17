const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// Route for fetching demographic distribution data
router.get('/demographic-distribution', statisticsController.getDemographicDistribution);

// Route for fetching designations and interest data
router.get('/designations-and-interest', statisticsController.getDesignationsAndInterest);

// Route for fetching presence distribution data
router.get('/presence-distribution', statisticsController.getPresenceDistribution);

// Route for fetching evaluations by course data
router.get('/evaluations-by-course', statisticsController.getEvaluationDataForRadarCharts);

// Route for fetching group comparison data
router.get('/group-comparison', statisticsController.getGroupComparisons);

// Route for fetching distribution by department/profile/year/gender
router.get('/distribution-data', statisticsController.getDistributionData);

module.exports = router;