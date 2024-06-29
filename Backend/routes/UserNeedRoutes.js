const express = require('express');
const UserNeedController = require('../controllers/UserNeedController');
const { authenticateUser } = require('../utils/auth');

const router = express.Router();

// Route to create a user need
router.post('/', authenticateUser, UserNeedController.createUserNeed);

// Route to get user needs
router.get('/', authenticateUser, UserNeedController.getUserNeeds);


module.exports = router;
