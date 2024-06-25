const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const courseController = require('../controllers/courseController');

// Route to handle evaluation submissions
router.post('/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const { userId = null, evaluationData = null, comments = null, aspectsToImprove = null } = req.body;
    // Validate required fields
    const missingFields = [];
    if (!courseId) missingFields.push('courseIds');
    if (!userId) missingFields.push('userId');
    if (!comments) missingFields.push('comments');
    if (!aspectsToImprove) missingFields.push('aspectsToImprove');

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const newEvaluation = {
            userId,
            evaluationData,
            comments,
            aspectsToImprove,
        };

        course.evaluations.push(newEvaluation);
        await course.save();

        res.status(201).json({ message: 'Evaluation submitted successfully', evaluation: newEvaluation });
    } catch (error) {
        console.error('Error submitting evaluation:', error);
        res.status(500).json({ error: `An error occurred while submitting the evaluation: ${error.message}` });
    }
});


// Route to get all evaluations for a course (for dashboard)
router.get('/:courseId', async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId).populate('evaluations.userId', 'name');
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course.evaluations);
    } catch (error) {
        console.error('Error fetching evaluations:', error);
        res.status(500).json({ error: 'An error occurred while fetching the evaluations' });
    }
});

module.exports = router;