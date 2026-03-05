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
} from '@mui/material';
import { Close as CloseIcon, School as SchoolIcon } from '@mui/icons-material';

const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Applied Sciences',
    'Management'
];

const AddStudentForm = ({ open, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentId: '',
        department: '',
        batch: '',
        phone: '',
        admissionDate: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    padding: 1,
                    backgroundImage: 'none',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: alpha('#2e7d32', 0.1),
                        color: '#2e7d32',
                        display: 'flex'
                    }}>
                        <SchoolIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Add New Student</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4, pt: 1 }}>
                <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                    Register a new student by filling out the form below. All fields marked with * are required.
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Jane Smith"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="jane.smith@university.edu"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Student ID (Roll Number)"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                placeholder="STU-2024-501"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Department / Course"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                {departments.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Batch / Year"
                                name="batch"
                                value={formData.batch}
                                onChange={handleChange}
                                placeholder="2024-2028"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Admission Date"
                                name="admissionDate"
                                type="date"
                                value={formData.admissionDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ borderRadius: 2, px: 3, fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 2, px: 4, fontWeight: 600, boxShadow: '0 4px 12px rgba(46, 125, 50, 0.25)' }}
                >
                    Add Student
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddStudentForm;
