import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid, Box, Typography, IconButton,
    Stepper, Step, StepLabel, CircularProgress,
    Card, Avatar, Autocomplete, useTheme, InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    Close as CloseIcon,
    School as SchoolIcon,
    CheckCircle as CheckCircleIcon,
    PhotoCamera as PhotoCameraIcon,
    UploadFile as UploadFileIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const COURSES   = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BBA', 'MBA', 'B.Sc', 'M.Sc'];
const CLASSES   = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const steps     = ['Student Details', 'Face Capture', 'Completed'];

const cardSx = (mode) => ({
    borderRadius: 2, // "Little round edge"
    p: { xs: 2.5, md: 3 },
    borderColor: mode === 'dark' ? '#334155' : alpha('#000', 0.06),
    bgcolor:     mode === 'dark' ? '#1E293B' : '#fff',
    boxShadow:   'none',
    border: '1px solid',
});

const fieldSx = (mode) => ({
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset',
        WebkitTextFillColor: mode === 'dark' ? '#fff !important' : '#000 !important',
        transition: 'background-color 9999s ease-in-out 0s',
    },
});

const emptyForm = () => ({
    // personal
    first_name:       '',
    middle_name:      '',
    last_name:        '',
    gender:           '',
    date_of_birth:    '',
    // contact
    email:            '',
    student_mobile:   '',
    student_whatsapp: '',
    parent_name:      '',
    parent_mobile:    '',
    address:          '',
    city:             '',
    state:            '',
    pincode:          '',
    // login
    password:         '',
    // academic
    roll_number:      '',
    department_id:    '',   // integer FK
    course:           '',
    className:        '',
    semester:         '',
    admission_year:   new Date().getFullYear().toString(),
    // internal (populated after step-1 save)
    student_id:       null,
});

const SectionHeader = ({ color, label }) => (
    <Typography variant="subtitle1" sx={{
        fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center',
        gap: 1.5, fontSize: '1.05rem', color: 'text.primary',
    }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
        {label}
    </Typography>
);

// ─────────────────────────────────────────────────────────────────
const AddStudentForm = ({ open, onClose, onAdd }) => {
    const theme = useTheme();
    const mode  = theme.palette.mode;

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading]       = useState(false);
    const [showPwd, setShowPwd]       = useState(false);
    const [formData, setFormData]     = useState(emptyForm());
    const [faceData, setFaceData]     = useState({ face_front: null, face_left: null, face_right: null, face_embedding: null });
    const [errors, setErrors]         = useState({});
    const [departments, setDepartments] = useState([]);   // loaded from API

    // ── load departments from API ─────────────────────────────────
    useEffect(() => {
        fetch(`${API}/departments`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setDepartments(data.map(d => ({ id: d.id, name: d.name })));
            })
            .catch(() => {});
    }, []);

    // ── reset on close ────────────────────────────────────────────
    useEffect(() => {
        if (!open) {
            setActiveStep(0);
            setLoading(false);
            setFormData(emptyForm());
            setFaceData({ face_front: null, face_left: null, face_right: null, face_embedding: null });
            setErrors({});
            setShowPwd(false);
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e, side) => {
        if (e.target.files?.[0]) setFaceData(prev => ({ ...prev, [side]: e.target.files[0] }));
    };

    // ── validation ────────────────────────────────────────────────
    const validateStep1 = () => {
        const e = {};
        const emailRx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRx = /^[6-9]\d{9}$/;

        if (!formData.first_name.trim())               e.first_name     = 'First name is required';
        else if (formData.first_name.trim().length < 2) e.first_name     = 'At least 2 characters';

        if (!formData.gender)                          e.gender         = 'Please select gender';

        if (!formData.email.trim())                    e.email          = 'Email is required';
        else if (!emailRx.test(formData.email.trim())) e.email          = 'Enter a valid email';

        if (formData.student_mobile && !mobileRx.test(formData.student_mobile))
            e.student_mobile = 'Invalid 10-digit mobile';
        if (formData.student_whatsapp && !mobileRx.test(formData.student_whatsapp))
            e.student_whatsapp = 'Invalid 10-digit number';
        if (formData.parent_mobile && !mobileRx.test(formData.parent_mobile))
            e.parent_mobile = 'Invalid 10-digit mobile';

        if (!formData.password)                        e.password       = 'Password is required';
        else if (formData.password.length < 6)         e.password       = 'Min 6 characters';

        if (!formData.roll_number.trim())              e.roll_number    = 'Roll number is required';
        if (!formData.department_id)                   e.department_id  = 'Please select a department';
        if (!formData.course)                          e.course         = 'Please select a course';

        if (formData.pincode && !/^\d{6}$/.test(formData.pincode))
            e.pincode = '6-digit pincode required';

        if (formData.date_of_birth) {
            const dob = new Date(formData.date_of_birth);
            const age = (Date.now() - dob) / (1000 * 60 * 60 * 24 * 365.25);
            if (dob >= new Date())  e.date_of_birth = 'Must be in the past';
            else if (age < 10)      e.date_of_birth = 'Must be at least 10 years old';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = () => {
        if (!faceData.face_front && !faceData.face_left && !faceData.face_right) {
            alert('Please upload at least one face image.');
            return false;
        }
        return true;
    };

    // ── step navigation ───────────────────────────────────────────
    const handleNext = async () => {
        if (activeStep === 0) {
            if (!validateStep1()) return;
            setLoading(true);
            setTimeout(() => {
                const generatedId = `STU${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
                setFormData(prev => ({ ...prev, student_id: generatedId }));
                setLoading(false);
                setActiveStep(1);
            }, 800);
        } else if (activeStep === 1) {
            if (!validateStep2()) return;
            setLoading(true);
            setTimeout(() => {
                const mockEmbedding = JSON.stringify(
                    Array.from({ length: 128 }, () => Number((Math.random() * 2 - 1).toFixed(4)))
                );
                setFaceData(prev => ({ ...prev, face_embedding: mockEmbedding }));
                setLoading(false);
                setActiveStep(2);
                if (onAdd) onAdd({ ...formData, faceData: { ...faceData, face_embedding: mockEmbedding } });
            }, 1500);
        } else {
            onClose();
        }
    };

    const handleBack = () => { if (activeStep > 0) setActiveStep(p => p - 1); };

    // ─────────────────────────────────────────────────────────────
    const renderStep1 = () => (
        <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* ── Personal Details ── */}
            <Card variant="outlined" sx={cardSx(mode)}>
                <SectionHeader color="primary.main" label="Personal Details" />
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="medium" label="First Name *" name="first_name"
                            value={formData.first_name} onChange={handleChange}
                            error={!!errors.first_name} helperText={errors.first_name || ' '}
                            placeholder="e.g. Priya" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="medium" label="Middle Name" name="middle_name"
                            value={formData.middle_name} onChange={handleChange}
                            placeholder="e.g. Raj" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="medium" label="Last Name" name="last_name"
                            value={formData.last_name} onChange={handleChange}
                            error={!!errors.last_name} helperText={errors.last_name || ' '}
                            placeholder="e.g. Sharma" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={['Male', 'Female', 'Other']}
                            value={formData.gender || null}
                            onChange={(_, v) => handleChange({ target: { name: 'gender', value: v || '' } })}
                            renderInput={(params) => (
                                <TextField {...params} size="medium" label="Gender *"
                                    error={!!errors.gender} helperText={errors.gender || ' '} sx={fieldSx(mode)} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Date of Birth"
                            value={formData.date_of_birth ? dayjs(formData.date_of_birth) : null}
                            onChange={(v) => handleChange({ target: { name: 'date_of_birth', value: v ? v.format('YYYY-MM-DD') : '' } })}
                            slotProps={{ textField: { fullWidth: true, size: 'medium', error: !!errors.date_of_birth, helperText: errors.date_of_birth || ' ', sx: fieldSx(mode) } }}
                        />
                    </Grid>
                </Grid>
            </Card>

            {/* ── Contact & Address ── */}
            <Card variant="outlined" sx={cardSx(mode)}>
                <SectionHeader color="secondary.main" label="Contact & Address" />
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="medium" label="Email Address *" type="email" name="email"
                            value={formData.email} onChange={handleChange}
                            error={!!errors.email} helperText={errors.email || ' '}
                            placeholder="student@example.com" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="medium" label="Mobile Number" name="student_mobile"
                            value={formData.student_mobile} onChange={handleChange}
                            error={!!errors.student_mobile} helperText={errors.student_mobile || '10-digit'}
                            placeholder="9876543210" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="medium" label="WhatsApp Number" name="student_whatsapp"
                            value={formData.student_whatsapp} onChange={handleChange}
                            error={!!errors.student_whatsapp} helperText={errors.student_whatsapp || '10-digit'}
                            placeholder="9876543210" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="medium" label="Password *" name="password"
                            type={showPwd ? 'text' : 'password'}
                            value={formData.password} onChange={handleChange}
                            error={!!errors.password} helperText={errors.password || 'Min 6 characters'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setShowPwd(p => !p)}>
                                            {showPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="medium" label="Parent / Guardian Name" name="parent_name"
                            value={formData.parent_name} onChange={handleChange}
                            placeholder="Full name" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="medium" label="Parent Mobile" name="parent_mobile"
                            value={formData.parent_mobile} onChange={handleChange}
                            error={!!errors.parent_mobile} helperText={errors.parent_mobile || '10-digit'}
                            placeholder="9876543210" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth size="medium" label="Address" name="address"
                            value={formData.address} onChange={handleChange}
                            placeholder="Street, Area" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="medium" label="City" name="city"
                            value={formData.city} onChange={handleChange}
                            placeholder="e.g. Pune" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="medium" label="State" name="state"
                            value={formData.state} onChange={handleChange}
                            placeholder="e.g. Maharashtra" sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="medium" label="Pincode" name="pincode"
                            value={formData.pincode} onChange={handleChange}
                            error={!!errors.pincode} helperText={errors.pincode || ' '}
                            placeholder="411001" sx={fieldSx(mode)} />
                    </Grid>
                </Grid>
            </Card>

            {/* ── Academic Details (Refined 2-column layout) ── */}
            <Card variant="outlined" sx={cardSx(mode)}>
                <SectionHeader color="success.main" label="Academic Details" />
                <Grid container spacing={3}>
                    {/* Primary Academic IDs */}
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="medium" label="Roll Number *" name="roll_number"
                            value={formData.roll_number} onChange={handleChange}
                            error={!!errors.roll_number} helperText={errors.roll_number || ' '}
                            InputLabelProps={{ shrink: true }} sx={fieldSx(mode)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="medium" label="Admission Year" name="admission_year"
                            value={formData.admission_year} onChange={handleChange}
                            placeholder={new Date().getFullYear().toString()} 
                            InputLabelProps={{ shrink: true }} sx={fieldSx(mode)} />
                    </Grid>

                    {/* Department & Course */}
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={departments}
                            getOptionLabel={(o) => o.name}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            value={departments.find(d => d.id === formData.department_id) || null}
                            onChange={(_, v) => handleChange({ target: { name: 'department_id', value: v ? v.id : '' } })}
                            noOptionsText={departments.length === 0 ? 'No departments found' : 'No match'}
                            renderInput={(params) => (
                                <TextField {...params} size="medium" label="Department *"
                                    error={!!errors.department_id} helperText={errors.department_id || ' '}
                                    InputLabelProps={{ shrink: true }} sx={fieldSx(mode)} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={COURSES}
                            value={formData.course || null}
                            onChange={(_, v) => handleChange({ target: { name: 'course', value: v || '' } })}
                            renderInput={(params) => (
                                <TextField {...params} size="medium" label="Course *"
                                    error={!!errors.course} helperText={errors.course || ' '} 
                                    InputLabelProps={{ shrink: true }} sx={fieldSx(mode)} />
                            )}
                        />
                    </Grid>

                    {/* Class & Semester */}
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={CLASSES}
                            value={formData.className || null}
                            onChange={(_, v) => handleChange({ target: { name: 'className', value: v || '' } })}
                            renderInput={(params) => (
                                <TextField {...params} size="medium" label="Class / Year" 
                                    InputLabelProps={{ shrink: true }} sx={fieldSx(mode)} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={SEMESTERS}
                            value={formData.semester || null}
                            onChange={(_, v) => handleChange({ target: { name: 'semester', value: v || '' } })}
                            renderInput={(params) => (
                                <TextField {...params} size="medium" label="Semester" 
                                    InputLabelProps={{ shrink: true }} sx={fieldSx(mode)} />
                            )}
                        />
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );

    // ── Face Capture step ─────────────────────────────────────────
    const renderStep2 = () => (
        <Box sx={{ mt: 1 }}>
            <Card variant="outlined" sx={cardSx(mode)}>
                <SectionHeader color="primary.main" label="Face Capture" />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Upload at least one face photo. These are used to generate a facial embedding for attendance recognition.
                </Typography>
                <Grid container spacing={3}>
                    {[
                        { key: 'face_front', label: 'Front View',  hint: 'Look straight at the camera' },
                        { key: 'face_left',  label: 'Left View',   hint: 'Turn slightly to the left' },
                        { key: 'face_right', label: 'Right View',  hint: 'Turn slightly to the right' },
                    ].map(({ key, label, hint }) => (
                        <Grid item xs={12} sm={4} key={key}>
                            <Box
                                component="label"
                                sx={{
                                    border: '2px dashed',
                                    borderColor: faceData[key] ? 'success.main' : mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                                    borderRadius: 2, p: 3,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5,
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    bgcolor: faceData[key] ? alpha('#2e7d32', 0.06) : 'transparent',
                                    '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#1976d2', 0.05) },
                                }}
                            >
                                <input hidden accept="image/*" type="file" onChange={(e) => handleFileChange(e, key)} />
                                {faceData[key] ? (
                                    <>
                                        <Avatar src={URL.createObjectURL(faceData[key])} sx={{ width: 80, height: 80, border: '3px solid', borderColor: 'success.main' }} />
                                        <Typography variant="caption" color="success.main" fontWeight={600} textAlign="center">
                                            ✓ {faceData[key].name}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <PhotoCameraIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                                        <Typography variant="body2" fontWeight={600}>{label}</Typography>
                                        <Typography variant="caption" color="text.secondary" textAlign="center">{hint}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
                                            <UploadFileIcon sx={{ fontSize: 16 }} />
                                            <Typography variant="caption" fontWeight={600} color="primary.main">Click to upload</Typography>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                {formData.student_id && (
                    <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.50', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircleIcon color="success" />
                        <Box>
                            <Typography variant="body2" fontWeight={600}>Student saved — ID: {formData.student_id}</Typography>
                            <Typography variant="caption" color="text.secondary">Attach face images to enable attendance recognition.</Typography>
                        </Box>
                    </Box>
                )}
            </Card>
        </Box>
    );

    // ── Completed step ────────────────────────────────────────────
    const renderStep3 = () => (
        <Box sx={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', py: 6, gap: 4, textAlign: 'center' 
        }}>
            <Box sx={{ 
                width: 100, height: 100, borderRadius: '50%', 
                bgcolor: alpha('#10B981', 0.1), display: 'flex', 
                alignItems: 'center', justifyContent: 'center',
                animation: 'scaleIn 0.5s ease-out'
            }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: '#10B981' }} />
            </Box>
            
            <Box>
                <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: mode === 'dark' ? '#F8FAFC' : '#1E293B' }}>
                    Registration Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
                    The student has been successfully enrolled and face data has been securely processed.
                </Typography>

                <Paper variant="outlined" sx={{ 
                    p: 3, borderRadius: 2, bgcolor: mode === 'dark' ? alpha('#fff', 0.02) : alpha('#000', 0.01),
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, minWidth: 350,
                    borderColor: mode === 'dark' ? '#334155' : 'divider'
                }}>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>Student Name</Typography>
                        <Typography variant="body2" fontWeight={700}>{formData.first_name} {formData.last_name}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>Roll Number</Typography>
                        <Typography variant="body2" fontWeight={700}>{formData.roll_number}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>Database ID</Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: 'primary.main' }}>#{formData.student_id || 'Generating...'}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>Biometrics</Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#10B981' }}>✓ Active</Typography>
                    </Box>
                </Paper>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                You can now see this student in the department dashboard table.
            </Typography>
        </Box>
    );

    const renderContent = () => {
        if (loading) return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 350, flexDirection: 'column', gap: 3 }}>
                <CircularProgress size={48} thickness={4} color={activeStep === 0 ? 'success' : 'primary'} />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600}>{activeStep === 0 ? 'Saving Student…' : 'Processing Face Data…'}</Typography>
                    <Typography variant="body2" color="text.secondary">{activeStep === 1 ? 'Generating embeddings and saving to secure storage…' : 'Please wait'}</Typography>
                </Box>
            </Box>
        );
        switch (activeStep) {
            case 0: return renderStep1();
            case 1: return renderStep2();
            case 2: return renderStep3();
            default: return null;
        }
    };

    return (
        <Dialog open={open} onClose={activeStep === 2 ? onClose : undefined} fullWidth maxWidth="lg"
            PaperProps={{ sx: { borderRadius: 2, backgroundImage: 'none', bgcolor: mode === 'dark' ? '#0F172A' : 'background.paper', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', minHeight: 600 } }}>

            <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: mode === 'dark' ? '#334155' : 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#2e7d32', 0.1), color: '#2e7d32', display: 'flex' }}>
                        <SchoolIcon />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>Student Registration</Typography>
                </Box>
                {activeStep !== 2 && (
                    <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}><CloseIcon /></IconButton>
                )}
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2.5, md: 4 }, bgcolor: mode === 'dark' ? '#0F172A' : alpha('#f5f5f5', 0.4) }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, mt: 1 }}>
                    {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                </Stepper>
                {renderContent()}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, gap: 1, justifyContent: 'space-between', borderTop: '1px solid', borderColor: mode === 'dark' ? '#334155' : 'divider' }}>
                {/* Left */}
                {activeStep === 0 && <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>Cancel</Button>}
                {activeStep === 1 && !loading && <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="outlined" sx={{ borderRadius: 2, px: 3, fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>Back</Button>}
                {activeStep === 2 && <Box />}

                {/* Right */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {activeStep === 0 && (
                        <Button onClick={handleNext} disabled={loading} variant="contained" color="success"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}>
                            {loading ? 'Saving…' : 'Save & Continue'}
                        </Button>
                    )}
                    {activeStep === 1 && !loading && (
                        <Button onClick={handleNext} variant="contained" color="primary"
                            startIcon={<SaveIcon />} sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}>
                            Save Face Data
                        </Button>
                    )}
                    {activeStep === 2 && (
                        <Button onClick={onClose} variant="contained" color="success" sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}>
                            Finish
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default AddStudentForm;
