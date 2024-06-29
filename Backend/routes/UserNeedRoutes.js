const express = require('express');
const { createUserNeed, getUserNeeds } = require('../controllers/UserNeedController');

const router = express.Router();

router.post('/user-needs', createUserNeed);
router.get('/user-needs', getUserNeeds);

module.exports = router;
