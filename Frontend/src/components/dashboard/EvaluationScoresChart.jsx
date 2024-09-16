import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EvaluationScoresChart = ({ data, courses, fetchEvaluationScores, fetchCourseDetails }) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [chartData, setChartData] = useState([]);
    const [courseName, setCourseName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            console.log('Selected Course:', selectedCourse); // Debugging statement
            const response = await fetchEvaluationScores(selectedCourse);
            console.log('Fetched Evaluation Scores:', response); // Debugging statement
            setChartData(response);

            if (selectedCourse) {
                const courseDetails = await fetchCourseDetails(selectedCourse);
                setCourseName(courseDetails.name);
            } else {
                setCourseName('');
            }
        };
        fetchData();
    }, [selectedCourse, fetchEvaluationScores, fetchCourseDetails]);

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    console.log('Chart Data:', chartData); // Debugging statement

    if (!chartData || chartData.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <FormControl fullWidth>
                <InputLabel>Select Course</InputLabel>
                <Select value={selectedCourse} onChange={handleCourseChange}>
                    <MenuItem value="">All Courses</MenuItem>
                    {courses && courses.map((course) => (
                        <MenuItem key={course._id} value={course._id}>{course.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {courseName && <h2>{courseName}</h2>}
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="axis" />
                    <PolarRadiusAxis angle={30} domain={[0, 7]} />
                    <Radar name="Score moyen" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EvaluationScoresChart;