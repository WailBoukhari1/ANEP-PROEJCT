const express = require('express');
const UserNeedController = require('../controllers/UserNeedController');
const { authenticateUser } = require('../utils/auth');
const router = express.Router();

// Route to create a user need
router.post('/', authenticateUser, UserNeedController.createUserNeed);

// Route to get user needs
router.get('/', authenticateUser, UserNeedController.getUserNeeds);

// Delete user needs
router.get('/:id', authenticateUser, UserNeedController.deleteUserNeeds);
  

  
module.exports = router;
