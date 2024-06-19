const User = require('../models/User');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        console.log("Fetched users:", users);
        res.send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send(error.message);
    }
};

// Get a single user by ID
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const getNotifications = async (req, res) => {
    try {
        const userId = "666e024aef86c2482444b3a8";
        const { page = 1, limit = 5 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('notifications');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notifications = user.notifications;
        const totalNotifications = notifications.length;
        const totalPages = Math.ceil(totalNotifications / limit);
        const paginatedNotifications = notifications.slice((page - 1) * limit, page * limit);

        res.json({
            notifications: paginatedNotifications,
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalNotifications: totalNotifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const getAdminNotifications = async (req, res) => {
    try {
        const adminId = "6671ba1141116692e9f8a1be";
        const { page = 1, limit = 5 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(adminId).select('notifications');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notifications = user.notifications;
        const totalNotifications = notifications.length;
        const totalPages = Math.ceil(totalNotifications / limit);
        const paginatedNotifications = notifications.slice((page - 1) * limit, page * limit);

        res.json({
            notifications: paginatedNotifications,
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalNotifications: totalNotifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getNotifications,
    getAdminNotifications
};
