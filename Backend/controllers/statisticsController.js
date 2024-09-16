const Course = require('../models/Course');
const User = require('../models/User');

// Enrollment Rate
const getEnrollmentRate = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const unregisteredUsers = await User.countDocuments({ password: { $exists: false } });
        const enrolledUsers = totalUsers - unregisteredUsers;
        const enrollmentRate = (enrolledUsers / totalUsers) * 100;

        res.status(200).json({ total: totalUsers, enrolled: enrolledUsers, rate: enrollmentRate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Beneficiary Rate
const getBeneficiaryRate = async (req, res) => {
    try {
        const totalUsersWithPassword = await User.countDocuments({ password: { $exists: true, $ne: null } });
        const beneficiaries = await Course.distinct('assignedUsers').count();
        const beneficiaryRate = (beneficiaries / totalUsersWithPassword) * 100;

        res.status(200).json({ total: totalUsersWithPassword, beneficiaries: beneficiaries, rate: beneficiaryRate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Attendance Rate
const getAttendanceRate = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentYear = new Date().getFullYear();
        const courses = await Course.find({
            'times.startTime': { $gte: new Date(currentYear, 0, 1).toISOString(), $lte: new Date(currentYear, 11, 31).toISOString() }
        }).populate('assignedUsers');

        const monthlyData = Array(12).fill().map(() => ({ attendedCourses: 0, totalAssignedCourses: 0 }));

        courses.forEach(course => {
            course.times.forEach(time => {
                const month = new Date(time.startTime).getMonth();
                const assignedUsers = course.assignedUsers.length;
                monthlyData[month].totalAssignedCourses += assignedUsers;

                course.presence.forEach(p => {
                    if (p.status === 'present') {
                        if (userId && p.userId.toString() === userId) {
                            monthlyData[month].attendedCourses++;
                        } else if (!userId) {
                            monthlyData[month].attendedCourses++;
                        }
                    }
                });
            });
        });

        const chartData = monthlyData.map((data, index) => ({
            month: new Date(currentYear, index, 1).toLocaleString('default', { month: 'long' }),
            attendedCourses: data.attendedCourses,
            totalAssignedCourses: data.totalAssignedCourses,
            attendanceRate: data.totalAssignedCourses > 0 ? (data.attendedCourses / data.totalAssignedCourses) * 100 : 0
        }));

        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Evaluation Scores
const getEvaluationScores = async (req, res) => {
    try {
        const { courseId } = req.params;
        const courses = courseId 
            ? await Course.find({ _id: courseId }).select('evaluations')
            : await Course.find().select('evaluations');

        const evaluationLabels = [
            "Apports d'informations",
            "Conception de la démarche",
            "Qualité de l'animation",
            "Conditions matérielles",
            "Adaptation aux tâches professionnelles",
            "Motivation à me perfectionner dans le domaine",
            "Réponse aux attentes",
            "Implication des participants"
        ];

        let totalScores = evaluationLabels.map(() => 0);
        let totalEvaluations = 0;

        courses.forEach(course => {
            course.evaluations.forEach(evaluation => {
                totalEvaluations++;
                evaluation.evaluationData.forEach((data, index) => {
                    totalScores[index] += data.value;
                });
            });
        });

        const averageScores = totalScores.map(score => totalEvaluations > 0 ? score / totalEvaluations : 0);

        const result = evaluationLabels.map((label, index) => ({
            axis: label,
            score: averageScores[index]
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Completion Rate
const getCompletionRate = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const courses = await Course.find({
            'times.endTime': { 
                $gte: new Date(currentYear, 0, 1).toISOString(), 
                $lte: new Date(currentYear, 11, 31).toISOString() 
            }
        });

        const monthlyData = Array(12).fill().map(() => ({ completed: 0, total: 0 }));

        courses.forEach(course => {
            const courseEndMonth = new Date(course.times[course.times.length - 1].endTime).getMonth();
            const totalParticipants = course.assignedUsers.length;
            const completedParticipants = course.assignedUsers.filter(userId => {
                const userPresences = course.presence.filter(p => p.userId.equals(userId) && p.status === 'present');
                const hasFeedback = course.evaluations.some(evaluation => evaluation.userId.equals(userId));
                return userPresences.length >= 0.8 * course.times.length && hasFeedback;
            }).length;

            monthlyData[courseEndMonth].total += totalParticipants;
            monthlyData[courseEndMonth].completed += completedParticipants;
        });

        const chartData = monthlyData.map((data, index) => ({
            month: new Date(currentYear, index, 1).toLocaleString('default', { month: 'long' }),
            completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0
        }));

        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Dropout Rate
const getDropoutRate = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const courses = await Course.find({
            'createdAt': { 
                $gte: new Date(currentYear, 0, 1).toISOString(), 
                $lte: new Date(currentYear, 11, 31).toISOString() 
            }
        }).populate('assignedUsers');

        const monthlyData = Array(12).fill().map(() => ({ dropped: 0, total: 0 }));

        courses.forEach(course => {
            const courseCreationMonth = new Date(course.createdAt).getMonth();
            const totalParticipants = course.assignedUsers.length;
            const droppedParticipants = course.assignedUsers.filter(user => 
                !course.presence.some(p => p.userId.equals(user._id) && p.status === 'present')
            ).length;

            monthlyData[courseCreationMonth].total += totalParticipants;
            monthlyData[courseCreationMonth].dropped += droppedParticipants;
        });

        const chartData = monthlyData.map((data, index) => ({
            month: new Date(currentYear, index, 1).toLocaleString('default', { month: 'long' }),
            dropoutRate: data.total > 0 ? (data.dropped / data.total) * 100 : 0
        }));

        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEnrollmentRate,
    getBeneficiaryRate,
    getAttendanceRate,
    getEvaluationScores,
    getCompletionRate,
    getDropoutRate
};