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
    CircularProgress,
    Card,
    Switch,
    FormControlLabel,
    useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    Close as CloseIcon,
    Domain as DomainIcon,
    Save as SaveIcon,
} from '@mui/icons-material';

const sectionCard = (mode) => ({
    borderRadius: 2,
    p: { xs: 2.5, md: 3 },
    borderColor: mode === 'dark' ? '#334155' : alpha('#000', 0.06),
    bgcolor: mode === 'dark' ? '#1E293B' : '#fff',
    boxShadow: 'none',
    border: '1px solid',
});

const getFieldSx = (mode) => ({
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
    '& input': {
        color: mode === 'dark' ? '#fff' : '#000',
    },
});

const emptyForm = () => ({
    name: '',
    code: '',
    status: true,
});

const AddDepartmentForm = ({ open, onClose, onSubmit }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(emptyForm());
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) {
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

    const validate = () => {
        const e = {};
        if (!formData.name.trim()) {
            e.name = 'Department name is required';
        } else if (formData.name.trim().length < 2) {
            e.name = 'Name must be at least 2 characters';
        }
        
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (onSubmit) {
                onSubmit(formData);
            }
        }, 800);
    };

    const SectionHeader = ({ color, label }) => (
        <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '1.05rem' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
            {label}
        </Typography>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    backgroundImage: 'none',
                    bgcolor: mode === 'dark' ? '#0F172A' : 'background.paper',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
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
                        <DomainIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Add Department</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{
                p: { xs: 2.5, md: 4 },
                bgcolor: mode === 'dark' ? '#0F172A' : alpha('#f5f5f5', 0.4),
            }}>
                {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, flexDirection: 'column', gap: 3 }}>
                        <CircularProgress size={48} thickness={4} color="primary" />
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>Saving Details...</Typography>
                            <Typography variant="body2" color="text.secondary">Please wait a moment</Typography>
                        </Box>
                    </Box>
                ) : (
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Card variant="outlined" sx={sectionCard(mode)}>
                            <SectionHeader color="primary.main" label="Department Details" />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Department Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name || 'E.g., Computer Science'}
                                    InputLabelProps={{ shrink: !!formData.name }}
                                    sx={getFieldSx(mode)}
                                />
                                <TextField
                                    fullWidth
                                    label="Department Code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    error={!!errors.code}
                                    helperText={errors.code || 'E.g., CSE'}
                                    InputLabelProps={{ shrink: !!formData.code }}
                                    sx={getFieldSx(mode)}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                                    <FormControlLabel
                                        control={<Switch name="status" checked={formData.status} onChange={handleChange} color="success" />}
                                        label={formData.status ? 'Active' : 'Inactive'}
                                    />
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{
                p: 3, gap: 1, justifyContent: 'space-between',
                borderTop: '1px solid',
                borderColor: mode === 'dark' ? '#334155' : 'divider',
            }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit} disabled={loading}
                    variant="contained" color="success"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
                >
                    {loading ? 'Saving...' : 'Add Department'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDepartmentForm;
