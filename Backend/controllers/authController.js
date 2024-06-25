const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/User');
const { generateToken } = require('../utils/auth');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = generateToken(user._id, user.email, user.roles);
        user.tokenAccess = token;
        await user.save();
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        const user = req.user;
        user.tokenAccess = undefined;
        await user.save();
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const refreshUser = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    loginUser,
    logoutUser,
    refreshUser
};
