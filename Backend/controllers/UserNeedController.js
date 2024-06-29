const UserNeed = require('../models/UserNeed');

exports.createUserNeed = async (req, res) => {
  try {
    const { user, message } = req.body;
    const newUserNeed = new UserNeed({
      user,
      message
    });
    await newUserNeed.save();
    res.status(201).json(newUserNeed);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserNeeds = async (req, res) => {
  try {
    const userNeeds = await UserNeed.find();
    res.status(200).json(userNeeds);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
