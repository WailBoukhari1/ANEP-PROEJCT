const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Adjust the path as necessary
const mongoose = require('mongoose');
const User = require('../models/User');

// ---- Specific routes ---- //
// Route to get notifications for a user
router.get('/notifications', async (req, res) => {
    try {
        const userId = "666e024aef86c2482444b3a8"; // Hardcoded user ID
        const { page = 1, limit = 5 } = req.query; // Default to page 1 and limit 5

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('notifications');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notifications = user.notifications;
        const totalNotifications = notifications.length;
        const totalPages = Math.ceil(totalNotifications / limit);
        const paginatedNotifications = notifications.slice((page - 1) * limit, page * limit);

        res.json({
            notifications: paginatedNotifications,
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalNotifications: totalNotifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---- Generic routes ---- //
// Get all users
router.get('/', userController.getAllUsers);

// Get a single user by ID
router.get('/:id', userController.getUser);

// Create a new user
router.post('/', userController.createUser);

// Update a user
router.put('/:id', userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);


module.exports = router;
