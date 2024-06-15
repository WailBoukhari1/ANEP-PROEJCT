require('dotenv').config();
const express = require('express');
const http = require('http');
const connectDB = require('./db');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const fileRoutes = require('./routes/fileRoutes');
const setupSocket = require('./realtime/socketManager');

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/files', fileRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});