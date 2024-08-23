const Course = require('../models/Course'); // Adjust the path based on your project structure
const User = require('../models/User'); // Adjust the path based on your project structure

// Controller to get designations and interested participants per training
const getDesignationsAndInterest = async (req, res) => {
    try {
        const courses = await Course.find().select('title assignedUsers interestedUsers');
        const data = courses.map(course => ({
            title: course.title,
            assignedCount: course.assignedUsers.length,
            interestedCount: course.interestedUsers.length
        }));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get the distribution of presences
const getPresenceDistribution = async (req, res) => {
    try {
        const courses = await Course.find().select('presence');
        let designatedPresences = 0;
        let nonDesignatedPresences = 0;
        let absences = 0;

        courses.forEach(course => {
            course.presence.forEach(presence => {
                switch (presence.status) {
                    case 'present':
                        designatedPresences++;
                        break;
                    case 'absent':
                        absences++;
                        break;
                    default:
                        nonDesignatedPresences++;
                        break;
                }
            });
        });

        const data = [
            { name: 'Designated Presences', value: designatedPresences },
            { name: 'Non-Designated Presences', value: nonDesignatedPresences },
            { name: 'Absences', value: absences },
        ];

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get scores and evaluation results for radar charts
const getEvaluationDataForRadarCharts = async (req, res) => {
    try {
        const courses = await Course.find().select('title evaluations');
        const radarChartData = {};

        courses.forEach(course => {
            radarChartData[course.title] = {
                labels: [],
                datasets: [
                    {
                        label: course.title,
                        data: []
                    }
                ]
            };

            course.evaluations.forEach(evaluation => {
                evaluation.evaluationData.forEach(data => {
                    if (!radarChartData[course.title].labels.includes(data.name)) {
                        radarChartData[course.title].labels.push(data.name);
                    }
                });
            });

            radarChartData[course.title].labels.forEach(label => {
                const value = course.evaluations
                    .flatMap(evaluation => evaluation.evaluationData)
                    .find(data => data.name === label);
                radarChartData[course.title].datasets[0].data.push(value ? value.value : 0);
            });
        });

        const data = Object.keys(radarChartData).map(title => ({
            title,
            data: radarChartData[title]
        }));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get demographic distribution
const getDemographicDistribution = async (req, res) => {
    try {
        const users = await User.find();

        const ageDistribution = users.reduce((acc, user) => {
            if (user.DATE_NAISSANCE) {
                const age = new Date().getFullYear() - new Date(user.DATE_NAISSANCE).getFullYear();
                if (!acc[age]) acc[age] = 0;
                acc[age]++;
            }
            return acc;
        }, {});

        const genderDistribution = users.reduce((acc, user) => {
            if (user.SEXE) {
                if (!acc[user.SEXE]) acc[user.SEXE] = 0;
                acc[user.SEXE]++;
            }
            return acc;
        }, {});

        const locationDistribution = users.reduce((acc, user) => {
            if (!acc[user.Localite]) acc[user.Localite] = 0;
            acc[user.Localite]++;
            return acc;
        }, {});

        const educationLevelDistribution = users.reduce((acc, user) => {
            if (!acc[user.FONCTION]) acc[user.FONCTION] = 0;
            acc[user.FONCTION]++;
            return acc;
        }, {});

        const workExperienceDistribution = users.reduce((acc, user) => {
            if (!acc[user.AFFECTATION]) acc[user.AFFECTATION] = 0;
            acc[user.AFFECTATION]++;
            return acc;
        }, {});

        res.json({
            ageDistribution,
            genderDistribution,
            locationDistribution,
            educationLevelDistribution,
            workExperienceDistribution,
        });
    } catch (error) {
        console.error('Error fetching demographic distribution:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Updated function to start a session
const startSession = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user info in the request
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.startSession();
    res.status(200).json({ message: 'Session started' });
  } catch (error) {
    res.status(500).json({ message: 'Error starting session', error: error.message });
  }
};

// Updated function to update session activity
const updateSessionActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.updateSessionActivity();
    res.status(200).json({ message: 'Session activity updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating session activity', error: error.message });
  }
};

// Updated function to end a session
const endSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.endSession();
    res.status(200).json({ message: 'Session ended' });
  } catch (error) {
    res.status(500).json({ message: 'Error ending session', error: error.message });
  }
};

// Function to get group comparison data
const getGroupComparisons = async (req, res) => {
    try {
        // Define fields for different comparisons
        const comparisonFields = [
            { field: 'DEPARTEMENT_DIVISION', label: 'Department' },
            { field: 'GRADE_fonction', label: 'Seniority' },
            { field: 'FONCTION', label: 'Function' },
            { field: 'Localite', label: 'Location' },
            { field: 'AGE', label: 'Age' },
            { field: 'SEX', label: 'Gender' },
            { field: 'EDUCATION', label: 'Education Level' },
            { field: 'EXPERIENCE', label: 'Experience' },
        ];

        const results = {};

        // Process each comparison field dynamically
        for (const { field, label } of comparisonFields) {
            const aggregationPipeline = [
                {
                    $group: {
                        _id: `$${field}`,
                        totalUsers: { $sum: 1 },
                        averageExperience: { $avg: { $ifNull: ["$ECHEL", 0] } }
                    }
                }
            ];

            const comparisonData = await User.aggregate(aggregationPipeline);
            results[`${label}Comparison`] = comparisonData;
        }

        res.json(results);
    } catch (error) {
        console.error('Error fetching group comparison data:', error);
        res.status(500).json({ message: 'Error fetching group comparison data' });
    }
};

// Function to get distribution by department/profile/year/gender
const getDistributionData = async (req, res) => {
    try {
        const departments = await User.aggregate([
            { $group: { _id: '$DEPARTEMENT_DIVISION', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null, $ne: "" } } }
        ]);

        const profiles = await User.aggregate([
            { $group: { _id: '$FONCTION', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null, $ne: "" } } }
        ]);

        const genders = await User.aggregate([
            { $group: { _id: '$SEXE', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null, $ne: "" } } }
        ]);

        res.json({
            departments,
            profiles,
            genders
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching distribution data', error });
    }
};

module.exports = {
    getDesignationsAndInterest,
    getPresenceDistribution,
    getEvaluationDataForRadarCharts,
    getDemographicDistribution,
    startSession,
    updateSessionActivity,
    endSession,
    getGroupComparisons,
    getDistributionData
};