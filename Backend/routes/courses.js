const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
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

// Endpoint to update presence data for a course
router.post('/:id/presence', courseController.updateCoursePresence);

module.exports = router;
