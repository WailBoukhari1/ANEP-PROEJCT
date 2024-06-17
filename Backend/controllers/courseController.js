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

const getAssignedUsers = async (req, res) => {
    const { id } = req.params; // course ID

    try {
        const course = await Course.findById(id).populate('assignedUsers');
        if (!course) {
            return res.status(404).send('Course not found');
        }

        // Initialize an empty array if presence data is missing
        const presenceData = course.presence || [];

        const usersWithPresence = course.assignedUsers.map(user => {
            // Find the presence entry for the user, if it exists
            const presence = presenceData.find(p => p.userId && user._id && p.userId.toString() === user._id.toString());
            return {
                _id: user._id,
                name: user.name,
                status: presence ? presence.status : 'absent'  // Default to 'absent' if no presence data found
            };
        });

        res.status(200).json(usersWithPresence);
    } catch (error) {
        console.error('Error fetching assigned users:', error);
        res.status(500).send('Failed to fetch assigned users: ' + error.message);
    }
};

const updateCoursePresence = async (req, res) => {
    const { id } = req.params;
    const { presence } = req.body;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).send('Course not found');
        }

        course.presence = presence; // Assuming the presence array is directly replaceable
        await course.save();

        res.status(200).send('Presence updated successfully');
    } catch (error) {
        console.error('Failed to update course presence:', error);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadImage,
    getAssignedUsers,
    updateCoursePresence
};
