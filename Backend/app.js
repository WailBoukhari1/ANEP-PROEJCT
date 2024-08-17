require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose'); // Ajout de mongoose

const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const authRoutes = require('./routes/authontification');
const setupSocket = require('./utils/socketManager');
const evaluationsRoutes = require('./routes/evaluations');
const userNeedRoutes = require('./routes/UserNeedRoutes');
const categoryRoutes = require('./routes/category');
const statsRoutes = require('./routes/statistics');
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
app.use('/evaluations', evaluationsRoutes);
app.use('/user-needs', userNeedRoutes);
app.use('/category', categoryRoutes);
app.use('/statistics', statsRoutes);

// Message Schema and Model
const messageSchema = new mongoose.Schema({
    content: String,
});

const Message = mongoose.model('Message', messageSchema);

// Route to handle message submission
app.post('/messages', async (req, res) => {
    const { message } = req.body;

    try {
        const newMessage = new Message({ content: message });
        await newMessage.save();
        res.status(201).send('Message saved successfully');
    } catch (error) {
        res.status(500).send('Error saving message');
    }
});

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