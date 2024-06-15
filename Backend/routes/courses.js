const express = require('express');
const router = express.Router();

// GET all courses
router.get('/', (req, res) => {
    // Logic to fetch all courses
    res.send('All courses');
});

// GET a single course by ID
router.get('/:id', (req, res) => {
    // Logic to fetch a course by id
    res.send(`Course with ID ${req.params.id}`);
});

// POST a new course
router.post('/', (req, res) => {
    // Logic to add a new course
    res.send('Course added');
});

// PUT to update a course by ID
router.put('/:id', (req, res) => {
    // Logic to update a course by id
    res.send(`Course with ID ${req.params.id} updated`);
});

// DELETE a course by ID
router.delete('/:id', (req, res) => {
    // Logic to delete a course by id
    res.send(`Course with ID ${req.params.id} deleted`);
});

module.exports = router;