const Course = require('../models/Course'); // Adjust the path based on your project structure

// Controller to get designations and interested participants per training
const getDesignationsAndInterest = async (req, res) => {
    try {
        // Fetch courses and select only relevant fields
        const courses = await Course.find().select('title assignedUsers interestedUsers');

        // Prepare data for the frontend
        const data = courses.map(course => ({
            title: course.title,
            assignedCount: course.assignedUsers.length,
            interestedCount: course.interestedUsers.length
        }));

        // Send the data as JSON
        res.status(200).json(data);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: error.message });
    }
};
// Controller to get the distribution of presences
const getPresenceDistribution = async (req, res) => {
    try {
        // Fetch courses with their presence data
        const courses = await Course.find().select('presence');

        // Initialize counters
        let designatedPresences = 0;
        let nonDesignatedPresences = 0;
        let absences = 0;

        // Process each course
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

        // Prepare data for frontend
        const data = [
            { name: 'Designated Presences', value: designatedPresences },
            { name: 'Non-Designated Presences', value: nonDesignatedPresences },
            { name: 'Absences', value: absences },
        ];

        // Send the data as JSON
        res.status(200).json(data);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: error.message });
    }
};  


module.exports = {
    getDesignationsAndInterest,
    getPresenceDistribution,
};
