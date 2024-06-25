const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Adjust the path as necessary
const { authenticateUser } = require('../utils/auth'); // Adjust the path as necessary

// ---- Specific routes ---- //
// Route to get notifications for users
router.get('/notifications', authenticateUser, userController.getNotifications);

// Route to get notifications for an admin
router.get('/admin/notifications', authenticateUser, userController.getAdminNotifications);

// Route to mark a notification as read
router.post('/mark-notification-read', authenticateUser, userController.markNotificationRead);

// ---- Generic routes ---- //
// Get all users
router.get('/', userController.getAllUsers);

// Get a single user by ID
router.get('/:id', authenticateUser, userController.getUser);

// Create a new user
router.post('/', authenticateUser, userController.createUser);

// Update a user
router.put('/:id', authenticateUser, userController.updateUser);

// Delete a user
router.delete('/:id', authenticateUser, userController.deleteUser);

module.exports = router;
