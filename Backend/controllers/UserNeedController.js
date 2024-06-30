const UserNeed = require('../models/UserNeed');

// Créer un besoin utilisateur
exports.createUserNeed = async (req, res) => {
  try {
    const { message } = req.body;
    const userNeed = new UserNeed({
      user: req.user.id,
      message,
    });
    await userNeed.save();
    res.status(201).json(userNeed);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du besoin utilisateur' });
  }
};

// Obtenir les besoins des utilisateurs
exports.getUserNeeds = async (req, res) => {
  try {
    const userNeeds = await UserNeed.find().populate('user');
    res.json(userNeeds);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des besoins des utilisateurs' });
  }
};