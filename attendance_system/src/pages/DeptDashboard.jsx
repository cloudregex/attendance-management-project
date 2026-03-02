import React, { useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Avatar,
    Autocomplete,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Card,
    CardContent,
    Chip,
    Fade,
    IconButton,
} from '@mui/material';
import {
    People as PeopleIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    Email as EmailIcon,
    MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

// Mock Data
const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'eng', name: 'Engineering' },
    { id: 'des', name: 'Design' },
    { id: 'mkt', name: 'Marketing' },
    { id: 'hr', name: 'Human Resources' }
];

const studentsData = [
    { id: 1, name: 'John Smith', roll: 'CS001', year: '3rd Year', attendance: 85, status: 'Present', avatar: 'JS', deptId: 'eng' },
    { id: 2, name: 'Emily Brown', roll: 'CS002', year: '3rd Year', attendance: 92, status: 'Present', avatar: 'EB', deptId: 'eng' },
    { id: 3, name: 'Michael Ross', roll: 'DS001', year: '2nd Year', attendance: 78, status: 'Late', avatar: 'MR', deptId: 'des' },
    { id: 4, name: 'Sarah Parker', roll: 'MK001', year: '1st Year', attendance: 88, status: 'Present', avatar: 'SP', deptId: 'mkt' },
    { id: 5, name: 'Kevin Lee', roll: 'HR001', year: '2nd Year', attendance: 65, status: 'Absent', avatar: 'KL', deptId: 'hr' },
    { id: 6, name: 'Jessica Chen', roll: 'CS003', year: '4th Year', attendance: 95, status: 'Present', avatar: 'JC', deptId: 'eng' },
];

const employeesData = [
    { id: 101, name: 'Robert Miller', designation: 'Senior Engineer', email: 'robert@example.com', status: 'Active', avatar: 'RM', deptId: 'eng' },
    { id: 102, name: 'Amanda Green', designation: 'UI Architect', email: 'amanda@example.com', status: 'Active', avatar: 'AG', deptId: 'des' },
    { id: 103, name: 'David Smith', designation: 'Marketing Expert', email: 'david@example.com', status: 'On Leave', avatar: 'DS', deptId: 'mkt' },
    { id: 104, name: 'Rachel White', designation: 'HR Coordinator', email: 'rachel@example.com', status: 'Active', avatar: 'RW', deptId: 'hr' },
    { id: 105, name: 'Steven Jobs', designation: 'Hardware Lead', email: 'steven@example.com', status: 'Active', avatar: 'SJ', deptId: 'eng' },
    { id: 106, name: 'Emma Watson', designation: 'Product Designer', email: 'emma@example.com', status: 'Active', avatar: 'EW', deptId: 'des' },
];

const DeptDashboard = () => {
    const [dept, setDept] = useState(departments[0]);
    const [view, setView] = useState('students');

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const filteredStudents = studentsData.filter(s => dept.id === 'all' || s.deptId === dept.id);
    const filteredEmployees = employeesData.filter(e => dept.id === 'all' || e.deptId === dept.id);

    const studentColumns = [
        {
            field: 'avatar',
            headerName: 'Avatar',
            width: 80,
            renderCell: (params) => (
                <Avatar sx={{ width: 32, height: 32, bgcolor: params.row.status === 'Present' ? 'primary.light' : 'grey.400', fontSize: '0.8rem' }}>
                    {params.value}
                </Avatar>
            ),
        },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'roll', headerName: 'Roll Number', width: 130 },
        { field: 'year', headerName: 'Year', width: 120 },
        {
            field: 'attendance',
            headerName: 'Attendance %',
            width: 130,
            renderCell: (params) => (
                <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>{params.value}%</Typography>
                    <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.100', borderRadius: 2 }}>
                        <Box sx={{ width: `${params.value}%`, height: '100%', bgcolor: params.value > 80 ? 'success.main' : params.value > 60 ? 'warning.main' : 'error.main', borderRadius: 2 }} />
                    </Box>
                </Box>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={params.value === 'Present' ? 'success' : params.value === 'Late' ? 'warning' : 'error'}
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 110,
            sortable: false,
            renderCell: () => (
                <Button size="small" sx={{ textTransform: 'none' }}>Edit</Button>
            )
        }
    ];

    return (
        <Box sx={{ p: 1 }}>
            {/* Header Control Bar */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', md: 'center' },
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                        <Autocomplete
                            options={departments}
                            getOptionLabel={(option) => option.name}
                            value={dept}
                            onChange={(e, newValue) => setDept(newValue || departments[0])}
                            renderInput={(params) => <TextField {...params} label="Select Department" size="small" />}
                            sx={{ minWidth: 220, flexShrink: 0 }}
                            disableClearable
                        />

                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={handleViewChange}
                            aria-label="view toggle"
                            size="small"
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                '& .MuiToggleButton-root': {
                                    px: 3,
                                    py: 0.7,
                                    border: 'none',
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        }
                                    }
                                }
                            }}
                        >
                            <ToggleButton value="students">
                                Students
                            </ToggleButton>
                            <ToggleButton value="employees">
                                Employees
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            px: 3,
                            boxShadow: 'none',
                            '&:hover': { boxShadow: '0 4px 12px rgba(19, 91, 236, 0.2)' }
                        }}
                    >
                        Add {view === 'students' ? 'Student' : 'Employee'}
                    </Button>
                </Box>
            </Paper>

            {/* Content Area */}
            <Box sx={{ position: 'relative' }}>
                <Fade in={view === 'students'} timeout={500} unmountOnExit>
                    <Box>
                        <Paper sx={{ height: 480, width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                            <DataGrid
                                rows={filteredStudents}
                                columns={studentColumns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                disableSelectionOnClick
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-columnHeaders': {
                                        bgcolor: 'grey.50',
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        bgcolor: 'rgba(19, 91, 236, 0.04)',
                                    }
                                }}
                            />
                        </Paper>
                    </Box>
                </Fade>

                <Fade in={view === 'employees'} timeout={500} unmountOnExit>
                    <Box sx={{ mt: view === 'students' ? 0 : 0 }}>
                        <Grid container spacing={3}>
                            {filteredEmployees.map((employee) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={employee.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            boxShadow: 'none',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -3 }}>
                                                <IconButton size="small">
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            <Avatar
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    mx: 'auto',
                                                    mb: 2,
                                                    bgcolor: 'primary.light',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 700
                                                }}
                                            >
                                                {employee.avatar}
                                            </Avatar>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {employee.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 20 }}>
                                                {employee.designation}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                                                <EmailIcon sx={{ fontSize: '0.9rem' }} />
                                                <Typography variant="caption">{employee.email}</Typography>
                                            </Box>

                                            <Chip
                                                label={employee.status}
                                                size="small"
                                                color={employee.status === 'Active' ? 'success' : 'warning'}
                                                sx={{ fontWeight: 600, borderRadius: 1 }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Fade>
            </Box>
        </Box>
    );
};

export default DeptDashboard;

