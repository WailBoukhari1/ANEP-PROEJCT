const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../utils/auth');
const User = require('../models/User'); // Adjust the path as necessary

// Specific routes
const specificRoutes = [
    { method: 'get', path: '/notifications', middleware: [authenticateUser], handler: userController.getNotifications },
    { method: 'get', path: '/admin/notifications', middleware: [authenticateUser], handler: userController.getAdminNotifications },
    { method: 'post', path: '/mark-notification-read', handler: userController.markNotificationRead },
];

// Generic routes
const genericRoutes = [
    { method: 'get', path: '/', middleware: [authenticateUser], handler: userController.getAllUsers },
    { method: 'get', path: '/:id', middleware: [authenticateUser], handler: userController.getUser },
    { method: 'post', path: '/', handler: userController.createUser },
    { method: 'put', path: '/:id',handler: userController.updateUser },
    { method: 'delete', path: '/:id',handler: userController.deleteUser },
];
router.post('/import', async (req, res) => {
    try {
      const users = req.body; // Assume the request body contains the array of users
  
      // Log the incoming data for debugging
      console.log('Incoming users data:', users);
  
      const results = await Promise.all(users.map(async (user) => {
        // Check if the user already exists by email
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          console.log(`User with email ${user.email} already exists. Skipping.`);
          return null;
        }
  
        // Generate an ID if the user doesn't have one
        if (!user._id) {
          user._id = new mongoose.Types.ObjectId(); // Assuming you're using Mongoose for MongoDB
        }
  
        // Create the user in the database
        return User.create(user);
      }));
  
      res.status(201).json({
        message: 'Users imported successfully',
        imported: results.filter(result => result !== null).length,
        skipped: results.filter(result => result === null).length,
      });
    } catch (error) {
      // Log the error for debugging
      console.error('Error during users import:', error);
  
      res.status(500).json({ message: 'Failed to import users', error: error.message });
    }
  });
  
// Apply specific routes
specificRoutes.forEach(({ method, path, middleware = [], handler }) => {
    router[method](path, ...middleware, handler);
});

// Apply generic routes
genericRoutes.forEach(({ method, path, middleware = [], handler }) => {
    router[method](path, ...middleware, handler);
});

module.exports = router;
