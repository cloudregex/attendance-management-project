import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Button,
    alpha,
    useTheme,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    Business as BusinessIcon,
    School as SchoolIcon,
    Person as PersonIcon,
    Badge as BadgeIcon,
} from '@mui/icons-material';

const stats = [
    { label: 'Total Departments', value: '12', icon: <BusinessIcon />, color: '#9c27b0', trend: '+1' },
    { label: 'Total Students', value: '3,450', icon: <SchoolIcon />, color: '#135bec', trend: '+52' },
    { label: 'Total Teachers', value: '150', icon: <PersonIcon />, color: '#2e7d32', trend: '+5' },
    { label: 'Total Staff', value: '45', icon: <BadgeIcon />, color: '#ed6c02', trend: '+2' },
];

const departmentStats = [
    { id: 1, name: 'Computer Science', students: 1250, capacity: 1500, color: '#135bec' },
    { id: 2, name: 'Mechanical Eng.', students: 850, capacity: 1000, color: '#ed6c02' },
    { id: 3, name: 'Civil Engineering', students: 620, capacity: 800, color: '#2e7d32' },
    { id: 4, name: 'Electronics Dept', students: 480, capacity: 600, color: '#9c27b0' },
    { id: 5, name: 'Information Tech.', students: 250, capacity: 400, color: '#d32f2f' },
];

const AdminDashboard = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    return (
        <Box sx={{ width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>Welcome back, Alex</Typography>
                    <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>Here's what's happening with attendance today.</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" startIcon={<TrendingUpIcon />}>
                        Export Report
                    </Button>
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
                {stats.map((stat) => (
                    <Paper key={stat.label} sx={{
                        width: '100%',
                        flex: 1,
                        boxSizing: 'border-box',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '16px',
                        bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: mode === 'dark' ? '0 10px 25px rgba(0,0,0,0.5)' : '0 12px 20px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.05)',
                        },
                        border: '1px solid',
                        borderColor: mode === 'dark' ? '#334155' : 'transparent',
                    }}>
                        <Box
                            sx={{
                                bgcolor: mode === 'dark' ? alpha(stat.color, 0.15) : alpha(stat.color, 0.1),
                                color: stat.color,
                                p: 1.5,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                            }}
                        >
                            {React.cloneElement(stat.icon, { fontSize: 'large' })}
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: mode === 'dark' ? '#F8FAFC' : 'text.primary', textAlign: 'center' }}>
                            {stat.value}
                        </Typography>
                        <Typography variant="body1" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary', fontWeight: 600, textAlign: 'center' }}>
                            {stat.label}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Paper sx={{
                        width: '100%',
                        flex: 1,
                        boxSizing: 'border-box',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '16px',
                        bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? '#334155' : 'transparent',
                    }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary', flexShrink: 0 }}>Weekly Student Attendance</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flexGrow: 1, pt: 2 }}>
                            {[
                                { day: 'Mon', present: 3250, total: 3450, color: '#135bec' },
                                { day: 'Tue', present: 3380, total: 3450, color: '#2e7d32' },
                                { day: 'Wed', present: 3100, total: 3450, color: '#ed6c02' },
                                { day: 'Thu', present: 3400, total: 3450, color: '#9c27b0' },
                                { day: 'Fri', present: 3200, total: 3450, color: '#d32f2f' },
                            ].map((stat) => {
                                const percentage = ((stat.present / stat.total) * 100).toFixed(1);
                                return (
                                    <Box key={stat.day} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%' }}>
                                        <Typography variant="caption" sx={{ color: stat.color, fontWeight: 700, mb: 1 }}>
                                            {percentage}%
                                        </Typography>
                                        <Box sx={{ width: '100%', maxWidth: 48, height: '100%', minHeight: 120, bgcolor: mode === 'dark' ? '#0F172A' : 'grey.100', borderRadius: '8px 8px 0 0', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                                            <Box sx={{ width: '100%', height: `${percentage}%`, bgcolor: stat.color, transition: 'height 1s ease-in-out', borderRadius: '8px 8px 0 0' }} />
                                        </Box>
                                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: mode === 'dark' ? '#E2E8F0' : 'text.primary' }}>{stat.day}</Typography>
                                        <Typography variant="caption" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>
                                            {stat.present} / {stat.total}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Paper sx={{
                        width: '100%',
                        flex: 1,
                        boxSizing: 'border-box',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '16px',
                        bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? '#334155' : 'transparent',
                    }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary', flexShrink: 0 }}>Department Student Count</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flexGrow: 1, pt: 2 }}>
                            {departmentStats.map((dept) => {
                                const percentage = ((dept.students / dept.capacity) * 100).toFixed(1);

                                // Extract acronym for label since names are long
                                const acro = dept.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                                return (
                                    <Box key={dept.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%' }}>
                                        <Typography variant="caption" sx={{ color: dept.color, fontWeight: 700, mb: 1 }}>
                                            {percentage}%
                                        </Typography>
                                        <Box sx={{ width: '100%', maxWidth: 48, height: '100%', minHeight: 120, bgcolor: mode === 'dark' ? '#0F172A' : 'grey.100', borderRadius: '8px 8px 0 0', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                                            <Box sx={{ width: '100%', height: `${percentage}%`, bgcolor: dept.color, transition: 'height 1s ease-in-out', borderRadius: '8px 8px 0 0' }} />
                                        </Box>
                                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: mode === 'dark' ? '#E2E8F0' : 'text.primary' }}>{acro}</Typography>
                                        <Typography variant="caption" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>
                                            {dept.students}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
