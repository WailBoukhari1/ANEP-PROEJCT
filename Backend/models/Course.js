const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['file', 'image', 'video', 'pdf']
    },
    title: { type: String, required: true },
    link: { type: String, required: true },
});
const evaluationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    evaluationData: { type: [Number], required: true },
    comments: { type: String, required: true },
    aspectsToImprove: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }

});

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reported: { type: Boolean, default: false },
    reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const timeSchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    instructorType: {
        type: String,
        required: true,
        enum: ['intern', 'extern']
    },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', required: true }
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    offline: {
        type: String,
        required: true,
        enum: ['online', 'offline']
    },
    description: { type: String },
    notifyUsers: { type: Boolean, default: false },
    hidden: {
        type: String,
        required: true,
        enum: ['visible', 'hidden']
    },
    times: [timeSchema],
    budget: { type: Number, required: true },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    resources: [resourceSchema],
    comments: [commentSchema],
    interestedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    presence: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            required: true
        }
    }],
    evaluations: [evaluationSchema]
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;