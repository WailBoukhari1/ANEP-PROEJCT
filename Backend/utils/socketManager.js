const socketIo = require('socket.io');

const setupSocket = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('sendNotification', (data) => {
            io.emit('receiveNotification', data);
        });
    });

    return io;
};

module.exports = setupSocket;