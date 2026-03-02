import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    alpha,
    useTheme,
} from '@mui/material';
import {
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Cancel as CancelIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const stats = [
    { label: 'Total Employees', value: '1,248', icon: <PeopleIcon />, color: '#135bec', trend: '+12%' },
    { label: 'On-time Today', value: '1,082', icon: <CheckCircleIcon />, color: '#2e7d32', trend: '+5%' },
    { label: 'Late Arrival', value: '94', icon: <ScheduleIcon />, color: '#ed6c02', trend: '-2%' },
    { label: 'Absent', value: '72', icon: <CancelIcon />, color: '#d32f2f', trend: '+3%' },
];

const recentAttendance = [
    { id: 1, name: 'John Doe', department: 'Engineering', time: '08:45 AM', status: 'On-Time', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', department: 'Product', time: '09:12 AM', status: 'Late', avatar: 'JS' },
    { id: 3, name: 'Robert Brown', department: 'Marketing', time: '08:55 AM', status: 'On-Time', avatar: 'RB' },
    { id: 4, name: 'Emily Davis', department: 'Engineering', time: '-', status: 'Absent', avatar: 'ED' },
    { id: 5, name: 'Michael Wilson', department: 'Sales', time: '08:30 AM', status: 'On-Time', avatar: 'MW' },
];

const AdminDashboard = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>Welcome back, Alex</Typography>
                    <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>Here's what's happening with attendance today.</Typography>
                </Box>
                <Button variant="contained" startIcon={<TrendingUpIcon />}>
                    Export Report
                </Button>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                        <Paper sx={{
                            p: 3,
                            borderRadius: 3,
                            bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                            boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid',
                            borderColor: mode === 'dark' ? '#334155' : 'transparent',
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box
                                    sx={{
                                        bgcolor: mode === 'dark' ? alpha(stat.color, 0.15) : `${stat.color}15`,
                                        color: stat.color,
                                        p: 1,
                                        borderRadius: 2,
                                        display: 'flex',
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: stat.trend.startsWith('+') ? (mode === 'dark' ? '#4ade80' : 'success.main') : (mode === 'dark' ? '#f87171' : 'error.main'),
                                        fontWeight: 600,
                                        bgcolor: stat.trend.startsWith('+') ? (mode === 'dark' ? alpha('#4ade80', 0.15) : alpha(theme.palette.success.main, 0.1)) : (mode === 'dark' ? alpha('#f87171', 0.15) : alpha(theme.palette.error.main, 0.1)),
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {stat.trend}
                                </Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>
                                {stat.value}
                            </Typography>
                            <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary', fontWeight: 500 }}>
                                {stat.label}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}

                <Grid item xs={12} md={8}>
                    <Paper sx={{
                        p: 0,
                        overflow: 'hidden',
                        borderRadius: 3,
                        bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? '#334155' : 'divider',
                    }}>
                        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: mode === 'dark' ? '#334155' : 'divider' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>Recent Attendance</Typography>
                            <Button color="primary" size="small" sx={{ fontWeight: 600 }}>View All</Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: mode === 'dark' ? '#0F172A' : 'grey.50' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Check-in</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentAttendance.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.light' }}>
                                                        {row.avatar}
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{row.department}</TableCell>
                                            <TableCell>{row.time}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status}
                                                    size="small"
                                                    color={
                                                        row.status === 'On-Time' ? 'success' :
                                                            row.status === 'Late' ? 'warning' : 'error'
                                                    }
                                                    sx={{ fontWeight: 500 }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        p: 3,
                        height: '100%',
                        borderRadius: 3,
                        bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? '#334155' : 'divider',
                    }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>Department Stats</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {[
                                { name: 'Engineering', value: 85, color: '#135bec' },
                                { name: 'Design', value: 92, color: '#2e7d32' },
                                { name: 'Marketing', value: 78, color: '#ed6c02' },
                                { name: 'Operations', value: 88, color: '#9c27b0' },
                            ].map((dept) => (
                                <Box key={dept.name}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: mode === 'dark' ? '#E2E8F0' : 'text.primary' }}>{dept.name}</Typography>
                                        <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary', fontWeight: 500 }}>{dept.value}%</Typography>
                                    </Box>
                                    <Box sx={{ width: '100%', height: 8, bgcolor: mode === 'dark' ? '#0F172A' : 'grey.100', borderRadius: 4, overflow: 'hidden' }}>
                                        <Box sx={{ width: `${dept.value}%`, height: '100%', bgcolor: dept.color }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box >
    );
};

export default AdminDashboard;
