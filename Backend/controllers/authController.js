const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/User');
const { generateToken } = require('../utils/auth');
const mailer = require('../utils/emailSender');

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
const emailVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (!user.password) {
            const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const urlreset = `http://localhost:5173/resetPassword/${resetToken}`;
            const emailTemplate = mailer.activeAccount(urlreset);
            user.resetToken = resetToken;
            await user.save();
            // Send email to the email address from the input
            const emailResponse = await mailer.sendEmail(email, 'your active url', emailTemplate);
            return res.status(200).json(emailResponse);
        } else {
            return res.status(200).json({ message: 'Le mot de passe existe pour ce compte' });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const urlreset = `http://localhost:5173/resetPassword/${resetToken}`;
        const emailTemplate = mailer.activeAccount(urlreset);
        user.resetToken = resetToken;
        await user.save();
        // Send email to the email address from the input
        const emailResponse = await mailer.sendEmail(email, 'your active url', emailTemplate);
        return res.status(200).json(emailResponse);

    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe :', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

const resetTokenVerify = async (req, res) => {
    try {
        const resetToken = req.params.resetToken; // Extract resetToken from req.params
        const user = await Users.findOne({ resetToken });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error verifying reset token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const newpassword = async (req, res) => {
    try {
        const password = req.body.password
        const user = await Users.findOne({ email: req.body.email });
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined; // Add this line to destroy the resetToken
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    loginUser,
    logoutUser,
    refreshUser,
    emailVerify,
    resetTokenVerify,
    newpassword,
    forgetPassword
};
