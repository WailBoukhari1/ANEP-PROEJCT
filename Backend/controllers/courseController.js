// courseController.js
const Course = require('../models/Course');
const User = require('../models/User');
const XLSX = require('xlsx');

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('interestedUsers', '_id name')
            .populate({
                path: 'times.instructor',
                model: 'User',
                select: 'name'
            })
            .exec();

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.toString() });
    }
};

const getAllComments = async (req, res) => {
    try {
        const courses = await Course.find().select('comments');
        const comments = courses.reduce((acc, course) => acc.concat(course.comments), []);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error); // Log the error to the console
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
}

// Create a new course
const createCourse = async (req, res) => {
    console.log('Received data for new course:', req.body);
    try {
        const course = new Course(req.body);
        if (req.file) {
            course.image = req.file.path; // Assuming you're handling file uploads with multer or similar
        }
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error('Error saving course:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update an existing course
const updateCourse = async (req, res) => {
    const { assignedUsers } = req.body;
    // Remove users from other courses where they have conflicts
    assignedUsers.forEach(async userId => {
        await Course.updateMany(
            { assignedUsers: userId, _id: { $ne: req.params.id } },
            { $pull: { assignedUsers: userId } }
        );
    });

    // Update the current course
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
};

// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller method for uploading an image
const uploadImage = (req, res) => {
    if (req.file) {
        res.json({
            success: true,
            message: 'Image uploaded successfully!',
            imageUrl: `/uploads/${req.file.filename}`
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'No image uploaded.'
        });
    }
};
const getAssignedUsers = async (req, res) => {
    const { id } = req.params; // course ID

    try {
        const course = await Course.findById(id).populate('assignedUsers');
        if (!course) {
            return res.status(404).send('Course not found');
        }

        // Initialize an empty array if presence data is missing
        const presenceData = course.presence || [];

        const usersWithPresence = course.assignedUsers.map(user => {
            // Find the presence entry for the user, if it exists
            const presence = presenceData.find(p => p.userId && user._id && p.userId.toString() === user._id.toString());
            return {
                _id: user._id,
                name: user.name,
                status: presence ? presence.status : 'absent'  // Default to 'absent' if no presence data found
            };
        });

        res.status(200).json(usersWithPresence);
    } catch (error) {
        console.error('Error fetching assigned users:', error);
        res.status(500).send('Failed to fetch assigned users: ' + error.message);
    }
};
const getCoursesByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const courses = await Course.find({
            $or: [
                { assignedUsers: userId },
                { interestedUsers: userId }
            ]
        });

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateCoursePresence = async (req, res) => {
    const { id } = req.params;
    const { presence } = req.body;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).send('Course not found');
        }

        course.presence = presence; // Assuming the presence array is directly replaceable
        await course.save();

        res.status(200).send('Presence updated successfully');
    } catch (error) {
        console.error('Failed to update course presence:', error);
        res.status(500).send('Internal Server Error');
    }
};
const getLastestComments = async (req, res) => {
    try {
        const courses = await Course.find()
            .sort({ 'comments.createdAt': -1 })
            .limit(6)
            .select('comments');

        let comments = [];
        courses.forEach(course => {
            comments = comments.concat(course.comments);
        });

        comments.sort((a, b) => b.createdAt - a.createdAt);
        comments = comments.slice(0, 6);

        res.json(comments);
    } catch (error) {
        res.status(500).send(error);
    }
};

const handleComments = async (req, res) => {
    const { id } = req.params;
    const { userName, text } = req.body; // Assuming you're sending userName and text from the frontend

    if (!text.trim()) {
        return res.status(400).json({ message: "Comment text must not be empty" });
    }

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const newComment = {
            userName,
            text,
            createdAt: new Date() // This is optional since default is already set in schema
        };

        course.comments.push(newComment);
        await course.save();

        res.status(201).json(course.comments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const filesUpload = async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).send('Course not found.');
        }

        const newResource = {
            type: file.mimetype.includes('image') ? 'image' : 'file', // Simplified type check
            title: file.originalname,
            link: file.path
        };

        course.resources.push(newResource);
        await course.save();

        res.status(201).json(course.resources);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const fetchFiles = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).send('Course not found.');
        }

        res.status(200).json(course.resources);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const assignIntersetedUser = async (req, res) => {
    const { userId } = req.body;
    const id = req.params.id;

    try {
        // First, pull the user from interestedUsers
        const course = await Course.findByIdAndUpdate(id, {
            $pull: { interestedUsers: userId }
        }, { new: true });

        if (!course) {
            return res.status(404).send('Course not found');
        }

        // Then, add the user to assignedUsers
        const updatedCourse = await Course.findByIdAndUpdate(id, {
            $addToSet: { assignedUsers: userId }
        }, { new: true }).populate('assignedUsers').populate('interestedUsers');

        res.status(200).json(updated, updatedCourse);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const requestJoin = async (req, res) => {
    const { userId } = req.body; // Assume userId is passed in the request body
    const id = req.params.id;

    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $addToSet: { interestedUsers: userId } }, // Use $addToSet to avoid duplicates
            { new: true }
        ).populate('interestedUsers'); // Optionally populate to return detailed info

        if (!updatedCourse) {
            return res.status(404).send('Course not found');
        }

        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const sendCourseNotification = async (req, res) => {
    const courseName = req.body.courseName;
    try {
        const course = await Course.findById(req.params.id).populate('assignedUsers');
        if (!course) {
            return res.status(404).send('Course not found');
        }
        course.assignedUsers.forEach(async (user) => {
            io.to(user._id.toString()).emit('notification', {
                message: `You have been assigned to the course ${courseName}`,
                courseId: course._id
            });
            try {
                await User.findByIdAndUpdate(user._id, {
                    $push: { notifications: { message: `You have been assigned to the course ${courseName}`, date: new Date(), courseId: course._id } }
                });
            } catch (err) {
                console.error("Failed to save notification for user:", user._id, err);
            }
        });
        res.send('Notification sent and stored');
    } catch (error) {
        console.error("Failed to send notification:", error);
        res.status(500).send('Error sending notification');
    }
};
const deleteComment = async (req, res) => {
    const { id, commentId } = req.params;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).send('Course not found');
        }

        const comment = course.comments.id(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        course.comments.pull(commentId);
        await course.save();

        res.status(200).json(course.comments); // Return the updated list of comments
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Report a comment
const reportComment = async (req, res) => {
    const { id, commentId } = req.params;
    const { userId } = req.body;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).send('Course not found');
        }

        const comment = course.comments.id(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        if (comment.reportedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already reported this comment' });
        }

        comment.reportedBy.push(userId);
        comment.reported = true;
        await course.save();

        res.status(200).send('Comment reported successfully');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Create a new evaluation
const createEvaluation = async (req, res) => {
    const { courseId } = req.params;
    const { userId, evaluationData, comments, aspectsToImprove } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const newEvaluation = {
            userId,
            evaluationData,
            comments,
            aspectsToImprove,
            createdAt: new Date()
        };

        course.evaluations.push(newEvaluation);
        await course.save();

        res.status(201).json(course.evaluations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Download evaluations as an Excel file
const downloadEvaluations = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('evaluations.userId');
        if (!course) {
            return res.status(404).send('Course not found');
        }

        // Convert evaluations to a format suitable for Excel
        const evaluations = course.evaluations.map(evaluation => {
            const evaluationData = evaluation.evaluationData.reduce((acc, item) => {
                acc[item.name] = item.value;
                return acc;
            }, {});

            return {
                userId: evaluation.userId._id.toString(),
                userName: evaluation.userId.name,
                ...evaluationData,
                aspectsToImprove: evaluation.aspectsToImprove,
                createdAt: evaluation.createdAt.toISOString()
            };
        });

        // Create a new workbook and add the evaluations data
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(evaluations);
        XLSX.utils.book_append_sheet(wb, ws, 'Evaluations');

        // Write the workbook to a buffer
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Set headers and send the buffer as a downloadable file
        res.setHeader('Content-Disposition', 'attachment; filename=evaluations.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200).send(buffer);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadImage,
    getAssignedUsers,
    getCoursesByUserId,
    updateCoursePresence,
    getLastestComments,
    handleComments,
    filesUpload,
    fetchFiles,
    assignIntersetedUser,
    requestJoin,
    sendCourseNotification,
    deleteComment,
    reportComment,
    createEvaluation,
    downloadEvaluations,
    getAllComments

};
