import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
    AutoFixHigh as GenerateIcon,
    CalendarMonth as CalendarIcon,
    CheckCircle as PublishIcon,
    ErrorOutline as ClashIcon,
    MeetingRoom as RoomIcon,
    Save as SaveIcon,
    PictureAsPdf as PdfIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import TimetablePDFDocument from '../components/TimetablePDFDocument';
import axiosInstance from '../../../utils/axiosInstance';

const currentAcademicYear = () => {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const emptyClassroom = () => ({
    name: '',
    code: '',
    room_type: 'lecture',
    capacity: 60,
    department_id: '',
    status: true,
});

const MetricCard = ({ label, value, icon, color }) => {
    return (
        <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ color, display: 'flex' }}>{icon}</Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>{value}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>{label}</Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

const TimetableManagement = () => {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exportingPDF, setExportingPDF] = useState(false);
    const pdfRef = useRef(null);
    const [academicYear, setAcademicYear] = useState(currentAcademicYear());
    const [replaceDraft, setReplaceDraft] = useState(true);
    const [overview, setOverview] = useState({
        entries: [],
        classrooms: [],
        slots: [],
        allocations: [],
        conflicts: [],
    });
    const [departments, setDepartments] = useState([]);
    const [classroomForm, setClassroomForm] = useState(emptyClassroom());
    const [slotForm, setSlotForm] = useState({
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '09:55',
        slot_type: 'lecture',
        sequence: 1,
    });
    const [editingSlotId, setEditingSlotId] = useState(null);
    const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

    const notify = (severity, message) => setToast({ open: true, severity, message });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [timetableRes, departmentsRes] = await Promise.all([
                axiosInstance.get('/timetable/overview'),
                axiosInstance.get('/departments'),
            ]);
            setOverview(timetableRes.data || {});
            setDepartments(Array.isArray(departmentsRes.data) ? departmentsRes.data : []);
        } catch (error) {
            notify('error', error.response?.data?.message || 'Could not load timetable data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const stats = useMemo(() => {
        const entries = overview.entries || [];
        return {
            draft: entries.filter((entry) => entry.timetable_status === 'draft').length,
            published: entries.filter((entry) => entry.timetable_status === 'published').length,
            rooms: (overview.classrooms || []).length,
            conflicts: (overview.conflicts || []).length,
        };
    }, [overview]);

    const lectureSlots = useMemo(
        () => (overview.slots || []).filter((slot) => slot.slot_type === 'lecture'),
        [overview.slots]
    );

    const generate = async () => {
        setSaving(true);
        try {
            const response = await axiosInstance.post('/timetable/generate', {
                academic_year: academicYear,
                replaceDraft,
            });
            notify('success', `Generated ${response.data.createdCount} timetable periods.`);
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Timetable generation failed.');
        } finally {
            setSaving(false);
        }
    };

    const publish = async () => {
        setSaving(true);
        try {
            const response = await axiosInstance.post('/timetable/publish', { academic_year: academicYear });
            notify('success', `Published ${response.data.publishedCount} draft periods.`);
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Publish failed.');
        } finally {
            setSaving(false);
        }
    };

    const generatePDF = async () => {
        if (!pdfRef.current) return;
        setExportingPDF(true);
        try {
            const canvas = await html2canvas(pdfRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 1200, // force wider layout rendering if needed
            });
            const imgData = canvas.toDataURL('image/png');
            
            // Landscape A4 (297x210 mm)
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            // Center if height is smaller than page
            const yOffset = pdfHeight < pdf.internal.pageSize.getHeight() ? (pdf.internal.pageSize.getHeight() - pdfHeight) / 2 : 0;
            
            pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
            pdf.save(`Master_Time_Table_${academicYear.replace('-', '_')}.pdf`);
            notify('success', 'PDF exported successfully.');
        } catch (error) {
            console.error('PDF export error:', error);
            notify('error', 'Failed to generate PDF.');
        } finally {
            setExportingPDF(false);
        }
    };

    const createClassroom = async (event) => {
        event.preventDefault();
        try {
            await axiosInstance.post('/timetable/classrooms', {
                ...classroomForm,
                department_id: classroomForm.department_id || null,
            });
            setClassroomForm(emptyClassroom());
            notify('success', 'Classroom added.');
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Could not create classroom.');
        }
    };

    const updateEntry = async (id, field, value) => {
        try {
            await axiosInstance.put(`/timetable/entries/${id}`, { [field]: value || null });
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Could not update timetable entry.');
        }
    };

    const deleteEntry = async (id) => {
        try {
            await axiosInstance.delete(`/timetable/entries/${id}`);
            notify('success', 'Timetable period removed.');
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Could not delete timetable entry.');
        }
    };

    const saveSlot = async (event) => {
        event.preventDefault();
        try {
            if (editingSlotId) {
                await axiosInstance.put(`/timetable/slots/${editingSlotId}`, slotForm);
                notify('success', 'Lecture slot updated.');
            } else {
                await axiosInstance.post('/timetable/slots', slotForm);
                notify('success', 'Lecture slot added.');
            }
            setSlotForm({ day_of_week: 'Monday', start_time: '09:00', end_time: '09:55', slot_type: 'lecture', sequence: 1 });
            setEditingSlotId(null);
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Could not save lecture slot.');
        }
    };

    const editSlot = (slot) => {
        setSlotForm({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time.slice(0, 5),
            end_time: slot.end_time.slice(0, 5),
            slot_type: slot.slot_type,
            sequence: slot.sequence,
        });
        setEditingSlotId(slot.id);
    };

    const deleteSlot = async (id) => {
        try {
            await axiosInstance.delete(`/timetable/slots/${id}`);
            notify('success', 'Lecture slot removed.');
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Could not delete lecture slot.');
        }
    };

    const entriesByDay = useMemo(() => {
        const grouped = {};
        DAYS.forEach((day) => { grouped[day] = []; });
        (overview.entries || []).forEach((entry) => {
            const day = entry.slot?.day_of_week || 'Monday';
            grouped[day] = [...(grouped[day] || []), entry];
        });
        return grouped;
    }, [overview.entries]);

    if (loading) {
        return (
            <Box sx={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>Timetable Management</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Generate, validate, publish, and maintain weekly academic schedules from subject allocations.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={loadData}>Refresh</Button>
                    <Button variant="contained" color="secondary" startIcon={exportingPDF ? <CircularProgress size={20} color="inherit" /> : <PdfIcon />} disabled={exportingPDF || loading || !(overview.entries || []).length} onClick={generatePDF}>
                        Export PDF
                    </Button>
                    <Button variant="contained" startIcon={<GenerateIcon />} disabled={saving} onClick={generate}>
                        Generate
                    </Button>
                    <Button variant="contained" color="success" startIcon={<PublishIcon />} disabled={saving || stats.conflicts > 0} onClick={publish}>
                        Publish
                    </Button>
                </Stack>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
                <MetricCard label="Draft Periods" value={stats.draft} icon={<CalendarIcon />} color="#2563EB" />
                <MetricCard label="Published" value={stats.published} icon={<PublishIcon />} color="#059669" />
                <MetricCard label="Classrooms" value={stats.rooms} icon={<RoomIcon />} color="#7C3AED" />
                <MetricCard label="Clashes" value={stats.conflicts} icon={<ClashIcon />} color="#DC2626" />
            </Box>

            <Paper sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 3 }}>
                <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
                    <Tab label="Smart Generator" />
                    <Tab label="Weekly View" />
                    <Tab label="Classrooms & Workflow" />
                    <Tab label="Manage Timings" />
                </Tabs>
            </Paper>

            {tab === 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '420px 1fr' }, gap: 3 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Generator Configuration</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Uses subject allocations from Academics, checks faculty availability, prefers departmental rooms, and avoids teacher, classroom, and course clashes.
                        </Typography>
                        <Stack spacing={2}>
                            <TextField label="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                            <FormControlLabel
                                control={<Switch checked={replaceDraft} onChange={(e) => setReplaceDraft(e.target.checked)} />}
                                label="Replace existing draft timetable before generating"
                            />
                            <Button variant="contained" startIcon={<GenerateIcon />} disabled={saving} onClick={generate}>
                                Smart Generate Timetable
                            </Button>
                            <Button variant="outlined" color="success" startIcon={<PublishIcon />} disabled={saving || stats.conflicts > 0} onClick={publish}>
                                Publish Timetable
                            </Button>
                        </Stack>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Clash Detection</Typography>
                        {(overview.conflicts || []).length === 0 ? (
                            <Alert severity="success">No teacher, room, or course-semester clashes detected.</Alert>
                        ) : (
                            <Stack spacing={1.5}>
                                {(overview.conflicts || []).map((conflict, index) => (
                                    <Alert key={`${conflict.type}-${index}`} severity="warning">
                                        {conflict.message}: entries {conflict.entryIds.join(', ')}
                                    </Alert>
                                ))}
                            </Stack>
                        )}
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Source Allocations</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Faculty</TableCell>
                                    <TableCell>Course</TableCell>
                                    <TableCell>Weekly Periods</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(overview.allocations || []).map((allocation) => (
                                    <TableRow key={allocation.id}>
                                        <TableCell>{allocation.subject?.code}</TableCell>
                                        <TableCell>{allocation.teacher?.first_name || 'Unassigned'}</TableCell>
                                        <TableCell>{allocation.course?.code}</TableCell>
                                        <TableCell>{allocation.weekly_periods}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            )}

            {tab === 1 && (
                <Stack spacing={2}>
                    {DAYS.map((day) => (
                        <Paper key={day} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>{day}</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Course / Sem</TableCell>
                                        <TableCell>Faculty</TableCell>
                                        <TableCell>Room</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(entriesByDay[day] || []).map((entry) => (
                                        <TableRow key={entry.id} hover>
                                            <TableCell>{entry.slot?.start_time?.slice(0, 5)} - {entry.slot?.end_time?.slice(0, 5)}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 700 }}>{entry.subject?.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{entry.subject?.code}</Typography>
                                            </TableCell>
                                            <TableCell>{entry.course?.code} / Sem {entry.semester?.semester_number}</TableCell>
                                            <TableCell>{entry.teacher?.first_name || 'Unassigned'}</TableCell>
                                            <TableCell sx={{ minWidth: 180 }}>
                                                <TextField
                                                    select
                                                    size="small"
                                                    fullWidth
                                                    value={entry.classroom_id || ''}
                                                    onChange={(e) => updateEntry(entry.id, 'classroom_id', e.target.value)}
                                                >
                                                    <MenuItem value="">Unassigned</MenuItem>
                                                    {(overview.classrooms || []).map((room) => (
                                                        <MenuItem key={room.id} value={room.id}>{room.code}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={entry.timetable_status}
                                                    color={entry.timetable_status === 'published' ? 'success' : 'warning'}
                                                    sx={{ borderRadius: 1, textTransform: 'capitalize', fontWeight: 700 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button size="small" color="error" onClick={() => deleteEntry(entry.id)}>Remove</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(entriesByDay[day] || []).length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>No periods scheduled.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                    ))}
                </Stack>
            )}

            {tab === 2 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' }, gap: 3 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Create Classroom</Typography>
                        <Box component="form" onSubmit={createClassroom} sx={{ display: 'grid', gap: 2 }}>
                            <TextField required label="Room Name" value={classroomForm.name} onChange={(e) => setClassroomForm((p) => ({ ...p, name: e.target.value }))} />
                            <TextField required label="Room Code" value={classroomForm.code} onChange={(e) => setClassroomForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} />
                            <TextField select label="Room Type" value={classroomForm.room_type} onChange={(e) => setClassroomForm((p) => ({ ...p, room_type: e.target.value }))}>
                                <MenuItem value="lecture">Lecture</MenuItem>
                                <MenuItem value="lab">Lab</MenuItem>
                                <MenuItem value="seminar">Seminar</MenuItem>
                            </TextField>
                            <TextField label="Capacity" type="number" value={classroomForm.capacity} onChange={(e) => setClassroomForm((p) => ({ ...p, capacity: e.target.value }))} />
                            <TextField select label="Department" value={classroomForm.department_id} onChange={(e) => setClassroomForm((p) => ({ ...p, department_id: e.target.value }))}>
                                <MenuItem value="">Shared</MenuItem>
                                {departments.map((department) => (
                                    <MenuItem key={department.id} value={department.id}>{department.code} - {department.name}</MenuItem>
                                ))}
                            </TextField>
                            <Button type="submit" variant="contained" startIcon={<SaveIcon />}>Save Classroom</Button>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Workflow Coverage</Typography>
                        <Stack spacing={1.25}>
                            {[
                                'Admin creates subjects & courses in Academics',
                                'Faculty assigned to subjects through subject allocation',
                                'Smart timetable generator creates weekly draft periods',
                                'Clash detection validates faculty, room, and course slots',
                                'Published timetable becomes source for dashboards and attendance',
                                'Attendance and reports can link to course, subject, faculty, room, and slot',
                            ].map((item, index) => (
                                <Alert key={item} severity={index < 4 ? 'success' : 'info'}>{index + 1}. {item}</Alert>
                            ))}
                        </Stack>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Lecture Slots</Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {lectureSlots.map((slot) => (
                                <Chip key={slot.id} label={`${slot.day_of_week} ${slot.start_time.slice(0, 5)}`} sx={{ borderRadius: 1 }} />
                            ))}
                        </Stack>
                    </Paper>
                </Box>
            )}

            {tab === 3 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' }, gap: 3 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                            {editingSlotId ? 'Edit Timing' : 'Create Timing'}
                        </Typography>
                        <Box component="form" onSubmit={saveSlot} sx={{ display: 'grid', gap: 2 }}>
                            <TextField select required label="Day of Week" value={slotForm.day_of_week} onChange={(e) => setSlotForm((p) => ({ ...p, day_of_week: e.target.value }))}>
                                {DAYS.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </TextField>
                            <TextField required type="time" label="Start Time" InputLabelProps={{ shrink: true }} value={slotForm.start_time} onChange={(e) => setSlotForm((p) => ({ ...p, start_time: e.target.value }))} />
                            <TextField required type="time" label="End Time" InputLabelProps={{ shrink: true }} value={slotForm.end_time} onChange={(e) => setSlotForm((p) => ({ ...p, end_time: e.target.value }))} />
                            <TextField select required label="Slot Type" value={slotForm.slot_type} onChange={(e) => setSlotForm((p) => ({ ...p, slot_type: e.target.value }))}>
                                <MenuItem value="lecture">Lecture</MenuItem>
                                <MenuItem value="lab">Lab</MenuItem>
                                <MenuItem value="break">Break</MenuItem>
                                <MenuItem value="lunch">Lunch</MenuItem>
                            </TextField>
                            <TextField required type="number" label="Sequence" value={slotForm.sequence} onChange={(e) => setSlotForm((p) => ({ ...p, sequence: e.target.value }))} />
                            
                            <Stack direction="row" spacing={1}>
                                <Button type="submit" variant="contained" startIcon={<SaveIcon />} fullWidth>
                                    {editingSlotId ? 'Update' : 'Save'}
                                </Button>
                                {editingSlotId && (
                                    <Button variant="outlined" onClick={() => { setEditingSlotId(null); setSlotForm({ day_of_week: 'Monday', start_time: '09:00', end_time: '09:55', slot_type: 'lecture', sequence: 1 }); }}>Cancel</Button>
                                )}
                            </Stack>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 0, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell>Day</TableCell>
                                    <TableCell>Timing</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Sequence</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(overview.slots || []).map((slot) => (
                                    <TableRow key={slot.id} hover>
                                        <TableCell>{slot.day_of_week}</TableCell>
                                        <TableCell>{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</TableCell>
                                        <TableCell>
                                            <Chip label={slot.slot_type} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                                        </TableCell>
                                        <TableCell>{slot.sequence}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="primary" onClick={() => editSlot(slot)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => deleteSlot(slot.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(overview.slots || []).length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No timings found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            )}

            <Box sx={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <TimetablePDFDocument ref={pdfRef} overview={overview} academicYear={academicYear} />
            </Box>

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

export default TimetableManagement;
