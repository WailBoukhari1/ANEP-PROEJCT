const UserNeed = require('../models/UserNeed');

// Create a user need
exports.createUserNeed = async (req, res) => {
  try {
    const { message } = req.body;
    const userNeed = new UserNeed({
      message,
    });
    await userNeed.save();
    res.status(201).json(userNeed);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user need' });
  }
};

// Get all user needs
exports.getUserNeeds = async (req, res) => {
  try {
    const userNeeds = await UserNeed.find();
    res.json(userNeeds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user needs' });
  }
};

