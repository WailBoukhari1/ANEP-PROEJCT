// courseController.js
const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')  // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});
// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new course
const createCourse = async (req, res) => {
    console.log('Received data for new course:', req.body);
    try {
        const course = new Course(req.body);
        if (req.file) {
            course.image = req.file.path; // Assuming you're handling file uploads with multer or similar
        }
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error('Error saving course:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update an existing course
const updateCourse = async (req, res) => {
    const { assignedUsers } = req.body;
    // Remove users from other courses where they have conflicts
    assignedUsers.forEach(async userId => {
        await Course.updateMany(
            { assignedUsers: userId, _id: { $ne: req.params.id } },
            { $pull: { assignedUsers: userId } }
        );
    });

    // Update the current course
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
};

// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller method for uploading an image
const uploadImage = (req, res) => {
    if (req.file) {
        res.json({
            success: true,
            message: 'Image uploaded successfully!',
            imageUrl: `/uploads/${req.file.filename}`
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'No image uploaded.'
        });
    }
};

const checkConflicts = async (req, res) => {
    const { userId, startTime, endTime } = req.body;
    const conflicts = await Course.find({
        assignedUsers: userId,
        times: { $elemMatch: { startTime: { $lt: endTime }, endTime: { $gt: startTime } } }
    }).select('title times -_id');  // Select only the necessary fields
    res.json({ conflicts });
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadImage,
    checkConflicts,
};
