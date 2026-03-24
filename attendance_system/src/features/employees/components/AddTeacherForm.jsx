import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Card,
    Autocomplete,
    Switch,
    FormControlLabel,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    CheckCircle as CheckCircleIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science',
    'Data Structures', 'Algorithms', 'DBMS', 'Networks', 'Electronics',
    'Mechanics', 'Thermodynamics', 'Management', 'Economics',
];

const classOptions = [
    'First Year', 'Second Year', 'Third Year', 'Fourth Year',
];

const qualificationOptions = [
    'B.Tech', 'M.Tech', 'M.Sc', 'M.Phil', 'Ph.D', 'MBA', 'B.Ed', 'M.Ed',
];

const steps = ['Teacher Details', 'Address & Security', 'Completed'];

const sectionCard = (mode) => ({
    borderRadius: 3,
    p: { xs: 2.5, md: 3.5 },
    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : alpha('#000', 0.08),
    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
    boxShadow: mode === 'dark'
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 4px 6px -1px rgb(0 0 0 / 0.02)',
});

const getFieldSx = (mode) => ({
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
    '& input': {
        color: mode === 'dark' ? '#fff' : '#000',
    },
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset',
        WebkitTextFillColor: mode === 'dark' ? '#fff !important' : '#000 !important',
        transition: 'background-color 9999s ease-in-out 0s',
    },
});

const emptyForm = () => ({
    teacher_name: '',
    email: '',
    mobile: '',
    employee_id: '',
    department_id: '',   // integer FK — submitted to API
    designation: '',
    subjects: [],
    classes: [],
    qualification: '',
    gender: '',
    date_of_birth: '',
    joining_date: new Date().toISOString().slice(0, 10),
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: true,
    password: '',
});

const AddTeacherForm = ({ open, onClose, onSubmit }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(emptyForm());
    const [errors, setErrors] = useState({});
    const [departments, setDepartments] = useState([]);  // loaded from API

    // Load departments from backend
    useEffect(() => {
        fetch(`${API}/departments`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setDepartments(data.map(d => ({ id: d.id, name: d.name })));
            })
            .catch(() => {});
    }, []);

    // Reset on close
    React.useEffect(() => {
        if (!open) {
            setActiveStep(0);
            setLoading(false);
            setFormData(emptyForm());
            setErrors({});
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const newVal = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: newVal }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleAutoChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep1 = () => {
        const e = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;

        if (!formData.teacher_name.trim()) {
            e.teacher_name = 'Full name is required';
        } else if (formData.teacher_name.trim().length < 3) {
            e.teacher_name = 'Name must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            e.email = 'Email address is required';
        } else if (!emailRegex.test(formData.email.trim())) {
            e.email = 'Enter a valid email address (e.g. name@example.com)';
        }

        if (formData.mobile && !mobileRegex.test(formData.mobile)) {
            e.mobile = 'Enter a valid 10-digit Indian mobile number';
        }

        if (!formData.employee_id.trim()) {
            e.employee_id = 'Employee ID is required';
        } else if (formData.employee_id.trim().length < 3) {
            e.employee_id = 'Employee ID seems too short';
        }

        if (!formData.department_id) {
            e.department_id = 'Please select a department';
        }

        if (formData.date_of_birth) {
            const dob = new Date(formData.date_of_birth);
            const today = new Date();
            const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
            if (dob >= today) e.date_of_birth = 'Date of birth must be in the past';
            else if (age < 18) e.date_of_birth = 'Teacher must be at least 18 years old';
            else if (age > 80) e.date_of_birth = 'Please verify the date of birth';
        }

        if (formData.joining_date) {
            const joining = new Date(formData.joining_date);
            const maxFuture = new Date();
            maxFuture.setFullYear(maxFuture.getFullYear() + 1);
            if (joining > maxFuture) e.joining_date = 'Joining date cannot be more than 1 year in the future';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = () => {
        const e = {};

        if (!formData.password.trim()) {
            e.password = 'Password is required';
        } else if (formData.password.length < 8) {
            e.password = 'Password must be at least 8 characters';
        } else if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
            e.password = 'Password must contain at least one letter and one number';
        }

        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
            e.pincode = 'Pincode must be exactly 6 digits';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!validateStep1()) return;
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setActiveStep(1);
            }, 800);
        } else if (activeStep === 1) {
            if (!validateStep2()) return;
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setActiveStep(2);
                if (onSubmit) {
                    const payload = {
                        ...formData,
                        // department_id is already an integer from the dropdown
                    };
                    onSubmit(payload);
                }
            }, 1200);
        } else {
            onClose();
        }
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep(p => p - 1);
    };

    /* ─── Step renderers ──────────────────────────────────── */
    const renderStep1 = () => (
        <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Personal Details */}
            <Card variant="outlined" sx={sectionCard(mode)}>
                <SectionHeader color="primary.main" label="Personal Details" />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                    <TextField
                        fullWidth label="Full Name *" name="teacher_name"
                        value={formData.teacher_name} onChange={handleChange}
                        error={!!errors.teacher_name} helperText={errors.teacher_name || 'Legal full name'}
                        placeholder="e.g. Ramesh Kumar"
                        InputLabelProps={{ shrink: !!formData.teacher_name }}
                        sx={getFieldSx(mode)}
                    />
                    <Autocomplete
                        options={['Male', 'Female', 'Other']}
                        value={formData.gender || null}
                        onChange={(_, v) => handleAutoChange('gender', v || '')}
                        renderInput={(params) => (
                            <TextField {...params} label="Gender" name="gender" sx={getFieldSx(mode)} />
                        )}
                    />
                    <DatePicker
                        label="Date of Birth"
                        value={formData.date_of_birth ? dayjs(formData.date_of_birth) : null}
                        onChange={(newValue) => handleChange({ target: { name: 'date_of_birth', value: newValue ? newValue.format('YYYY-MM-DD') : '' } })}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.date_of_birth,
                                helperText: errors.date_of_birth,
                                sx: getFieldSx(mode)
                            }
                        }}
                    />
                    <Autocomplete
                        options={qualificationOptions}
                        value={formData.qualification || null}
                        onChange={(_, v) => handleAutoChange('qualification', v || '')}
                        renderInput={(params) => (
                            <TextField {...params} label="Qualification" sx={getFieldSx(mode)} />
                        )}
                    />
                    <DatePicker
                        label="Joining Date"
                        value={formData.joining_date ? dayjs(formData.joining_date) : null}
                        onChange={(newValue) => handleChange({ target: { name: 'joining_date', value: newValue ? newValue.format('YYYY-MM-DD') : '' } })}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.joining_date,
                                helperText: errors.joining_date,
                                sx: getFieldSx(mode)
                            }
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                name="status"
                                checked={formData.status}
                                onChange={handleChange}
                                color="success"
                            />
                        }
                        label={formData.status ? 'Active' : 'Inactive'}
                        sx={{ mt: 1 }}
                    />
                </Box>
            </Card>

            {/* Contact Details */}
            <Card variant="outlined" sx={sectionCard(mode)}>
                <SectionHeader color="secondary.main" label="Contact Information" />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                    <TextField
                        fullWidth label="Email Address *" type="email" name="email"
                        value={formData.email} onChange={handleChange}
                        error={!!errors.email} helperText={errors.email || ' '}
                        placeholder="teacher@school.edu"
                        InputLabelProps={{ shrink: !!formData.email }}
                        sx={getFieldSx(mode)}
                    />
                    <TextField
                        fullWidth label="Mobile Number" name="mobile"
                        value={formData.mobile} onChange={handleChange}
                        error={!!errors.mobile} helperText={errors.mobile || '10-digit mobile number'}
                        placeholder="9876543210"
                        InputLabelProps={{ shrink: !!formData.mobile }}
                        sx={getFieldSx(mode)}
                    />
                </Box>
            </Card>

            {/* Professional Details */}
            <Card variant="outlined" sx={sectionCard(mode)}>
                <SectionHeader color="success.main" label="Professional Details" />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                        <TextField
                            fullWidth label="Employee ID *" name="employee_id"
                            value={formData.employee_id} onChange={handleChange}
                            error={!!errors.employee_id} helperText={errors.employee_id || 'Unique teacher identifier'}
                            placeholder="e.g. EMP-001"
                            InputLabelProps={{ shrink: !!formData.employee_id }}
                            sx={getFieldSx(mode)}
                        />
                        <Autocomplete
                            options={departments}
                            getOptionLabel={(o) => o.name}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            value={departments.find(d => d.id === formData.department_id) || null}
                            onChange={(_, v) => handleAutoChange('department_id', v ? v.id : '')}
                            noOptionsText={departments.length === 0 ? 'No departments found — add one first' : 'No match'}
                            renderInput={(params) => (
                                <TextField
                                    {...params} label="Department *"
                                    error={!!errors.department_id} helperText={errors.department_id}
                                    sx={getFieldSx(mode)}
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                        <Autocomplete
                            multiple
                            options={subjectOptions}
                            value={formData.subjects}
                            onChange={(_, v) => handleAutoChange('subjects', v)}
                            renderInput={(params) => (
                                <TextField {...params} label="Subjects Taught" sx={getFieldSx(mode)} />
                            )}
                        />
                        <Autocomplete
                            multiple
                            options={classOptions}
                            value={formData.classes}
                            onChange={(_, v) => handleAutoChange('classes', v)}
                            renderInput={(params) => (
                                <TextField {...params} label="Classes Handled" sx={getFieldSx(mode)} />
                            )}
                        />
                    </Box>
                </Box>
            </Card>
        </Box>
    );

    const renderStep2 = () => (
        <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Address */}
            <Card variant="outlined" sx={sectionCard(mode)}>
                <SectionHeader color="warning.main" label="Address" />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        fullWidth label="Full Address" name="address"
                        value={formData.address} onChange={handleChange}
                        multiline rows={2} sx={getFieldSx(mode)}
                    />
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
                        <TextField
                            fullWidth label="City" name="city"
                            value={formData.city} onChange={handleChange}
                            sx={getFieldSx(mode)}
                        />
                        <TextField
                            fullWidth label="State" name="state"
                            value={formData.state} onChange={handleChange}
                            sx={getFieldSx(mode)}
                        />
                        <TextField
                            fullWidth label="Pincode" name="pincode"
                            value={formData.pincode} onChange={handleChange}
                            error={!!errors.pincode} helperText={errors.pincode || '6-digit pincode'}
                            sx={getFieldSx(mode)}
                        />
                    </Box>
                </Box>
            </Card>

            {/* Security */}
            <Card variant="outlined" sx={sectionCard(mode)}>
                <SectionHeader color="error.main" label="Login & Security" />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                    <TextField
                        fullWidth label="Login Password *" type="password" name="password"
                        value={formData.password} onChange={handleChange}
                        error={!!errors.password} helperText={errors.password || 'Min 8 chars with letters and numbers'}
                        sx={getFieldSx(mode)}
                    />
                </Box>
            </Card>
        </Box>
    );

    const renderStep3 = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 3 }}>
            <Box sx={{
                width: 80, height: 80, borderRadius: '50%',
                bgcolor: alpha('#2e7d32', 0.1),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} mb={1}>Teacher Added Successfully!</Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>{formData.teacher_name}</strong> ({formData.employee_id}) has been registered.
                </Typography>
                {formData.department_id && (
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                        Department: {departments.find(d => d.id === formData.department_id)?.name || `ID ${formData.department_id}`}
                    </Typography>
                )}
            </Box>
        </Box>
    );

    const renderStepContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 380, flexDirection: 'column', gap: 3 }}>
                    <CircularProgress size={48} thickness={4} color="primary" />
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={600}>
                            {activeStep === 0 ? 'Saving Details...' : 'Registering Teacher...'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Please wait a moment</Typography>
                    </Box>
                </Box>
            );
        }
        switch (activeStep) {
            case 0: return renderStep1();
            case 1: return renderStep2();
            case 2: return renderStep3();
            default: return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={activeStep === 2 ? onClose : undefined}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    padding: 0,
                    backgroundImage: 'none',
                    bgcolor: mode === 'dark' ? '#0F172A' : 'background.paper',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    minHeight: 560,
                }
            }}
        >
            <DialogTitle sx={{
                m: 0, p: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: mode === 'dark' ? '#334155' : 'divider',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#135bec', 0.1), color: '#135bec', display: 'flex' }}>
                        <PersonIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Teacher Registration</Typography>
                </Box>
                {activeStep !== 2 && (
                    <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent sx={{
                p: { xs: 2.5, md: 4 },
                bgcolor: mode === 'dark' ? '#0F172A' : alpha('#f5f5f5', 0.4),
            }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: { xs: 3, md: 4 }, mt: 1 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {renderStepContent()}
            </DialogContent>

            <DialogActions sx={{
                p: 3, pt: 0, gap: 1, justifyContent: 'space-between',
                borderTop: '1px solid',
                borderColor: mode === 'dark' ? '#334155' : 'divider',
            }}>
                {/* Left side */}
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
                {activeStep === 2 && <Box />}

                {/* Right side */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {activeStep === 0 && (
                        <Button
                            onClick={handleNext} disabled={loading}
                            variant="contained" color="primary"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
                        >
                            {loading ? 'Saving...' : 'Save & Continue'}
                        </Button>
                    )}
                    {activeStep === 1 && !loading && (
                        <Button
                            onClick={handleNext}
                            variant="contained" color="success"
                            startIcon={<SaveIcon />}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
                        >
                            Register Teacher
                        </Button>
                    )}
                    {activeStep === 2 && (
                        <Button
                            onClick={onClose}
                            variant="contained" color="success"
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

/* Small reusable section header */
const SectionHeader = ({ color, label }) => (
    <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '1.05rem' }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
        {label}
    </Typography>
);

export default AddTeacherForm;
