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
    Breadcrumbs,
    Link,
    alpha,
    useTheme,
} from '@mui/material';
import {
    NavigateNext as NavigateNextIcon,
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

const deptStats = [
    { label: 'Dept Employees', value: '42', icon: <PeopleIcon />, color: '#135bec' },
    { label: 'Present Today', value: '38', icon: <CheckCircleIcon />, color: '#2e7d32' },
    { label: 'Late', value: '3', icon: <ScheduleIcon />, color: '#ed6c02' },
    { label: 'Leave/Absent', value: '1', icon: <CalendarIcon />, color: '#d32f2f' },
];

const teamAttendance = [
    { id: 1, name: 'Alice Wong', role: 'Frontend Dev', time: '08:45 AM', status: 'On-Time', avatar: 'AW' },
    { id: 2, name: 'Bob Smith', role: 'Backend Dev', time: '09:05 AM', status: 'Late', avatar: 'BS' },
    { id: 3, name: 'Charlie Day', role: 'UI Designer', time: '08:55 AM', status: 'On-Time', avatar: 'CD' },
    { id: 4, name: 'Diana Prince', role: 'QA Engineer', time: '-', status: 'Absent', avatar: 'DP' },
    { id: 5, name: 'Ethan Hunt', role: 'DevOps', time: '08:30 AM', status: 'On-Time', avatar: 'EH' },
];

const DeptDashboard = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
                    <Link underline="hover" color="inherit" href="/">
                        Dashboard
                    </Link>
                    <Typography color="text.primary">Engineering Department</Typography>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>Engineering Team</Typography>
                        <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>Overview of your department's attendance.</Typography>
                    </Box>
                    <Button variant="outlined" color="primary" sx={{ fontWeight: 600 }}> Manage Schedule </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {deptStats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                        <Paper sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: mode === 'dark' ? '#334155' : 'grey.100',
                            bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                            boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : 'none'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        bgcolor: mode === 'dark' ? alpha(stat.color, 0.15) : `${stat.color}15`,
                                        color: stat.color,
                                        p: 1.5,
                                        borderRadius: '50%',
                                        display: 'flex',
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary', fontWeight: 500 }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Paper sx={{
                        p: 0,
                        overflow: 'hidden',
                        borderRadius: 3,
                        bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? '#334155' : 'divider',
                    }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: mode === 'dark' ? '#334155' : 'divider' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>Team Attendance Status</Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: mode === 'dark' ? '#0F172A' : 'grey.50' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Check-in Time</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {teamAttendance.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'secondary.light' }}>
                                                        {row.avatar}
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption" sx={{
                                                    bgcolor: mode === 'dark' ? '#0F172A' : 'grey.100',
                                                    color: mode === 'dark' ? '#E2E8F0' : 'text.primary',
                                                    px: 1, py: 0.5, borderRadius: 1
                                                }}>
                                                    {row.role}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{row.time}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status}
                                                    size="small"
                                                    variant="outlined"
                                                    color={
                                                        row.status === 'On-Time' ? 'success' :
                                                            row.status === 'Late' ? 'warning' : 'error'
                                                    }
                                                    sx={{ fontWeight: 500 }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'right' }}>
                                                <Button size="small">Details</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DeptDashboard;

// abc comment