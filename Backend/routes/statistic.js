const express = require('express');
const router = express.Router();
const User = require('./models/user'); // Adjust the path as necessary

// Get statistics by profile
router.get('/profile', async (req, res) => {
    try {
        const profileStats = await User.aggregate([
            {
                $group: {
                    _id: '$roles',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(profileStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get statistics by positions
router.get('/postes', async (req, res) => {
    try {
        const postesStats = await User.aggregate([
            {
                $group: {
                    _id: '$FONCTION',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(postesStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get statistics by department/division
router.get('/direction', async (req, res) => {
    try {
        const directionStats = await User.aggregate([
            {
                $group: {
                    _id: '$DEPARTEMENT_DIVISION',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(directionStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get statistics by region
router.get('/region', async (req, res) => {
    try {
        const regionStats = await User.aggregate([
            {
                $group: {
                    _id: '$Localite',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(regionStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get statistics on absences
router.get('/absences', async (req, res) => {
    try {
        const absenceStats = await User.aggregate([
            {
                $project: {
                    name: 1,
                    vacations: 1,
                    totalDaysAbsent: {
                        $sum: {
                            $map: {
                                input: "$vacations",
                                as: "vacation",
                                in: {
                                    $divide: [
                                        { $subtract: ["$$vacation.end", "$$vacation.start"] },
                                        1000 * 60 * 60 * 24
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);
        res.json(absenceStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get statistics on satisfaction (assuming you have a satisfaction field)
router.get('/satisfaction', async (req, res) => {
    try {
        const satisfactionStats = await User.aggregate([
            {
                $group: {
                    _id: '$satisfaction', // Adjust this to the correct field
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(satisfactionStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
