const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../utils/auth');

// Route groups
const authRoutes = [
    { method: 'post', path: '/login', handler: authController.loginUser },
    { method: 'post', path: '/logout', middleware: [authenticateUser], handler: authController.logoutUser },
    { method: 'get', path: '/refreshUser', middleware: [authenticateUser], handler: authController.refreshUser },
    { method: 'post', path: '/emailverify', handler: authController.emailVerify },
    { method: 'get', path: '/resetTokenVerification/:resetToken', handler: authController.resetTokenVerify },
    { method: 'post', path: '/newpassword', handler: authController.newpassword },
    { method: 'post', path: '/forgetPassword', handler: authController.forgetPassword },
];

// Apply routes
const applyRoutes = (routes) => {
    routes.forEach(({ method, path, middleware = [], handler }) => {
        router[method](path, ...middleware, handler);
    });
};

applyRoutes(authRoutes);

module.exports = router;
