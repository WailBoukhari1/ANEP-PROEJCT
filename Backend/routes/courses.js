const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const multer = require('multer');
const path = require('path');
const { authenticateUser } = require('../utils/auth');
const Course = require('../models/Course'); // Ensure the correct path to the Course model
const XLSX = require('xlsx');
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

router.get('/:courseId/assignedUsers/download', courseController.userAssignedDownload);

// ---- Specific routes ---- //
// get all comments
router.get('/comments', courseController.getAllComments);

// Add a comment
router.post('/:id/comments', courseController.handleComments);

// Get the latest 6 comments
router.get('/latest-comments', courseController.getLastestComments);

// Get all courses
router.get('/', courseController.getAllCourses);

// Upload an image
router.post('/uploadImage', upload.single('image'), courseController.uploadImage);

// Get presence data for a course
router.get('/:id/assignedUsers', courseController.getAssignedUsers);

// Endpoint to update presence data for a course
router.post('/:id/updatePresence', courseController.updateCoursePresence);

// Get the latest 6 courses
router.get('/latest-courses', courseController.getLastestComments);

// Upload a file
router.post('/:id/resources', upload.single('file'), courseController.filesUpload);

// Get all files
router.get('/:id/resources', courseController.fetchFiles);

// Request to join a course
router.post('/:id/request-join', courseController.requestJoin);

// Assign a user to a course
router.post('/:id/assign-interseted-user', courseController.assignIntersetedUser);

// Send course notification
router.post('/:id/notify', courseController.sendCourseNotification);

// Delete a comment
router.delete('/:id/comments/:commentId', courseController.deleteComment);

// Report a comment
router.post('/:id/comments/:commentId/report', courseController.reportComment);

// Get courses by user id
router.get('/user/:userId', courseController.getCoursesByUserId);
// ---- Generic routes ---- //
// Get a single course by ID
router.get('/:id', authenticateUser, courseController.getCourseById);

// Create a new course
router.post('/', courseController.createCourse);

// Update an existing course
router.put('/:id', courseController.updateCourse);

// Delete a course
router.delete('/:id', courseController.deleteCourse);



module.exports = router;
