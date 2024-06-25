const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const multer = require('multer');
const path = require('path');
const { authenticateUser } = require('../utils/auth');
const Course = require('../models/Course'); // Ensure the correct path to the Course model

// Setup multer as shown in courseController.js
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// ---- Specific routes ---- //
// get all comments
router.get('/comments', async (req, res) => {
    try {
        const courses = await Course.find().select('comments');
        const comments = courses.reduce((acc, course) => acc.concat(course.comments), []);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error); // Log the error to the console
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
});

// Add a comment
router.post('/:id/comments', authenticateUser, courseController.handleComments);

// Get the latest 6 comments
router.get('/latest-comments', authenticateUser, courseController.getLastestComments);

// Get all courses
router.get('/', authenticateUser, courseController.getAllCourses);

// Upload an image
router.post('/uploadImage', authenticateUser, upload.single('image'), courseController.uploadImage);

// Get presence data for a course
router.get('/:id/assignedUsers', authenticateUser, courseController.getAssignedUsers);

// Endpoint to update presence data for a course
router.post('/:id/updatePresence', authenticateUser, courseController.updateCoursePresence);

// Get the latest 6 courses
router.get('/latest-courses', authenticateUser, courseController.getLastestComments);

// Upload a file
router.post('/:id/resources', authenticateUser, upload.single('file'), courseController.filesUpload);

// Get all files
router.get('/:id/resources', authenticateUser, courseController.fetchFiles);

// Request to join a course
router.post('/:id/request-join', authenticateUser, courseController.requestJoin);

// Assign a user to a course
router.post('/:id/assign-interseted-user', authenticateUser, courseController.assignIntersetedUser);

// Send course notification
router.post('/:id/notify', authenticateUser, courseController.sendCourseNotification);

// Delete a comment
router.delete('/:id/comments/:commentId', authenticateUser, courseController.deleteComment);

// Report a comment
router.post('/:id/comments/:commentId/report', authenticateUser, courseController.reportComment);

// Get courses by user id
router.get('/user/:userId', authenticateUser, courseController.getCoursesByUserId);

// ---- Generic routes ---- //
// Get a single course by ID
router.get('/:id', authenticateUser, courseController.getCourseById);

// Create a new course
router.post('/', authenticateUser, courseController.createCourse);

// Update an existing course
router.put('/:id', authenticateUser, courseController.updateCourse);

// Delete a course
router.delete('/:id', authenticateUser, courseController.deleteCourse);



module.exports = router;
