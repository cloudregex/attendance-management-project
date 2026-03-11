import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    IconButton,
    MenuItem,
    alpha,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Card,
    Avatar,
    Autocomplete,
    useTheme,
} from '@mui/material';
import {
    Close as CloseIcon,
    School as SchoolIcon,
    CheckCircle as CheckCircleIcon,
    PhotoCamera as PhotoCameraIcon,
    UploadFile as UploadFileIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const departments = [
    'Computer Science', 'Electronics', 'Mechanical',
    'Civil', 'Applied Sciences', 'Management'
];
const courses = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BBA', 'MBA'];
const classes = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const steps = ['Student Details', 'Face Capture', 'Completed'];

const getFieldSx = (mode) => ({
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset',
        WebkitTextFillColor: mode === 'dark' ? '#fff !important' : '#000 !important',
        transition: 'background-color 9999s ease-in-out 0s',
    },
});

const AddStudentForm = ({ open, onClose, onAdd }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        student_id: null,
        roll_number: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        student_mobile: '',
        student_whatsapp: '',
        parent_name: '',
        parent_mobile: '',
        department: '',
        course: '',
        className: '', // representing 'class'
        semester: '',
        admission_year: new Date().getFullYear().toString(),
        gender: '',
        date_of_birth: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [faceData, setFaceData] = useState({
        face_front: null,
        face_left: null,
        face_right: null,
        face_embedding: null
    });

    const [errors, setErrors] = useState({});

    // Reset when closed
    React.useEffect(() => {
        if (!open) {
            setActiveStep(0);
            setLoading(false);
            setFormData({
                student_id: null, roll_number: '', first_name: '', middle_name: '', last_name: '',
                email: '', student_mobile: '', student_whatsapp: '', parent_name: '', parent_mobile: '',
                department: '', course: '', className: '', semester: '',
                admission_year: new Date().getFullYear().toString(), gender: '', date_of_birth: '',
                address: '', city: '', state: '', pincode: ''
            });
            setFaceData({ face_front: null, face_left: null, face_right: null, face_embedding: null });
            setErrors({});
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e, side) => {
        if (e.target.files && e.target.files[0]) {
            setFaceData(prev => ({ ...prev, [side]: e.target.files[0] }));
        }
    };

    const validateStep1 = () => {
        const e = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;

        // Personal
        if (!formData.first_name.trim()) {
            e.first_name = 'First name is required';
        } else if (formData.first_name.trim().length < 2) {
            e.first_name = 'First name must be at least 2 characters';
        }

        if (formData.last_name.trim() && formData.last_name.trim().length < 2) {
            e.last_name = 'Last name must be at least 2 characters';
        }

        if (formData.date_of_birth) {
            const dob = new Date(formData.date_of_birth);
            const today = new Date();
            const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
            if (dob >= today) e.date_of_birth = 'Date of birth must be in the past';
            else if (age < 10) e.date_of_birth = 'Student must be at least 10 years old';
            else if (age > 60) e.date_of_birth = 'Please verify the date of birth';
        }

        if (!formData.gender) e.gender = 'Please select a gender';

        // Contact
        if (!formData.email.trim()) {
            e.email = 'Email address is required';
        } else if (!emailRegex.test(formData.email.trim())) {
            e.email = 'Enter a valid email address (e.g. name@example.com)';
        }

        if (formData.student_mobile && !mobileRegex.test(formData.student_mobile)) {
            e.student_mobile = 'Enter a valid 10-digit Indian mobile number';
        }

        if (formData.student_whatsapp && !mobileRegex.test(formData.student_whatsapp)) {
            e.student_whatsapp = 'Enter a valid 10-digit WhatsApp number';
        }

        if (formData.parent_mobile && !mobileRegex.test(formData.parent_mobile)) {
            e.parent_mobile = 'Enter a valid 10-digit mobile number';
        }

        // Academic
        if (!formData.roll_number.trim()) {
            e.roll_number = 'Roll number is required';
        } else if (formData.roll_number.trim().length < 3) {
            e.roll_number = 'Roll number seems too short';
        }

        if (!formData.department) e.department = 'Please select a department';
        if (!formData.course) e.course = 'Please select a course';

        if (formData.admission_year) {
            const year = parseInt(formData.admission_year, 10);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year < 2000 || year > currentYear + 1) {
                e.admission_year = `Enter a valid year between 2000 and ${currentYear + 1}`;
            }
        }

        // Address
        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
            e.pincode = 'Pincode must be exactly 6 digits';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = () => {
        if (!faceData.face_front && !faceData.face_left && !faceData.face_right) {
            alert('At least one face image is required to generate the embedding.');
            return false;
        }
        return true;
    };

    const handleNext = async () => {
        if (activeStep === 0) {
            if (validateStep1()) {
                setLoading(true);
                // Simulate saving to `students` table
                setTimeout(() => {
                    const generatedId = `STU${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
                    setFormData(prev => ({ ...prev, student_id: generatedId }));
                    setLoading(false);
                    setActiveStep(1);
                }, 1000);
            }
        } else if (activeStep === 1) {
            if (validateStep2()) {
                setLoading(true);
                // Simulate ML embedding generation and API file saving
                setTimeout(() => {
                    const mockEmbedding = JSON.stringify(Array.from({ length: 128 }, () => Number((Math.random() * 2 - 1).toFixed(4))));
                    setFaceData(prev => ({ ...prev, face_embedding: mockEmbedding }));
                    setLoading(false);
                    setActiveStep(2);

                    if (onAdd) {
                        // Pass mock final data structure backward for frontend integration
                        // Including path metadata references that an API would return
                        const finalPayload = {
                            ...formData,
                            name: `${formData.first_name} ${formData.last_name}`.trim(), // for existing table compatibility
                            status: 'Present',
                            attendance: 100, // mock defaults
                            year: formData.className,
                            faces: {
                                front: faceData.face_front ? `/storage/students/${formData.student_id}/front.jpg` : null,
                                left: faceData.face_left ? `/storage/students/${formData.student_id}/left.jpg` : null,
                                right: faceData.face_right ? `/storage/students/${formData.student_id}/right.jpg` : null,
                                embedding: mockEmbedding
                            }
                        };
                        onAdd(finalPayload);
                    }
                }, 2000);
            }
        } else if (activeStep === 2) {
            onClose();
        }
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep(prev => prev - 1);
    };

    const renderStepContent = () => {
        if (loading && activeStep === 1) {
            // Processing step 2 overlay
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 350, flexDirection: 'column', gap: 3 }}>
                    <CircularProgress size={48} thickness={4} color="success" />
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={600}>Processing Face Data</Typography>
                        <Typography variant="body2" color="text.secondary">Generating localized embeddings and saving to secure storage...</Typography>
                    </Box>
                </Box>
            );
        }

        switch (activeStep) {
            case 0:
                return (
                    <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Personal Details */}
                        <Card variant="outlined" sx={{ borderRadius: 3, p: { xs: 2.5, md: 3.5 }, borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : alpha('#000', 0.08), bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff', boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgb(0 0 0 / 0.02)' }}>
                            <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '1.05rem' }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                Personal Details
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField size="medium" fullWidth label="First Name *" name="first_name" value={formData.first_name} onChange={handleChange} error={!!errors.first_name} helperText={errors.first_name || 'Legal first name'} placeholder="e.g. Priya" InputLabelProps={{ shrink: !!formData.first_name }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField size="medium" fullWidth label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} error={!!errors.last_name} helperText={errors.last_name || 'Legal last name'} placeholder="e.g. Sharma" InputLabelProps={{ shrink: !!formData.last_name }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField size="medium" fullWidth label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="e.g. Raj" InputLabelProps={{ shrink: !!formData.middle_name }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Date of Birth"
                                        value={formData.date_of_birth ? dayjs(formData.date_of_birth) : null}
                                        onChange={(newValue) => handleChange({ target: { name: 'date_of_birth', value: newValue ? newValue.format('YYYY-MM-DD') : '' } })}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                size: "medium",
                                                error: !!errors.date_of_birth,
                                                helperText: errors.date_of_birth,
                                                sx: getFieldSx(mode)
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        options={['Male', 'Female', 'Other']}
                                        value={formData.gender || null}
                                        onChange={(event, newValue) => {
                                            handleChange({ target: { name: 'gender', value: newValue || '' } });
                                        }}
                                        fullWidth
                                        PopperProps={{ placement: 'bottom-start' }}
                                        ListboxProps={{ style: { maxHeight: 200, overflowY: 'auto' } }}
                                        renderInput={(params) => (
                                            <TextField {...params} size="medium" label="Gender *" name="gender" error={!!errors.gender} helperText={errors.gender} sx={getFieldSx(mode)} />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Card>

                        {/* Contact Details */}
                        <Card variant="outlined" sx={{ borderRadius: 3, p: { xs: 2.5, md: 3.5 }, borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : alpha('#000', 0.08), bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff', boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgb(0 0 0 / 0.02)' }}>
                            <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '1.05rem' }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                                Contact Information
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField size="medium" fullWidth label="Email Address *" type="email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email || ' '} placeholder="student@example.com" InputLabelProps={{ shrink: !!formData.email }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField size="medium" fullWidth label="Student Mobile" name="student_mobile" value={formData.student_mobile} onChange={handleChange} error={!!errors.student_mobile} helperText={errors.student_mobile || '10-digit mobile number'} placeholder="9876543210" InputLabelProps={{ shrink: !!formData.student_mobile }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField size="medium" fullWidth label="WhatsApp Number" name="student_whatsapp" value={formData.student_whatsapp} onChange={handleChange} error={!!errors.student_whatsapp} helperText={errors.student_whatsapp || '10-digit WhatsApp number'} placeholder="9876543210" InputLabelProps={{ shrink: !!formData.student_whatsapp }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField size="medium" fullWidth label="Parent/Guardian Name" name="parent_name" value={formData.parent_name} onChange={handleChange} placeholder="Parent full name" InputLabelProps={{ shrink: !!formData.parent_name }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField size="medium" fullWidth label="Parent Mobile" name="parent_mobile" value={formData.parent_mobile} onChange={handleChange} error={!!errors.parent_mobile} helperText={errors.parent_mobile || '10-digit mobile number'} placeholder="9876543210" InputLabelProps={{ shrink: !!formData.parent_mobile }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField size="medium" fullWidth label="Permanent Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street, Area" InputLabelProps={{ shrink: !!formData.address }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField size="medium" fullWidth label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Pune" InputLabelProps={{ shrink: !!formData.city }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField size="medium" fullWidth label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Maharashtra" InputLabelProps={{ shrink: !!formData.state }} sx={getFieldSx(mode)} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField size="medium" fullWidth label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} error={!!errors.pincode} helperText={errors.pincode || '6-digit pincode'} placeholder="411001" InputLabelProps={{ shrink: !!formData.pincode }} sx={getFieldSx(mode)} />
                                </Grid>
                            </Grid>
                        </Card>

                        {/* Academic Details */}
                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                                p: { xs: 2.5, md: 3.5 },
                                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : alpha('#000', 0.08),
                                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
                                boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgb(0 0 0 / 0.02)'
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'text.primary',
                                    fontWeight: 700,
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    fontSize: '1.05rem'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: 'success.main'
                                    }}
                                />
                                Academic Reference
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                                {/* First Row: Roll Number and Admission Year */}
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                                        gap: 3
                                    }}
                                >
                                    {/* Roll Number */}
                                    <TextField
                                        size="medium"
                                        fullWidth
                                        label="Roll Number *"
                                        name="roll_number"
                                        value={formData.roll_number}
                                        onChange={handleChange}
                                        error={!!errors.roll_number}
                                        helperText={errors.roll_number || 'University assigned roll number'}
                                        sx={getFieldSx(mode)}
                                    />

                                    {/* Admission Year */}
                                    <TextField
                                        size="medium"
                                        fullWidth
                                        label="Admission Year"
                                        name="admission_year"
                                        value={formData.admission_year}
                                        onChange={handleChange}
                                        sx={getFieldSx(mode)}
                                    />
                                </Box>

                                {/* Second Row: Department, Course, Class Level, Semester */}
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                                        gap: 3
                                    }}
                                >
                                    {/* Department */}
                                    <Autocomplete
                                        options={departments}
                                        value={formData.department || null}
                                        onChange={(event, newValue) => {
                                            handleChange({
                                                target: { name: 'department', value: newValue || '' }
                                            });
                                        }}
                                        fullWidth
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="medium"
                                                label="Department *"
                                                name="department"
                                                error={!!errors.department}
                                                helperText={errors.department}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        )}
                                    />

                                    {/* Course */}
                                    <Autocomplete
                                        options={courses}
                                        value={formData.course || null}
                                        onChange={(event, newValue) => {
                                            handleChange({
                                                target: { name: 'course', value: newValue || '' }
                                            });
                                        }}
                                        fullWidth
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="medium"
                                                label="Course *"
                                                name="course"
                                                error={!!errors.course}
                                                helperText={errors.course}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        )}
                                    />

                                    {/* Class Level */}
                                    <Autocomplete
                                        options={classes}
                                        value={formData.className || null}
                                        onChange={(event, newValue) => {
                                            handleChange({
                                                target: { name: 'className', value: newValue || '' }
                                            });
                                        }}
                                        fullWidth
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="medium"
                                                label="Class Level"
                                                name="className"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        )}
                                    />

                                    {/* Semester */}
                                    <Autocomplete
                                        options={semesters}
                                        value={formData.semester || null}
                                        onChange={(event, newValue) => {
                                            handleChange({
                                                target: { name: 'semester', value: newValue || '' }
                                            });
                                        }}
                                        fullWidth
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="medium"
                                                label="Current Semester"
                                                name="semester"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        )}
                                    />
                                </Box>

                            </Box>
                        </Card>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={activeStep === 2 ? onClose : undefined} // Prevent closing by backdrop until finished or specifically aborting later
            fullWidth
            maxWidth="lg"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    padding: 0,
                    backgroundImage: 'none',
                    bgcolor: mode === 'dark' ? '#0F172A' : 'background.paper',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    minHeight: 600
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: mode === 'dark' ? '#334155' : 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#2e7d32', 0.1), color: '#2e7d32', display: 'flex' }}>
                        <SchoolIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Student Registration</Typography>
                </Box>
                {activeStep !== 2 && (
                    <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2.5, md: 4 }, bgcolor: mode === 'dark' ? '#0F172A' : alpha('#f5f5f5', 0.4) }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: { xs: 3, md: 4 }, mt: 1 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {renderStepContent()}

            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, gap: 1, justifyContent: 'space-between', borderTop: '1px solid', borderColor: mode === 'dark' ? '#334155' : 'divider' }}>
                {activeStep === 0 && (
                    <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>
                        Cancel
                    </Button>
                )}

                {activeStep === 1 && !loading && (
                    <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="outlined" sx={{ borderRadius: 2, px: 3, fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>
                        Back
                    </Button>
                )}

                {activeStep === 2 && <Box />} {/* Spacer for right alignment on final step*/}

                <Box sx={{ display: 'flex', gap: 2 }}>
                    {activeStep === 0 && (
                        <Button
                            onClick={handleNext}
                            disabled={loading}
                            variant="contained"
                            color="success"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
                        >
                            {loading ? 'Saving Student...' : 'Save & Continue'}
                        </Button>
                    )}

                    {activeStep === 1 && !loading && (
                        <Button
                            onClick={handleNext}
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
                        >
                            Save Face Data
                        </Button>
                    )}

                    {activeStep === 2 && (
                        <Button
                            onClick={onClose}
                            variant="contained"
                            color="success"
                            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
                        >
                            Finish
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default AddStudentForm;
