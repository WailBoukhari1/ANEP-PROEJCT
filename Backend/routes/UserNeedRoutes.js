const express = require('express');
const UserNeedController = require('../controllers/UserNeedController');
const { authenticateUser } = require('../utils/auth');

const router = express.Router();

// Route to create a user need
router.post('/', authenticateUser, UserNeedController.createUserNeed);

// Route to get user needs
router.get('/', authenticateUser, UserNeedController.getUserNeeds);

// delete user needs 
router.delete('/:id', async (req, res) => {
    try {
      await UserNeed.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;
