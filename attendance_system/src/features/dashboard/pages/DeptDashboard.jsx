import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Avatar,
    Breadcrumbs,
    Link,
    Autocomplete,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
    Fade,
    CircularProgress,
    IconButton,
    useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    People as PeopleIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    NavigateNext as NavigateNextIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { 
    DataGrid, 
    GridToolbarContainer, 
    GridToolbarExport 
} from '@mui/x-data-grid';
import AddTeacherForm from '../../employees/components/AddTeacherForm';
import AddStudentForm from '../../students/components/AddStudentForm';
import { useToast } from '../hooks/useToast.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ALL_DEPT = { id: 'all', name: 'All Departments' };

const DeptDashboard = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const { toast, ToastSnackbar } = useToast();

    // ── data state ──────────────────────────────────────────────────────
    const [departments, setDepartments] = useState([ALL_DEPT]);
    const [studentsData, setStudentsData] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [loadingTeachers, setLoadingTeachers] = useState(true);

    // ── UI state ────────────────────────────────────────────────────────
    const [dept, setDept] = useState(ALL_DEPT);
    const [view, setView] = useState('students');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [teacherFormOpen, setTeacherFormOpen] = useState(false);
    const [studentFormOpen, setStudentFormOpen] = useState(false);

    // ── fetch departments ───────────────────────────────────────────────
    const fetchDepartments = useCallback(async () => {
        try {
            const res = await fetch(`${API}/departments`);
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                const mapped = data.map(d => ({ id: String(d.id), name: d.name }));
                setDepartments([ALL_DEPT, ...mapped]);
            } else {
                toast.error(data?.message || 'Failed to load departments.', 'Departments');
            }
        } catch {
            toast.error('Could not reach server. Check your connection.', 'Departments');
        }
    }, []);

    // ── fetch students ──────────────────────────────────────────────────
    const fetchStudents = useCallback(async (silent = false) => {
        if (!silent) setLoadingStudents(true);
        try {
            const res = await fetch(`${API}/students`);
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                const mapped = data.map(s => ({
                    id: s.id || Math.random(),
                    name: [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' ') || 'Unknown',
                    roll: s.roll_number || '—',
                    year: s.class_name || s.semester || '—',
                    course: s.course || '—',
                    status: s.status ? 'Active' : 'Inactive',
                    avatar: `${(s.first_name || '?')[0]}${(s.last_name || '?')[0]}`.toUpperCase(),
                    deptId: String(s.department_id || ''),
                }));
                setStudentsData(mapped);
                if (!silent) toast.success(`Loaded ${mapped.length} student(s).`, 'Students');
            } else {
                toast.error(data?.message || 'Failed to load students.', 'Students');
            }
        } catch {
            toast.error('Network error loading students.', 'Students');
        } finally {
            setLoadingStudents(false);
        }
    }, []);

    // ── fetch teachers ──────────────────────────────────────────────────
    const fetchTeachers = useCallback(async (silent = false) => {
        if (!silent) setLoadingTeachers(true);
        try {
            const res = await fetch(`${API}/teachers`);
            const data = await res.json();
            if (res.ok) {
                const mapped = data.map(t => ({
                    id: t.id,
                    name: t.first_name,
                    designation: t.designation || '—',
                    email: t.email,
                    status: t.status ? 'Active' : 'Inactive',
                    avatar: (t.first_name || '?').slice(0, 2).toUpperCase(),
                    deptId: String(t.department_id),
                }));
                setTeachersData(mapped);
                if (!silent) toast.success(`Loaded ${mapped.length} teacher(s).`, 'Teachers');
            } else {
                toast.error(data.message || 'Failed to load teachers.', 'Teachers');
            }
        } catch {
            toast.error('Network error loading teachers.', 'Teachers');
        } finally {
            setLoadingTeachers(false);
        }
    }, []);

    useEffect(() => {
        fetchDepartments();
        fetchStudents();
        fetchTeachers();
    }, []);

    // ── delete student ──────────────────────────────────────────────────
    const handleDeleteStudent = useCallback(async (id, name) => {
        try {
            const res = await fetch(`${API}/students/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Student "${name}" deleted.`, 'Deleted');
                fetchStudents(true);
            } else {
                toast.error(data.message || 'Failed to delete student.', 'Delete Failed');
            }
        } catch {
            toast.error('Network error. Could not delete student.', 'Delete Failed');
        }
    }, [fetchStudents]);

    // ── delete teacher ──────────────────────────────────────────────────
    const handleDeleteTeacher = useCallback(async (id, name) => {
        try {
            const res = await fetch(`${API}/teachers/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Teacher "${name}" deleted.`, 'Deleted');
                fetchTeachers(true);
            } else {
                toast.error(data.message || 'Failed to delete teacher.', 'Delete Failed');
            }
        } catch {
            toast.error('Network error. Could not delete teacher.', 'Delete Failed');
        }
    }, [fetchTeachers]);

    // ── columns ─────────────────────────────────────────────────────────
    const studentColumns = useMemo(() => [
        { 
            field: 'name', headerName: 'Student Name', flex: 1.5, minWidth: 200,
            renderCell: (p) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
                    <Avatar sx={{ 
                        width: 32, height: 32, fontSize: '0.875rem', 
                        bgcolor: alpha('#2563EB', 0.1), color: '#2563EB', 
                        fontWeight: 700 
                    }}>
                        {p.row.avatar}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, noWrap: true }}>{p.value}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{p.row.roll}</Typography>
                    </Box>
                </Box>
            )
        },
        { field: 'course', headerName: 'Course', flex: 1, minWidth: 120 },
        { field: 'year', headerName: 'Year', flex: 1, minWidth: 120 },
        { 
            field: 'status', headerName: 'Status', width: 120,
            renderCell: (p) => (
                <Chip 
                    label={p.value} size="small" 
                    sx={{ 
                        borderRadius: 1, fontWeight: 700, 
                        bgcolor: p.value === 'Active' ? alpha('#10B981', 0.1) : alpha('#F59E0B', 0.1),
                        color: p.value === 'Active' ? '#059669' : '#D97706',
                        border: 'none', height: 24, fontSize: '0.65rem'
                    }} 
                />
            )
        },
        {
            field: 'actions', headerName: 'Actions', width: 100, sortable: false,
            renderCell: (p) => (
                <IconButton size="small" color="error" onClick={() => handleDeleteStudent(p.id, p.row.name)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )
        }
    ], [handleDeleteStudent]);

    const teacherColumns = useMemo(() => [
        { 
            field: 'name', headerName: 'Teacher Name', flex: 1.5, minWidth: 200,
            renderCell: (p) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
                    <Avatar sx={{ 
                        width: 32, height: 32, fontSize: '0.875rem', 
                        bgcolor: alpha('#10B981', 0.1), color: '#10B981', 
                        fontWeight: 700 
                    }}>
                        {p.row.avatar}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, noWrap: true }}>{p.value}</Typography>
                        {p.row.designation && p.row.designation !== '—' && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', noWrap: true }}>
                                {p.row.designation}
                            </Typography>
                        )}
                    </Box>
                </Box>
            )
        },
        { field: 'email', headerName: 'Email Address', flex: 1.2, minWidth: 180 },
        { 
            field: 'status', headerName: 'Status', width: 120,
            renderCell: (p) => (
                <Chip 
                    label={p.value} size="small" 
                    sx={{ 
                        borderRadius: 1, fontWeight: 700, 
                        bgcolor: p.value === 'Active' ? alpha('#10B981', 0.1) : alpha('#F59E0B', 0.1),
                        color: p.value === 'Active' ? '#059669' : '#D97706',
                        border: 'none', height: 24, fontSize: '0.65rem'
                    }} 
                />
            )
        },
        {
            field: 'actions', headerName: 'Actions', width: 100, sortable: false,
            renderCell: (p) => (
                <IconButton size="small" color="error" onClick={() => handleDeleteTeacher(p.id, p.row.name)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )
        }
    ], [handleDeleteTeacher]);

    // ── add teacher ─────────────────────────────────────────────────────
    const handleAddTeacher = async (formData) => {
        try {
            const matchedDept = departments.find(
                d => d.name === formData.department_name && d.id !== 'all'
            );
            const payload = {
                teacher_name: formData.teacher_name,
                email: formData.email,
                mobile: formData.mobile || null,
                password: formData.password,
                gender: formData.gender || null,
                date_of_birth: formData.date_of_birth || null,
                employee_id: formData.employee_id,
                department_id: matchedDept ? Number(matchedDept.id) : Number(formData.department_id) || null,
                designation: formData.designation || null,
                qualification: formData.qualification || null,
                subjects: formData.subjects || [],
                classes: formData.classes || [],
                joining_date: formData.joining_date || null,
                address: formData.address || null,
                city: formData.city || null,
                state: formData.state || null,
                pincode: formData.pincode || null,
                status: formData.status,
            };

            toast.info('Saving teacher…', 'Please wait');

            const res = await fetch(`${API}/teachers/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (res.ok) {
                toast.success(`"${formData.teacher_name}" registered successfully!`, 'Teacher Added');
                fetchTeachers(true);
            } else if (res.status === 409) {
                toast.warning(result.message || 'Email or Employee ID already exists.', 'Duplicate');
            } else {
                toast.error(result.message || 'Failed to add teacher.', 'Error');
            }
        } catch {
            toast.error('Network error. Please check your connection.', 'Network Error');
        }
    };

    // ── add student ─────────────────────────────────────────────────────
    const handleAddStudent = async (formData) => {
        try {
            const matchedDept = departments.find(
                d => d.name === formData.department && d.id !== 'all'
            );
            const payload = {
                first_name: formData.first_name,
                middle_name: formData.middle_name || null,
                last_name: formData.last_name || null,
                email: formData.email,
                student_mobile: formData.student_mobile || null,
                student_whatsapp: formData.student_whatsapp || null,
                gender: formData.gender || null,
                date_of_birth: formData.date_of_birth || null,
                address: formData.address || null,
                city: formData.city || null,
                state: formData.state || null,
                pincode: formData.pincode || null,
                roll_number: formData.roll_number,
                password: formData.password,
                department_id: matchedDept ? Number(matchedDept.id) : Number(formData.department_id) || null,
                course: formData.course || null,
                className: formData.className || null,
                semester: formData.semester || null,
                admission_year: formData.admission_year || null,
                parent_name: formData.parent_name || null,
                parent_mobile: formData.parent_mobile || null,
                status: true,
            };

            toast.info('Saving student…', 'Please wait');

            const res = await fetch(`${API}/students/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (res.ok) {
                toast.success(
                    `"${formData.first_name} ${(formData.last_name || '').trim()}" registered successfully!`,
                    'Student Added'
                );
                fetchStudents(true);
            } else if (res.status === 409) {
                toast.warning(result.message || 'Email or roll number already exists.', 'Duplicate');
            } else {
                toast.error(result.message || 'Failed to add student.', 'Error');
            }
        } catch {
            toast.error('Network error. Please check your connection.', 'Network Error');
        }
    };

    const handleViewChange = (_, newView) => { if (newView !== null) setView(newView); };

    // ── filtered data ───────────────────────────────────────────────────
    const filteredStudents = studentsData.filter(s => dept.id === 'all' || s.deptId === dept.id);
    const filteredTeachers = teachersData.filter(t => dept.id === 'all' || t.deptId === dept.id);

    const deptStats = [
        { label: 'Total Students',  value: filteredStudents.length,                                    icon: <SchoolIcon />, color: '#2563EB' },
        { label: 'Total Teachers',  value: filteredTeachers.length,                                    icon: <WorkIcon />,   color: '#059669' },
        { label: 'Active Students', value: filteredStudents.filter(s => s.status === 'Active').length, icon: <PeopleIcon />, color: '#EA580C' },
        { label: 'Active Teachers', value: filteredTeachers.filter(t => t.status === 'Active').length, icon: <PersonIcon />, color: '#7C3AED' },
    ];


    // ── render ───────────────────────────────────────────────────────────
    return (
        <Box sx={{ width: '100%' }}>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
                    <Link underline="hover" color="inherit" href="/">Dashboard</Link>
                    <Typography color="text.primary">
                        {dept.id === 'all' ? 'All Departments' : dept.name}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 0 } }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary', letterSpacing: '-0.02em' }}>
                            {dept.id === 'all' ? 'All Departments' : `${dept.name} Team`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>
                            Managing {dept.id === 'all' ? 'all' : 'your'} department's registered members.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => view === 'students' ? setStudentFormOpen(true) : setTeacherFormOpen(true)}
                        sx={{ 
                            borderRadius: 1.5, 
                            textTransform: 'none', 
                            px: 3, py: 1,
                            boxShadow: 'none',
                            bgcolor: '#2563EB',
                            fontWeight: 600,
                            '&:hover': { 
                                bgcolor: '#1D4ED8',
                                boxShadow: '0 4px 12px rgba(37,99,235,0.2)' 
                            } 
                        }}
                    >
                        Add {view === 'students' ? 'Student' : 'Teacher'}
                    </Button>
                </Box>
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Autocomplete
                    options={departments}
                    value={dept}
                    onChange={(_, v) => setDept(v || ALL_DEPT)}
                    getOptionLabel={(o) => o.name}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    sx={{ minWidth: 260 }}
                    renderInput={(params) => <TextField {...params} label="Department" size="small" />}
                />
                <TextField
                    type="date" size="small" label="Date"
                    value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }} sx={{ minWidth: 160 }}
                />
                <ToggleButtonGroup size="small" value={view} exclusive onChange={handleViewChange}>
                    <ToggleButton value="students">Students</ToggleButton>
                    <ToggleButton value="teachers">Teachers</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Members View (Tabular) */}
            <Box sx={{ mb: 4 }}>
                <Paper sx={{ 
                    height: 520, borderRadius: 2, overflow: 'hidden', 
                    border: '1px solid', borderColor: mode === 'dark' ? '#334155' : 'grey.100',
                    bgcolor: mode === 'dark' ? '#1E293B' : '#fff',
                    boxShadow: 'none'
                }}>
                    <DataGrid
                        rows={view === 'students' ? filteredStudents : filteredTeachers}
                        columns={view === 'students' ? studentColumns : teacherColumns}
                        loading={loadingStudents || loadingTeachers}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        pageSizeOptions={[10, 25, 50]}
                        disableSelectionOnClick
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-main': { borderRadius: 2 },
                            '& .MuiDataGrid-columnHeaders': { 
                                bgcolor: mode === 'dark' ? '#0F172A' : '#F8FAFC', 
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid',
                                borderColor: mode === 'dark' ? alpha('#fff', 0.05) : alpha('#000', 0.03),
                                display: 'flex',
                                alignItems: 'center'
                            },
                            '& .MuiDataGrid-row:hover': { 
                                bgcolor: mode === 'dark' ? alpha('#2563EB', 0.05) : alpha('#2563EB', 0.02) 
                            },
                        }}
                    />
                </Paper>
            </Box>

            {/* Stats */}
            <Grid container spacing={3} sx={{ width: '100%', mt: 1 }} alignItems="stretch">
                {deptStats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                        <Paper sx={{
                            p: 2.5, 
                            borderRadius: 2, // "Little round edge"
                            border: '1px solid',
                            borderColor: mode === 'dark' ? '#334155' : 'grey.100',
                            bgcolor: mode === 'dark' ? '#1E293B' : '#fff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                borderColor: stat.color,
                                bgcolor: mode === 'dark' ? alpha(stat.color, 0.05) : alpha(stat.color, 0.01),
                            }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ 
                                    bgcolor: mode === 'dark' ? alpha(stat.color, 0.2) : alpha(stat.color, 0.1), 
                                    color: stat.color, 
                                    p: 1.2, 
                                    borderRadius: 1.5,
                                    display: 'flex',
                                    boxShadow: `0 4px 12px ${alpha(stat.color, 0.2)}`
                                }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: mode === 'dark' ? '#F8FAFC' : 'text.primary', lineHeight: 1 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Forms */}
            <AddTeacherForm open={teacherFormOpen} onClose={() => setTeacherFormOpen(false)} onSubmit={handleAddTeacher} />
            <AddStudentForm open={studentFormOpen} onClose={() => setStudentFormOpen(false)} onAdd={handleAddStudent} />

            {/* Notifications */}
            <ToastSnackbar sx={{ mb: 4 }} />
        </Box>
    );
};

export default DeptDashboard;
