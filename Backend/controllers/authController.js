const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/User');

const loginUser = async (req, res) => {
    console.log(req.body)
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

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email, roles: user.roles },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Update user document with token
        user.tokenAccess = token;
        await user.save();

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message  });

    }
};
const logoutUser = async (req, res) => {
    try {
        // Assuming you have extracted the user from the request in your authentication middleware
        const user = req.user;

        // Clear the tokenAccess field
        user.tokenAccess = undefined;
        await user.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// courent user     
const refreshUser = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);
        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    loginUser,
    logoutUser,
    refreshUser

};
