const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../utils/auth');

const loginValidationRules = [
    body('email').isEmail().withMessage("Email n'est pas valide"),
    body('password').isLength({ min: 8 }).withMessage('Mot de passe doit contenir au moins 8 caractères')
];

const emailValidationRules = [
    body('email').isEmail().withMessage("Email n'est pas valide")
];

const passwordValidationRules = [
    body('password').isLength({ min: 8 }).withMessage('Mot de passe doit contenir au moins 8 caractères')
];

// Route groups
const authRoutes = [
    { method: 'post', path: '/login', middleware: loginValidationRules, handler: authController.loginUser },
    { method: 'post', path: '/logout', middleware: [authenticateUser], handler: authController.logoutUser },
    { method: 'get', path: '/refreshUser', middleware: [authenticateUser], handler: authController.refreshUser },
    { method: 'post', path: '/emailverify', middleware: emailValidationRules, handler: authController.emailVerify },
    { method: 'get', path: '/resetTokenVerification/:resetToken', handler: authController.resetTokenVerify },
    { method: 'post', path: '/newpassword', middleware: passwordValidationRules, handler: authController.newpassword },
    { method: 'post', path: '/forgetPassword', middleware: emailValidationRules, handler: authController.forgetPassword },
];

// Apply routes
const applyRoutes = (routes) => {
    routes.forEach(({ method, path, middleware = [], handler }) => {
        router[method](path, ...middleware, handler);
    });
};

applyRoutes(authRoutes);

module.exports = router;
