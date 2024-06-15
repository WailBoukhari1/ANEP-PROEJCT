const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Remove the deprecated options
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successful');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
