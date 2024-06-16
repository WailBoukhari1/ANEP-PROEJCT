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
module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
