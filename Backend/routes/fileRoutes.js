const express = require('express');
const multer = require('multer');
const router = express.Router();

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage: storage });

// Route to handle file uploads
router.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({
            message: 'File uploaded successfully',
            filename: req.file.filename
        });
    } else {
        res.status(400).send('No file uploaded');
    }
});

module.exports = router;