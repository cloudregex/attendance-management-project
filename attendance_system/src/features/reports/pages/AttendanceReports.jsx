import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Chip,
    Alert,
    useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
    Download as DownloadIcon, 
    CheckCircle as PresentIcon, 
    Cancel as AbsentIcon, 
    Schedule as LateIcon 
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import dayjs from 'dayjs';

const MetricCard = ({ title, value, icon, color, bgcolor }) => (
    <Paper sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 3,
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: bgcolor || 'background.paper',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-2px)' }
    }}>
        <Box sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}15`,
            color: color,
            display: 'flex'
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>{value}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
                {title}
            </Typography>
        </Box>
    </Paper>
);

const AttendanceReports = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, late: 0, attendanceRate: '0.00' });
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        startDate: dayjs().subtract(7, 'day'),
        endDate: dayjs(),
        course_id: '',
        status: ''
    });

    const fetchCourses = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/academic/courses');
            if (res.data.success) {
                setCourses(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        }
    }, []);

    const fetchReport = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                startDate: filters.startDate ? filters.startDate.format('YYYY-MM-DD') : '',
                endDate: filters.endDate ? filters.endDate.format('YYYY-MM-DD') : '',
                course_id: filters.course_id,
                status: filters.status
            };

            const res = await axiosInstance.get('/attendance/report', { params });
            if (res.data.success) {
                setReportData(res.data.data);
                setSummary(res.data.summary);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch attendance report.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchCourses();
        fetchReport();
    }, [fetchCourses, fetchReport]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const columns = [
        { field: 'date', headerName: 'Date', width: 120 },
        { 
            field: 'studentName', 
            headerName: 'Student Name', 
            flex: 1,
            valueGetter: (params, row) => `${row.student?.first_name || ''} ${row.student?.last_name || ''}`
        },
        { 
            field: 'rollNumber', 
            headerName: 'Roll No.', 
            width: 150,
            valueGetter: (params, row) => row.student?.roll_number || '-'
        },
        { 
            field: 'course', 
            headerName: 'Course', 
            width: 130,
            valueGetter: (params, row) => row.timetable?.course?.code || '-'
        },
        { 
            field: 'subject', 
            headerName: 'Subject', 
            width: 150,
            valueGetter: (params, row) => row.timetable?.subject?.code || '-'
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => {
                const statusColors = {
                    present: 'success',
                    absent: 'error',
                    late: 'warning',
                    excused: 'info'
                };
                return (
                    <Chip 
                        label={params.value} 
                        color={statusColors[params.value] || 'default'} 
                        size="small" 
                        sx={{ fontWeight: 700, textTransform: 'capitalize', borderRadius: 1 }}
                    />
                );
            }
        },
        { field: 'remarks', headerName: 'Remarks', flex: 1 },
    ];

    return (
        <Box sx={{ width: '100%', minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>Attendance Reports</Typography>
                    <Typography variant="body2" color="text.secondary">
                        View, filter, and export comprehensive student attendance records.
                    </Typography>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Metrics */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                <MetricCard title="Overall Rate" value={`${summary.attendanceRate}%`} icon={<PresentIcon fontSize="large" />} color="#059669" bgcolor={mode === 'dark' ? '#064E3B20' : '#ECFDF5'} />
                <MetricCard title="Total Present" value={summary.present} icon={<PresentIcon fontSize="large" />} color="#059669" />
                <MetricCard title="Total Absent" value={summary.absent} icon={<AbsentIcon fontSize="large" />} color="#DC2626" />
                <MetricCard title="Total Late" value={summary.late} icon={<LateIcon fontSize="large" />} color="#D97706" />
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', color: 'text.secondary' }}>
                    Filter Criteria
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <DatePicker
                        label="Start Date"
                        value={filters.startDate}
                        onChange={(newValue) => handleFilterChange('startDate', newValue)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                    <DatePicker
                        label="End Date"
                        value={filters.endDate}
                        onChange={(newValue) => handleFilterChange('endDate', newValue)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                    <TextField
                        select
                        label="Course"
                        size="small"
                        fullWidth
                        value={filters.course_id}
                        onChange={(e) => handleFilterChange('course_id', e.target.value)}
                    >
                        <MenuItem value="">All Courses</MenuItem>
                        {courses.map(course => (
                            <MenuItem key={course.id} value={course.id}>{course.code} - {course.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Status"
                        size="small"
                        fullWidth
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="present">Present</MenuItem>
                        <MenuItem value="absent">Absent</MenuItem>
                        <MenuItem value="late">Late</MenuItem>
                        <MenuItem value="excused">Excused</MenuItem>
                    </TextField>
                </Stack>
            </Paper>

            {/* Data Table */}
            <Paper sx={{ height: 600, width: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <DataGrid
                    rows={reportData}
                    columns={columns}
                    loading={loading}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                    }}
                    pageSizeOptions={[25, 50, 100]}
                    disableRowSelectionOnClick
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell:focus': { outline: 'none' },
                        '& .MuiDataGrid-row:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }
                    }}
                />
            </Paper>
        </Box>
    );
};

export default AttendanceReports;
