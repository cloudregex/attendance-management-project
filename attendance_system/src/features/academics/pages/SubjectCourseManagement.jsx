import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    FormControlLabel,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
    useTheme,
    IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    Add as AddIcon,
    AutoStories as SubjectIcon,
    DeleteOutline as DeleteIcon,
    LibraryBooks as CourseIcon,
    Route as CurriculumIcon,
    Save as SaveIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';

const currentAcademicYear = () => {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
};

const normalizeList = (data, key) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[key])) return data[key];
    return [];
};

const emptySubject = () => ({
    name: '',
    code: '',
    department_id: '',
    subject_type: 'core',
    prerequisites: '',
    syllabus_url: '',
    syllabus_status: 'pending',
    status: true,
    credit: { lecture: 3, tutorial: 0, practical: 1 },
});

const emptyCourse = () => ({
    name: '',
    code: '',
    department_id: '',
    duration_semesters: 8,
    academic_year: currentAcademicYear(),
    status: true,
});

const emptySemester = () => ({
    course_id: '',
    semester_number: 1,
    name: '',
    academic_year: currentAcademicYear(),
    status: true,
});

const emptyCurriculum = () => ({
    course_id: '',
    semester_id: '',
    subject_id: '',
    academic_year: currentAcademicYear(),
    plan_version: 'v1',
    is_mandatory: true,
    notes: '',
    status: true,
});

const emptyAllocation = () => ({
    subject_id: '',
    course_id: '',
    semester_id: '',
    department_id: '',
    teacher_id: '',
    academic_year: currentAcademicYear(),
    weekly_periods: 4,
    status: true,
});

const getCreditTotal = (credit) =>
    Number(credit?.total ?? 0) ||
    Number(credit?.lecture || 0) + Number(credit?.tutorial || 0) + Number(credit?.practical || 0);

const StatusChip = ({ active }) => (
    <Chip
        size="small"
        label={active ? 'Active' : 'Inactive'}
        color={active ? 'success' : 'default'}
        variant={active ? 'filled' : 'outlined'}
        sx={{ borderRadius: 1, fontWeight: 700 }}
    />
);

const MetricCard = ({ label, value, icon, color }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    return (
        <Paper
            sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: mode === 'dark' ? '#334155' : 'grey.100',
                bgcolor: mode === 'dark' ? '#1E293B' : '#fff',
                boxShadow: 'none',
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1.25, borderRadius: 1.5, color, bgcolor: alpha(color, 0.12), display: 'flex' }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
                        {value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                        {label}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

const SectionPaper = ({ title, subtitle, children }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: mode === 'dark' ? '#334155' : 'grey.100',
                bgcolor: mode === 'dark' ? '#1E293B' : '#fff',
                boxShadow: 'none',
            }}
        >
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {children}
        </Paper>
    );
};

const SubjectCourseManagement = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [overview, setOverview] = useState({
        subjects: [],
        courses: [],
        semesters: [],
        curriculum: [],
        allocations: [],
    });
    const [subjectForm, setSubjectForm] = useState(emptySubject());
    const [courseForm, setCourseForm] = useState(emptyCourse());
    const [semesterForm, setSemesterForm] = useState(emptySemester());
    const [curriculumForm, setCurriculumForm] = useState(emptyCurriculum());
    const [allocationForm, setAllocationForm] = useState(emptyAllocation());
    const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });
    
    // Edit states
    const [editingSubjectId, setEditingSubjectId] = useState(null);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editingSemesterId, setEditingSemesterId] = useState(null);
    const [editingCurriculumId, setEditingCurriculumId] = useState(null);
    const [editingAllocationId, setEditingAllocationId] = useState(null);

    // Confirm dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        content: '',
        endpoint: '',
        successMessage: '',
    });

    const notify = (severity, message) => setToast({ open: true, severity, message });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [overviewRes, departmentsRes, teachersRes] = await Promise.all([
                axiosInstance.get('/academic/overview'),
                axiosInstance.get('/departments'),
                axiosInstance.get('/teachers'),
            ]);
            setOverview(overviewRes.data || {});
            setDepartments(normalizeList(departmentsRes.data, 'departments'));
            setTeachers(normalizeList(teachersRes.data, 'teachers'));
        } catch (error) {
            console.error('Academic module load failed:', error);
            notify('error', error.response?.data?.message || 'Could not load academic structure data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const stats = useMemo(() => {
        const subjects = overview.subjects || [];
        const courses = overview.courses || [];
        const allocations = overview.allocations || [];
        const credits = subjects.reduce((sum, subject) => sum + getCreditTotal(subject.credit), 0);
        return { subjects: subjects.length, courses: courses.length, allocations: allocations.length, credits };
    }, [overview]);

    const submitSubject = async (event) => {
        event.preventDefault();
        try {
            if (editingSubjectId) {
                await axiosInstance.put(`/academic/subjects/${editingSubjectId}`, subjectForm);
                notify('success', 'Subject updated successfully.');
                setEditingSubjectId(null);
            } else {
                await axiosInstance.post('/academic/subjects', subjectForm);
                notify('success', 'Subject created successfully.');
            }
            setSubjectForm(emptySubject());
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Failed to save subject.');
        }
    };

    const submitCourse = async (event) => {
        event.preventDefault();
        try {
            if (editingCourseId) {
                await axiosInstance.put(`/academic/courses/${editingCourseId}`, courseForm);
                notify('success', 'Course updated successfully.');
                setEditingCourseId(null);
            } else {
                await axiosInstance.post('/academic/courses', courseForm);
                notify('success', 'Course created successfully.');
            }
            setCourseForm(emptyCourse());
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Failed to save course.');
        }
    };

    const submitSemester = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                ...semesterForm,
                name: semesterForm.name || `Semester ${semesterForm.semester_number}`,
            };
            if (editingSemesterId) {
                await axiosInstance.put(`/academic/semesters/${editingSemesterId}`, payload);
                notify('success', 'Semester updated successfully.');
                setEditingSemesterId(null);
            } else {
                await axiosInstance.post('/academic/semesters', payload);
                notify('success', 'Semester configured successfully.');
            }
            setSemesterForm(emptySemester());
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Failed to save semester.');
        }
    };

    const submitCurriculum = async (event) => {
        event.preventDefault();
        try {
            if (editingCurriculumId) {
                await axiosInstance.put(`/academic/curriculum/${editingCurriculumId}`, curriculumForm);
                notify('success', 'Curriculum mapping updated.');
                setEditingCurriculumId(null);
            } else {
                await axiosInstance.post('/academic/curriculum', curriculumForm);
                notify('success', 'Curriculum mapping saved.');
            }
            setCurriculumForm(emptyCurriculum());
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Failed to save curriculum mapping.');
        }
    };

    const submitAllocation = async (event) => {
        event.preventDefault();
        try {
            if (editingAllocationId) {
                await axiosInstance.put(`/academic/allocations/${editingAllocationId}`, allocationForm);
                notify('success', 'Faculty subject allocation updated.');
                setEditingAllocationId(null);
            } else {
                await axiosInstance.post('/academic/allocations', allocationForm);
                notify('success', 'Faculty subject allocation saved.');
            }
            setAllocationForm(emptyAllocation());
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Failed to save faculty allocation.');
        }
    };

    const confirmDelete = (endpoint, successMessage, entityName = 'this record') => {
        setConfirmDialog({
            open: true,
            title: `Delete ${entityName}?`,
            content: `Are you sure you want to delete ${entityName}? This action cannot be undone.`,
            endpoint,
            successMessage,
        });
    };

    const executeDelete = async () => {
        const { endpoint, successMessage } = confirmDialog;
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        try {
            await axiosInstance.delete(endpoint);
            notify('success', successMessage);
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Delete failed.');
        }
    };

    // Edit Handlers
    const handleEditSubject = (subject) => {
        setSubjectForm({
            name: subject.name,
            code: subject.code,
            department_id: subject.department_id || '',
            subject_type: subject.subject_type || 'core',
            prerequisites: subject.prerequisites ? subject.prerequisites.join(', ') : '',
            syllabus_url: subject.syllabus_url || '',
            syllabus_status: subject.syllabus_status || 'pending',
            status: subject.status,
            credit: subject.credit || { lecture: 3, tutorial: 0, practical: 1 },
        });
        setEditingSubjectId(subject.id);
        setTab(0);
        window.scrollTo(0, 0);
    };

    const handleEditCourse = (course) => {
        setCourseForm({
            name: course.name,
            code: course.code,
            department_id: course.department_id || '',
            duration_semesters: course.duration_semesters || 8,
            academic_year: course.academic_year || currentAcademicYear(),
            status: course.status,
        });
        setEditingCourseId(course.id);
        setTab(1);
        window.scrollTo(0, 0);
    };

    const handleEditCurriculum = (curriculum) => {
        setCurriculumForm({
            course_id: curriculum.course_id || '',
            semester_id: curriculum.semester_id || '',
            subject_id: curriculum.subject_id || '',
            academic_year: curriculum.academic_year || currentAcademicYear(),
            plan_version: curriculum.plan_version || 'v1',
            is_mandatory: curriculum.is_mandatory,
            notes: curriculum.notes || '',
            status: curriculum.status,
        });
        setEditingCurriculumId(curriculum.id);
        setTab(2);
        window.scrollTo(0, 0);
    };

    const handleEditAllocation = (allocation) => {
        setAllocationForm({
            subject_id: allocation.subject_id || '',
            course_id: allocation.course_id || '',
            semester_id: allocation.semester_id || '',
            department_id: allocation.department_id || '',
            teacher_id: allocation.teacher_id || '',
            academic_year: allocation.academic_year || currentAcademicYear(),
            weekly_periods: allocation.weekly_periods || 4,
            status: allocation.status,
        });
        setEditingAllocationId(allocation.id);
        setTab(2);
        window.scrollTo(0, 0);
    };

    const departmentOptions = departments.length > 0
        ? departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>{dept.code ? `${dept.code} - ${dept.name}` : dept.name}</MenuItem>
        ))
        : <MenuItem value="" disabled>No departments found</MenuItem>;

    const courseOptions = (overview.courses || []).map((course) => (
        <MenuItem key={course.id} value={course.id}>{course.code} - {course.name}</MenuItem>
    ));

    const subjectOptions = (overview.subjects || []).map((subject) => (
        <MenuItem key={subject.id} value={subject.id}>{subject.code} - {subject.name}</MenuItem>
    ));

    const semesterOptions = (overview.semesters || []).map((semester) => (
        <MenuItem key={semester.id} value={semester.id}>
            {semester.course?.code || 'Course'} - Sem {semester.semester_number}
        </MenuItem>
    ));

    const teacherOptions = teachers.map((teacher) => (
        <MenuItem key={teacher.id} value={teacher.id}>
            {teacher.first_name || teacher.teacher_name || teacher.email} {teacher.employee_id ? `(${teacher.employee_id})` : ''}
        </MenuItem>
    ));

    if (loading) {
        return (
            <Box sx={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', minWidth: 0 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>
                        Subject & Course Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>
                        Configure academic structure, curriculum credits, prerequisites, and faculty subject allocation.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={loadData}>
                    Refresh
                </Button>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
                <MetricCard label="Subjects" value={stats.subjects} icon={<SubjectIcon />} color="#2563EB" />
                <MetricCard label="Courses" value={stats.courses} icon={<CourseIcon />} color="#059669" />
                <MetricCard label="Allocations" value={stats.allocations} icon={<CurriculumIcon />} color="#EA580C" />
                <MetricCard label="Credits Planned" value={stats.credits} icon={<SaveIcon />} color="#7C3AED" />
            </Box>

            <Paper
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: mode === 'dark' ? '#334155' : 'grey.100',
                    bgcolor: mode === 'dark' ? '#1E293B' : '#fff',
                    boxShadow: 'none',
                    mb: 3,
                }}
            >
                <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
                    <Tab label="Subjects & Credits" />
                    <Tab label="Courses & Semesters" />
                    <Tab label="Curriculum & Faculty Allocation" />
                </Tabs>
            </Paper>

            {tab === 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' }, gap: 3 }}>
                    <SectionPaper title="Create Subject" subtitle="Maintain subject master, credits, syllabus and prerequisites.">
                        <Box component="form" onSubmit={submitSubject} sx={{ display: 'grid', gap: 2 }}>
                            <TextField required label="Subject Name" value={subjectForm.name} onChange={(e) => setSubjectForm((p) => ({ ...p, name: e.target.value }))} />
                            <TextField required label="Subject Code" value={subjectForm.code} onChange={(e) => setSubjectForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} />
                            <TextField required select label="Department" value={subjectForm.department_id} onChange={(e) => setSubjectForm((p) => ({ ...p, department_id: e.target.value }))}>
                                {departmentOptions}
                            </TextField>
                            <TextField select label="Subject Type" value={subjectForm.subject_type} onChange={(e) => setSubjectForm((p) => ({ ...p, subject_type: e.target.value }))}>
                                <MenuItem value="core">Core</MenuItem>
                                <MenuItem value="elective">Elective</MenuItem>
                                <MenuItem value="lab">Lab</MenuItem>
                            </TextField>
                            <Stack direction="row" spacing={1}>
                                <TextField label="L" type="number" value={subjectForm.credit.lecture} onChange={(e) => setSubjectForm((p) => ({ ...p, credit: { ...p.credit, lecture: e.target.value } }))} />
                                <TextField label="T" type="number" value={subjectForm.credit.tutorial} onChange={(e) => setSubjectForm((p) => ({ ...p, credit: { ...p.credit, tutorial: e.target.value } }))} />
                                <TextField label="P" type="number" value={subjectForm.credit.practical} onChange={(e) => setSubjectForm((p) => ({ ...p, credit: { ...p.credit, practical: e.target.value } }))} />
                            </Stack>
                            <TextField label="Prerequisites" placeholder="Comma separated subject codes" value={subjectForm.prerequisites} onChange={(e) => setSubjectForm((p) => ({ ...p, prerequisites: e.target.value }))} />
                            <TextField label="Syllabus URL" value={subjectForm.syllabus_url} onChange={(e) => setSubjectForm((p) => ({ ...p, syllabus_url: e.target.value }))} />
                            <TextField select label="Syllabus Status" value={subjectForm.syllabus_status} onChange={(e) => setSubjectForm((p) => ({ ...p, syllabus_status: e.target.value }))}>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="uploaded">Uploaded</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                            </TextField>
                            <FormControlLabel control={<Switch checked={subjectForm.status} onChange={(e) => setSubjectForm((p) => ({ ...p, status: e.target.checked }))} />} label="Active Subject" />
                            <Stack direction="row" spacing={1}>
                                <Button type="submit" variant="contained" startIcon={editingSubjectId ? <SaveIcon /> : <AddIcon />} fullWidth>
                                    {editingSubjectId ? 'Update Subject' : 'Create Subject'}
                                </Button>
                                {editingSubjectId && (
                                    <Button variant="outlined" onClick={() => { setEditingSubjectId(null); setSubjectForm(emptySubject()); }}>
                                        Cancel
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    </SectionPaper>

                    <SectionPaper title="Subject Catalog" subtitle="Active, elective, lab and prerequisite-aware subject list.">
                        <Box sx={{ overflowX: 'auto' }}>
                            <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>SR No.</TableCell>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Credits</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(overview.subjects || []).map((subject, index) => (
                                    <TableRow key={subject.id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 700 }}>{subject.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{subject.code}</Typography>
                                        </TableCell>
                                        <TableCell>{subject.department?.name || '-'}</TableCell>
                                        <TableCell><Chip size="small" label={subject.subject_type} sx={{ textTransform: 'capitalize', borderRadius: 1 }} /></TableCell>
                                        <TableCell>{getCreditTotal(subject.credit)}</TableCell>
                                        <TableCell><StatusChip active={subject.status} /></TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="primary" onClick={() => handleEditSubject(subject)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => confirmDelete(`/academic/subjects/${subject.id}`, 'Subject deleted.', 'Subject')}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </Box>
                    </SectionPaper>
                </Box>
            )}

            {tab === 1 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' }, gap: 3 }}>
                    <Stack spacing={3}>
                        <SectionPaper title="Create Course" subtitle="Map courses to departments and academic year.">
                            <Box component="form" onSubmit={submitCourse} sx={{ display: 'grid', gap: 2 }}>
                                <TextField required label="Course Name" value={courseForm.name} onChange={(e) => setCourseForm((p) => ({ ...p, name: e.target.value }))} />
                                <TextField required label="Course Code" value={courseForm.code} onChange={(e) => setCourseForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} />
                                <TextField required select label="Department" value={courseForm.department_id} onChange={(e) => setCourseForm((p) => ({ ...p, department_id: e.target.value }))}>
                                    {departmentOptions}
                                </TextField>
                                <TextField label="Duration Semesters" type="number" value={courseForm.duration_semesters} onChange={(e) => setCourseForm((p) => ({ ...p, duration_semesters: e.target.value }))} />
                                <TextField label="Academic Year" value={courseForm.academic_year} onChange={(e) => setCourseForm((p) => ({ ...p, academic_year: e.target.value }))} />
                                <FormControlLabel control={<Switch checked={courseForm.status} onChange={(e) => setCourseForm((p) => ({ ...p, status: e.target.checked }))} />} label="Active Course" />
                                <Stack direction="row" spacing={1}>
                                    <Button type="submit" variant="contained" startIcon={editingCourseId ? <SaveIcon /> : <AddIcon />} fullWidth>
                                        {editingCourseId ? 'Update Course' : 'Create Course'}
                                    </Button>
                                    {editingCourseId && (
                                        <Button variant="outlined" onClick={() => { setEditingCourseId(null); setCourseForm(emptyCourse()); }}>
                                            Cancel
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        </SectionPaper>

                        <SectionPaper title="Configure Semester" subtitle="Create semester containers for curriculum planning.">
                            <Box component="form" onSubmit={submitSemester} sx={{ display: 'grid', gap: 2 }}>
                                <TextField required select label="Course" value={semesterForm.course_id} onChange={(e) => setSemesterForm((p) => ({ ...p, course_id: e.target.value }))}>
                                    {courseOptions}
                                </TextField>
                                <TextField required label="Semester Number" type="number" value={semesterForm.semester_number} onChange={(e) => setSemesterForm((p) => ({ ...p, semester_number: e.target.value }))} />
                                <TextField label="Semester Name" value={semesterForm.name} onChange={(e) => setSemesterForm((p) => ({ ...p, name: e.target.value }))} />
                                <TextField label="Academic Year" value={semesterForm.academic_year} onChange={(e) => setSemesterForm((p) => ({ ...p, academic_year: e.target.value }))} />
                                <Stack direction="row" spacing={1}>
                                    <Button type="submit" variant="outlined" startIcon={editingSemesterId ? <SaveIcon /> : <AddIcon />} fullWidth>
                                        {editingSemesterId ? 'Update Semester' : 'Add Semester'}
                                    </Button>
                                    {editingSemesterId && (
                                        <Button variant="outlined" onClick={() => { setEditingSemesterId(null); setSemesterForm(emptySemester()); }}>
                                            Cancel
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        </SectionPaper>
                    </Stack>

                    <SectionPaper title="Course Structure" subtitle="Department-wise course structure with semester planning.">
                        <Box sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>SR No.</TableCell>
                                    <TableCell>Course</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Academic Year</TableCell>
                                    <TableCell>Semesters</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(overview.courses || []).map((course, index) => {
                                    const semesterCount = (overview.semesters || []).filter((semester) => semester.course_id === course.id).length;
                                    return (
                                        <TableRow key={course.id} hover>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 700 }}>{course.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{course.code}</Typography>
                                            </TableCell>
                                            <TableCell>{course.department?.name || '-'}</TableCell>
                                            <TableCell>{course.academic_year}</TableCell>
                                            <TableCell>{semesterCount} / {course.duration_semesters}</TableCell>
                                            <TableCell><StatusChip active={course.status} /></TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" color="primary" onClick={() => handleEditCourse(course)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => confirmDelete(`/academic/courses/${course.id}`, 'Course deleted.', 'Course')}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Configured Semesters</Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {(overview.semesters || []).map((semester) => (
                                <Chip key={semester.id} label={`${semester.course?.code || 'Course'} - Sem ${semester.semester_number}`} sx={{ borderRadius: 1 }} />
                            ))}
                        </Stack>
                    </SectionPaper>
                </Box>
            )}

            {tab === 2 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '420px 1fr' }, gap: 3 }}>
                    <Stack spacing={3}>
                        <SectionPaper title="Curriculum Planning" subtitle="Allocate semester-wise subjects as core or elective.">
                            <Box component="form" onSubmit={submitCurriculum} sx={{ display: 'grid', gap: 2 }}>
                                <TextField required select label="Course" value={curriculumForm.course_id} onChange={(e) => setCurriculumForm((p) => ({ ...p, course_id: e.target.value }))}>{courseOptions}</TextField>
                                <TextField required select label="Semester" value={curriculumForm.semester_id} onChange={(e) => setCurriculumForm((p) => ({ ...p, semester_id: e.target.value }))}>{semesterOptions}</TextField>
                                <TextField required select label="Subject" value={curriculumForm.subject_id} onChange={(e) => setCurriculumForm((p) => ({ ...p, subject_id: e.target.value }))}>{subjectOptions}</TextField>
                                <TextField label="Academic Year" value={curriculumForm.academic_year} onChange={(e) => setCurriculumForm((p) => ({ ...p, academic_year: e.target.value }))} />
                                <TextField label="Plan Version" value={curriculumForm.plan_version} onChange={(e) => setCurriculumForm((p) => ({ ...p, plan_version: e.target.value }))} />
                                <FormControlLabel control={<Switch checked={curriculumForm.is_mandatory} onChange={(e) => setCurriculumForm((p) => ({ ...p, is_mandatory: e.target.checked }))} />} label={curriculumForm.is_mandatory ? 'Core Subject' : 'Elective Subject'} />
                                <TextField label="Planning Notes" multiline rows={2} value={curriculumForm.notes} onChange={(e) => setCurriculumForm((p) => ({ ...p, notes: e.target.value }))} />
                                <Stack direction="row" spacing={1}>
                                    <Button type="submit" variant="contained" startIcon={editingCurriculumId ? <SaveIcon /> : <AddIcon />} fullWidth>
                                        {editingCurriculumId ? 'Update Curriculum' : 'Save Curriculum'}
                                    </Button>
                                    {editingCurriculumId && (
                                        <Button variant="outlined" onClick={() => { setEditingCurriculumId(null); setCurriculumForm(emptyCurriculum()); }}>
                                            Cancel
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        </SectionPaper>

                        <SectionPaper title="Faculty Subject Assignment" subtitle="Assign faculty and weekly periods for timetable engine.">
                            <Box component="form" onSubmit={submitAllocation} sx={{ display: 'grid', gap: 2 }}>
                                <TextField required select label="Subject" value={allocationForm.subject_id} onChange={(e) => setAllocationForm((p) => ({ ...p, subject_id: e.target.value }))}>{subjectOptions}</TextField>
                                <TextField required select label="Course" value={allocationForm.course_id} onChange={(e) => setAllocationForm((p) => ({ ...p, course_id: e.target.value }))}>{courseOptions}</TextField>
                                <TextField required select label="Semester" value={allocationForm.semester_id} onChange={(e) => setAllocationForm((p) => ({ ...p, semester_id: e.target.value }))}>{semesterOptions}</TextField>
                                <TextField required select label="Department" value={allocationForm.department_id} onChange={(e) => setAllocationForm((p) => ({ ...p, department_id: e.target.value }))}>{departmentOptions}</TextField>
                                <TextField select label="Faculty" value={allocationForm.teacher_id} onChange={(e) => setAllocationForm((p) => ({ ...p, teacher_id: e.target.value }))}>
                                    <MenuItem value="">Unassigned</MenuItem>
                                    {teacherOptions}
                                </TextField>
                                <TextField label="Weekly Periods" type="number" value={allocationForm.weekly_periods} onChange={(e) => setAllocationForm((p) => ({ ...p, weekly_periods: e.target.value }))} />
                                <TextField label="Academic Year" value={allocationForm.academic_year} onChange={(e) => setAllocationForm((p) => ({ ...p, academic_year: e.target.value }))} />
                                <Stack direction="row" spacing={1}>
                                    <Button type="submit" variant="outlined" startIcon={editingAllocationId ? <SaveIcon /> : <AddIcon />} fullWidth>
                                        {editingAllocationId ? 'Update Faculty' : 'Assign Faculty'}
                                    </Button>
                                    {editingAllocationId && (
                                        <Button variant="outlined" onClick={() => { setEditingAllocationId(null); setAllocationForm(emptyAllocation()); }}>
                                            Cancel
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        </SectionPaper>
                    </Stack>

                    <Stack spacing={3}>
                        <SectionPaper title="Curriculum Map" subtitle="Semester-wise subject allocation for active academic year.">
                            <Box sx={{ overflowX: 'auto' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>SR No.</TableCell>
                                        <TableCell>Course</TableCell>
                                        <TableCell>Semester</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(overview.curriculum || []).map((item, index) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.course?.code || '-'}</TableCell>
                                            <TableCell>Sem {item.semester?.semester_number || '-'}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 700 }}>{item.subject?.name || '-'}</Typography>
                                                <Typography variant="caption" color="text.secondary">{item.academic_year} | {item.plan_version}</Typography>
                                            </TableCell>
                                            <TableCell>{item.is_mandatory ? 'Core' : 'Elective'}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" color="primary" onClick={() => handleEditCurriculum(item)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => confirmDelete(`/academic/curriculum/${item.id}`, 'Curriculum mapping deleted.', 'Curriculum')}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </Box>
                        </SectionPaper>

                        <SectionPaper title="Faculty Allocations" subtitle="Ready for timetable engine subject-period planning.">
                            <Box sx={{ overflowX: 'auto' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>SR No.</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Faculty</TableCell>
                                        <TableCell>Course</TableCell>
                                        <TableCell>Weekly Periods</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(overview.allocations || []).map((allocation, index) => (
                                        <TableRow key={allocation.id} hover>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{allocation.subject?.code || '-'}</TableCell>
                                            <TableCell>{allocation.teacher?.first_name || 'Unassigned'}</TableCell>
                                            <TableCell>{allocation.course?.code || '-'}</TableCell>
                                            <TableCell>{allocation.weekly_periods}</TableCell>
                                            <TableCell><StatusChip active={allocation.status} /></TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" color="primary" onClick={() => handleEditAllocation(allocation)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => confirmDelete(`/academic/allocations/${allocation.id}`, 'Faculty allocation deleted.', 'Allocation')}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </Box>
                        </SectionPaper>
                    </Stack>
                </Box>
            )}

            <ConfirmDialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
                onConfirm={executeDelete}
                title={confirmDialog.title}
                content={confirmDialog.content}
            />

            <Snackbar
                open={toast.open}
                autoHideDuration={3500}
                onClose={() => setToast((p) => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={toast.severity} variant="filled" onClose={() => setToast((p) => ({ ...p, open: false }))}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SubjectCourseManagement;
