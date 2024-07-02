const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const multer = require('multer');
const path = require('path');
const { authenticateUser } = require('../utils/auth');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Route groups
const commentRoutes = [
    { method: 'get', path: '/comments', handler: courseController.getAllComments },
    { method: 'post', path: '/:id/comments', handler: courseController.handleComments },
    { method: 'get', path: '/latest-comments', handler: courseController.getLastestComments },
    { method: 'delete', path: '/:id/comments/:commentId', handler: courseController.deleteComment },
    { method: 'post', path: '/:id/comments/:commentId/report', handler: courseController.reportComment },
];

const courseRoutes = [
    { method: 'get', path: '/', handler: courseController.getAllCourses },
    { method: 'get', path: '/latest-courses', handler: courseController.getLastestComments },
    { method: 'post', path: '/', handler: courseController.createCourse },
    { method: 'get', path: '/:id', middleware: [authenticateUser], handler: courseController.getCourseById },
    { method: 'put', path: '/:id', handler: courseController.updateCourse },
    { method: 'delete', path: '/:id', handler: courseController.deleteCourse },
    { method: 'get', path: '/user/:userId', handler: courseController.getCoursesByUserId },
];

const fileRoutes = [
    { method: 'post', path: '/uploadImage', middleware: [upload.single('image')], handler: courseController.uploadImage },
    { method: 'get', path: '/:id/resources', handler: courseController.fetchFiles },
    { method: 'post', path: '/:id/resources', middleware: [upload.single('file')], handler: courseController.filesUpload },
];

const userRoutes = [
    { method: 'get', path: '/:courseId/assignedUsers/download', handler: courseController.userAssignedDownload },
    { method: 'get', path: '/:id/assignedUsers', handler: courseController.getAssignedUsers },
    { method: 'post', path: '/:id/updatePresence', handler: courseController.updateCoursePresence },
    { method: 'post', path: '/:id/request-join', handler: courseController.requestJoin },
    { method: 'post', path: '/:id/assign-interseted-user', handler: courseController.assignIntersetedUser },
];

const notificationRoutes = [
    { method: 'post', path: '/:id/notify', handler: courseController.sendCourseNotification },
];

// Apply routes
const applyRoutes = (routes) => {
    routes.forEach(({ method, path, middleware = [], handler }) => {
        router[method](path, ...middleware, handler);
    });
};

[commentRoutes, courseRoutes, fileRoutes, userRoutes, notificationRoutes].forEach(applyRoutes);

module.exports = router;