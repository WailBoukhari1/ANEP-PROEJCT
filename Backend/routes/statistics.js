const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/enrollment-rate', statisticsController.getEnrollmentRate);
router.get('/beneficiary-rate', statisticsController.getBeneficiaryRate);
router.get('/attendance/:userId?', statisticsController.getAttendanceRate);
router.get('/evaluation-scores/:courseId?', statisticsController.getEvaluationScores); // Updated route
router.get('/completion-rate', statisticsController.getCompletionRate);
router.get('/dropout-rate', statisticsController.getDropoutRate);

module.exports = router;