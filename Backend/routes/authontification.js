const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../utils/auth'); // Adjust the path if necessary

router.post('/login', authController.loginUser);
router.post('/logout', authenticateUser, authController.logoutUser);
router.get('/refreshUser', authenticateUser, authController.refreshUser);
router.post('/emailverify', authController.emailVerify);
router.get('/resetTokenVerification/:resetToken', authController.resetTokenVerify);
router.post('/newpassword',authController.newpassword);

module.exports = router;