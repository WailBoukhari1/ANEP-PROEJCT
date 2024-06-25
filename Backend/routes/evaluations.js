const express = require('express');
const router = express.Router();
// const { authenticateUser } = require('../utils/auth');
const courseController = require('../controllers/courseController');

// Route to handle evaluation submissions
router.post('/:courseId/', courseController.createEvaluation);
// Route to get all evaluations for a course (for dashboard)
router.get('/:courseId/download', courseController.downloadEvaluations);

module.exports = router;