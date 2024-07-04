const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const mongoose = require('mongoose');
const { authenticateUser } = require('../utils/auth');
const User = require('../models/User');

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

router.post('/import', authenticateUser, userController.importUsersFromExcel);

// Apply specific routes
specificRoutes.forEach(({ method, path, middleware = [], handler }) => {
    router[method](path, ...middleware, handler);
});

// Apply generic routes
genericRoutes.forEach(({ method, path, middleware = [], handler }) => {
    router[method](path, ...middleware, handler);
});

module.exports = router;
