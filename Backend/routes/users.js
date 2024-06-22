const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Adjust the path as necessary
const { authenticateUser } = require('../utils/auth');


// ---- Specific routes ---- //
// Route to get notifications for users
router.get('/notifications', userController.getNotifications);
// Route to get notifications for a admin
router.get('/admin/notifications', userController.getAdminNotifications);

// ---- Generic routes ---- //
// Get all users
router.get('/', userController.getAllUsers);

// Get a single user by ID
router.get('/:id', authenticateUser(), userController.getUser);

// Create a new user
router.post('/', authenticateUser('admin'), userController.createUser);

// Update a user
router.put('/:id', authenticateUser('admin'), userController.updateUser);

// Delete a user
router.delete('/:id', authenticateUser('admin'), userController.deleteUser);



module.exports = router;
