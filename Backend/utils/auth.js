const jwt = require('jsonwebtoken');
const Users = require('../models/User');
const authenticateUser = (requiredRole) => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // Check if the header starts with 'Bearer '
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        const user = await Users.findOne({ tokenAccess: token });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if the user has the required role
        if (requiredRole && !user.roles.includes(requiredRole)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const generateToken = (userId, email, roles) => {
    return jwt.sign(
        { id: userId, email, roles },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
    );
};



module.exports = {
    generateToken,
    authenticateUser,
};
