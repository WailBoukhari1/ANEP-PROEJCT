// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: false, unique: false },
}, { timestamps: false });

module.exports = mongoose.model('Category', categorySchema);
