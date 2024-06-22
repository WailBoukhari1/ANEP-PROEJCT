const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../utils/auth');


router.post('/login', authController.loginUser);
router.post('/logout',authenticateUser(), authController.logoutUser);

router.get('/refreshUser', authenticateUser(), authController.refreshUser);


module.exports = router;
