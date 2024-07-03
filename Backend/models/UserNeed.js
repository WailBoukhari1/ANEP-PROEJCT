const mongoose = require('mongoose');

const userNeedSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [false, 'Message is required'],
    trim: false,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// Middleware to update the `updatedAt` field on document update
userNeedSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserNeed = mongoose.model('UserNeed', userNeedSchema);

module.exports = UserNeed;
