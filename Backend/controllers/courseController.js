const Course = require('../models/Course');

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('author');
        res.send(courses);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Get a single course by ID
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('author');
        if (!course) {
            return res.status(404).send('Course not found');
        }
        res.send(course);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.send(course);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            return res.status(404).send('Course not found');
        }
        res.send(course);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).send('Course not found');
        }
        res.send(course);
    } catch (error) {
        res.status(500).send(error.message);
    }
};