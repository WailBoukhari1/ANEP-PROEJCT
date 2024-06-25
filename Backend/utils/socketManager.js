const { Server } = require('socket.io');
const User = require('../models/User'); // Import the User model

let io;
const users = {}; // Store users and their socket IDs

const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Adjust the origin as per your frontend deployment
            methods: ["GET", "POST"],
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('register', (userId) => {
            users[userId] = socket.id;
            console.log('Registered user:', userId);
        });

        socket.on('notify', async (data) => {
            const { userIds, message, courseId } = data;
            try {
                const notifications = userIds.map(userId => ({
                    updateOne: {
                        filter: { _id: userId },
                        update: {
                            $push: {
                                notifications: {
                                    message,
                                    courseId,
                                    isNew: true
                                }
                            }
                        }
                    }
                }));
                await User.bulkWrite(notifications);

                userIds.forEach(userId => {
                    if (users[userId]) {
                        io.to(users[userId]).emit('notification', { message, courseId, isNew: true });
                    }
                });
            } catch (error) {
                console.error('Error saving notification:', error);
            }
        });

        socket.on('commentReported', async (data) => {
            console.log('Comment reported:', data);
            const adminId = '6679bfcc1a97f81c02ceb441';
            const notification = {
                message: `A comment in "${data.courseName}" has been reported`,
                courseId: data.courseId,
                commentSnippet: data.commentText.substring(0, 30) + '...'
            };

            // Store notification in the database
            await User.findByIdAndUpdate(adminId, {
                $push: { notifications: notification }
            });

            if (users[adminId]) {
                io.to(users[adminId]).emit('notification', notification);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
            for (const [userId, socketId] of Object.entries(users)) {
                if (socketId === socket.id) {
                    delete users[userId];
                    break;
                }
            }
        });
    });

    return { io, broadcastMessage };
};

const broadcastMessage = (message) => {
    io.emit('notification', message);
};

module.exports = setupSocket;