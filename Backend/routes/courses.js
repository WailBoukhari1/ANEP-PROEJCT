const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const multer = require('multer');
const path = require('path');

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

// Get all courses
router.get('/', courseController.getAllCourses);

// Get a single course by ID
router.get('/:id', courseController.getCourseById);

// Create a new course
router.post('/', courseController.createCourse);

// Update an existing course
router.put('/:id', courseController.updateCourse);

// Delete a course
router.delete('/:id', courseController.deleteCourse);

// Upload an image
router.post('/uploadImage', upload.single('image'), courseController.uploadImage);

// Get presence data for a course
router.get('/:id/assignedUsers', courseController.getAssignedUsers);

// Endpoint to update presence data for a course
router.post('/:id/updatePresence', courseController.updateCoursePresence);

// Get the latest 6 courses
router.get('/latest-courses', courseController.getLastestComments);

module.exports = router;
