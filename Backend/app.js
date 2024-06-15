require('dotenv').config();
const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const fileRoutes = require('./routes/fileRoutes');
const setupSocket = require('./utils/socketManager');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/files', fileRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});