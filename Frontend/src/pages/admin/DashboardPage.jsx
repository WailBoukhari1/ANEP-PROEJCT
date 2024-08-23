import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, CircularProgress, Box, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Tooltip as PieTooltip, Cell, ResponsiveContainer as PieContainer } from 'recharts';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import useApiAxios from "../../config/axios";
import AdminLayout from "../../layout/admin/AdminLayout";
import { schemeCategory10 } from 'd3-scale-chromatic';

// Colors for the pie chart
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// Dashboard Page Component
const DashboardPage = () => {
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [radarData, setRadarData] = useState([]);
    const [demographicData, setDemographicData] = useState({});
    const [groupComparisonData, setGroupComparisonData] = useState({});
    const [distributionData, setDistributionData] = useState({});
    const [loading, setLoading] = useState(true);
    const [visibleCourses, setVisibleCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    designationsResponse,
                    presenceResponse,
                    evaluationsResponse,
                    demographicResponse,
                    groupComparisonResponse,
                    distributionResponse
                ] = await Promise.all([
                    useApiAxios.get('/statistics/designations-and-interest'),
                    useApiAxios.get('/statistics/presence-distribution'),
                    useApiAxios.get('/statistics/evaluations-by-course'),
                    useApiAxios.get('/statistics/demographic-distribution'),
                    useApiAxios.get('/statistics/group-comparison'),
                    useApiAxios.get('/statistics/distribution-data')
                ]);

                setBarData(designationsResponse.data);
                setPieData(presenceResponse.data);
                setRadarData(evaluationsResponse.data);
                setDemographicData(demographicResponse.data);
                setGroupComparisonData(groupComparisonResponse.data);
                setDistributionData(distributionResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (radarData.length) {
            setVisibleCourses(radarData.map(course => course.title));
        }
    }, [radarData]);

    const handleCourseVisibilityChange = (event) => {
        setVisibleCourses(event.target.value);
    };

    // Function to prepare data for the combined radar chart
    const prepareRadarData = () => {
        if (!radarData.length) return [];

        const allLabels = new Set();
        radarData.forEach(course => {
            course.data.labels.forEach(label => allLabels.add(label));
        });

        return Array.from(allLabels).map(label => {
            const dataPoint = { subject: label };
            radarData.forEach(course => {
                const index = course.data.labels.indexOf(label);
                dataPoint[course.title] = index !== -1 ? course.data.datasets[0].data[index] : 0;
            });
            return dataPoint;
        });
    };

    const combinedRadarData = prepareRadarData();

    // Prepare data for the demographic charts
    const prepareAgeData = (ageDistribution) => {
        const categories = {};
        Object.entries(ageDistribution || {}).forEach(([age, count]) => {
            const ageNum = parseInt(age);
            const category = `${Math.floor(ageNum / 5) * 5}-${Math.floor(ageNum / 5) * 5 + 4}`;
            categories[category] = (categories[category] || 0) + count;
        });
        return Object.entries(categories).map(([category, count]) => ({ category, count }));
    };

    const ageData = prepareAgeData(demographicData.ageDistribution);

    const locationData = Object.entries(demographicData.locationDistribution || {}).map(([location, count]) => ({ location, count }));
    const educationData = Object.entries(demographicData.educationLevelDistribution || {}).map(([education, count]) => ({ education, count }));
    const experienceData = Object.entries(demographicData.workExperienceDistribution || {}).map(([experience, count]) => ({ experience, count }));

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <CircularProgress />
                    <Typography variant="h6" style={{ marginTop: '20px' }}>Loading...</Typography>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Grid container spacing={3} padding={3}>
                {/* Designations and Interested Participants */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">Désignations et Participants Intéressés</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="title" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="assignedCount" fill="#8884d8" name="Désignations" />
                                <Bar dataKey="interestedCount" fill="#82ca9d" name="Participants Intéressés" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Presence Distribution */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">Distribution des Présences</Typography>
                        <PieContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={150}
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <PieTooltip />
                            </PieChart>
                        </PieContainer>
                    </Paper>
                </Grid>

                {/* Evaluations by Course (Radar Chart) */}
                <Grid item xs={12} md={12}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: '24px',
                            borderRadius: '12px',
                            background: 'linear-gradient(to bottom right, #f8f9fa, #e9ecef)',
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                marginBottom: '16px',
                                textAlign: 'center',
                            }}
                        >
                            Évaluations par Cours
                        </Typography>
                        <FormControl sx={{ m: 1, width: 1225 }}>
                            <InputLabel id="course-select-label">Cours Visibles</InputLabel>
                            <Select
                                labelId="course-select-label"
                                multiple
                                value={visibleCourses}
                                onChange={handleCourseVisibilityChange}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {radarData.map((course) => (
                                    <MenuItem key={course.title} value={course.title}>
                                        {course.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box
                            sx={{
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                padding: '16px',
                                background: '#ffffff',
                            }}
                        >
                            <ResponsiveContainer width="100%" height={400}>
                                <RadarChart data={combinedRadarData}>
                                    <PolarGrid
                                        stroke="#bdc3c7"
                                        strokeDasharray="3 3"
                                    />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: '#34495e', fontSize: 12 }}
                                    />
                                    <PolarRadiusAxis
                                        angle={30}
                                        domain={[1, 7]}
                                        tickCount={7}
                                        stroke="#7f8c8d"
                                    />
                                    {radarData.map((course, index) => (
                                        visibleCourses.includes(course.title) && (
                                            <Radar
                                                key={course.title}
                                                name={course.title}
                                                dataKey={course.title}
                                                stroke={schemeCategory10[index % 10]}
                                                fill={schemeCategory10[index % 10]}
                                                fillOpacity={0.2}
                                            />
                                        )
                                    ))}
                                    <Tooltip contentStyle={{ background: '#f8f9fa', border: '1px solid #dee2e6' }} />
                                    <Legend
                                        iconSize={10}
                                        wrapperStyle={{
                                            paddingTop: '20px',
                                            fontSize: '12px',
                                        }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Demographic Distribution Charts */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">Distribution par Âge</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={ageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>



                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">Distribution par Localisation</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={locationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="location" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">Distribution par Niveau d'Éducation</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={educationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="education" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#FFBB28" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h6">Distribution par Expérience Professionnelle</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={experienceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="experience" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#FF8042" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Group Comparison Charts */}
                {Object.entries(groupComparisonData).map(([key, data]) => (
                    <Grid item xs={12} md={6} key={key}>
                        <Paper elevation={3} style={{ padding: '16px' }}>
                            <Typography variant="h6">{key}</Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="_id" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="totalUsers" fill="#8884d8" name="Utilisateurs Totaux" />
                                    <Bar dataKey="averageExperience" fill="#82ca9d" name="Expérience Moyenne" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                ))}

                {/* Distribution Data Charts */}
                {Object.entries(distributionData).map(([key, data]) => (
                    <Grid item xs={12} md={6} key={key}>
                        <Paper elevation={3} style={{ padding: '16px' }}>
                            <Typography variant="h6">{`Distribution par ${key}`}</Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="count"
                                        nameKey="_id"
                                        outerRadius={150}
                                        label
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <PieTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </AdminLayout>
    );
};

export default DashboardPage;
