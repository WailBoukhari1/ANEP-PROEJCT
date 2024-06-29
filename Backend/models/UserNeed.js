const mongoose = require('mongoose');

const userNeedSchema = new mongoose.Schema({
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserNeed = mongoose.model('UserNeed', userNeedSchema);

module.exports = UserNeed;
