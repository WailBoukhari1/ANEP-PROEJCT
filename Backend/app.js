require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const authRoutes = require('./routes/authontification');
const setupSocket = require('./utils/socketManager');

const app = express();
const server = http.createServer(app);
const { io, broadcastMessage } = setupSocket(server);

// Middleware
app.use(express.json());
app.use(cors());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Make io accessible to our router
app.set('socketio', io);

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        // Example usage: Broadcast a message
        broadcastMessage('Hello, this is a test notification!');
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1);
    }
};

startServer();