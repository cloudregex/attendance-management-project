import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Paper,
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    Avatar,
    Alert,
    useTheme,
    Stack,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, People as PeopleIcon } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/api/users';
const API_ROLES = 'http://localhost:5000/api/roles';

const UserManager = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [editingUser, setEditingUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userConfirmPassword, setUserConfirmPassword] = useState('');
    const [userRole, setUserRole] = useState('');

    // Validation states
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Delete confirmation states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Validation functions
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'userName':
                if (!value.trim()) {
                    error = 'Full name is required';
                } else if (value.trim().length < 2) {
                    error = 'Name must be at least 2 characters long';
                } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
                    error = 'Name can only contain letters and spaces';
                }
                break;

            case 'userEmail':
                if (!value.trim()) {
                    error = 'Email address is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address';
                } else if (editingUser && users.some(u => u.id !== editingUser.id && u.email === value.trim())) {
                    error = 'This email is already registered to another user';
                } else if (!editingUser && users.some(u => u.email === value.trim())) {
                    error = 'This email is already registered';
                }
                break;

            case 'userPhone':
                if (!value.trim()) {
                    error = 'Phone number is required';
                } else {
                    const cleanPhone = value.replace(/[\s\-()]/g, '');
                    if (!/^[+]?[1-9][\d]{9,14}$/.test(cleanPhone)) {
                        error = 'Please enter a valid phone number (10-15 digits)';
                    }
                }
                break;

            case 'userPassword':
                if (!editingUser) {
                    // Required for new users
                    if (!value) {
                        error = 'Password is required';
                    } else if (value.length < 8) {
                        error = 'Password must be at least 8 characters long';
                    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                        error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                    }
                } else {
                    // Optional for editing users
                    if (value && value.length < 8) {
                        error = 'New password must be at least 8 characters long';
                    } else if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                        error = 'New password must contain at least one uppercase letter, one lowercase letter, and one number';
                    }
                }
                break;

            case 'userConfirmPassword':
                if (!editingUser) {
                    // Required for new users
                    if (!value) {
                        error = 'Please confirm your password';
                    } else if (value !== userPassword) {
                        error = 'Passwords do not match';
                    }
                } else {
                    // Optional for editing users
                    if (userPassword && !value) {
                        error = 'Please confirm your new password';
                    } else if (userPassword && value !== userPassword) {
                        error = 'New passwords do not match';
                    }
                }
                break;

            case 'userRole':
                if (!value) {
                    error = 'Please select a role';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const handleFieldChange = (name, value) => {
        // Update field value
        switch (name) {
            case 'userName':
                setUserName(value);
                break;
            case 'userEmail':
                setUserEmail(value);
                break;
            case 'userPhone':
                setUserPhone(value);
                break;
            case 'userPassword':
                setUserPassword(value);
                break;
            case 'userConfirmPassword':
                setUserConfirmPassword(value);
                break;
            case 'userRole':
                setUserRole(value);
                break;
            default:
                break;
        }

        // Validate field
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));

        // Mark field as touched
        if (!touched[name]) {
            setTouched(prev => ({ ...prev, [name]: true }));
        }
    };

    const handleFieldBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name,
            name === 'userName' ? userName :
                name === 'userEmail' ? userEmail :
                    name === 'userPhone' ? userPhone :
                        name === 'userPassword' ? userPassword :
                            name === 'userConfirmPassword' ? userConfirmPassword :
                                name === 'userRole' ? userRole : ''
        );
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, rolesRes] = await Promise.all([
                axios.get(`${API_URL}/get`),
                axios.get(`${API_ROLES}/get`)
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (user = null) => {
        if (user) {
            setEditingUser(user);
            setUserName(user.name);
            setUserEmail(user.email || '');
            setUserPhone(user.phone || '');
            setUserPassword('');
            setUserConfirmPassword('');
            setUserRole(user.roleId);
        } else {
            setEditingUser(null);
            setUserName('');
            setUserEmail('');
            setUserPhone('');
            setUserPassword('');
            setUserConfirmPassword('');
            setUserRole(roles.length > 0 ? roles[0].id : '');
        }
        // Reset validation states
        setErrors({});
        setTouched({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        // Validate all fields before saving
        const newTouched = {
            userName: true,
            userEmail: true,
            userPhone: true,
            userPassword: true,
            userConfirmPassword: true,
            userRole: true
        };
        setTouched(newTouched);

        const newErrors = {
            userName: validateField('userName', userName),
            userEmail: validateField('userEmail', userEmail),
            userPhone: validateField('userPhone', userPhone),
            userPassword: validateField('userPassword', userPassword),
            userConfirmPassword: validateField('userConfirmPassword', userConfirmPassword),
            userRole: validateField('userRole', userRole),
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error !== '')) {
            return; // Stop saving if there are validation errors
        }

        const userData = {
            name: userName,
            email: userEmail,
            phone: userPhone,
            roleId: userRole,
            password: userPassword || undefined
        };

        try {
            const url = editingUser ? `${API_URL}/update/${editingUser.id}` : `${API_URL}/create`;
            const method = editingUser ? 'put' : 'post';

            const response = await axios({
                method,
                url,
                data: userData
            });

            fetchData();
            handleClose();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const result = error.response.data;
                // Map backend keys to frontend field names
                const fieldMapping = {
                    name: 'userName',
                    email: 'userEmail',
                    phone: 'userPhone',
                    roleId: 'userRole',
                    password: 'userPassword'
                };

                const mappedErrors = {};
                Object.keys(result.errors).forEach(key => {
                    const frontendKey = fieldMapping[key] || key;
                    mappedErrors[frontendKey] = result.errors[key];
                });

                setErrors(mappedErrors);
                setTouched(Object.keys(mappedErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            } else {
                console.error('Error saving user:', error);
                alert(error.response?.data?.error || 'Failed to save user');
            }
        }
    };

    const handleDelete = (user) => {
        if (user.id === 1) return; // Protect primary admin user
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            try {
                await axios.delete(`${API_URL}/delete/${userToDelete.id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(error.response?.data?.error || 'Failed to delete user');
            }
        }
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const getRoleName = (roleId) => {
        const r = roles.find(ro => ro.id === roleId);
        return r ? r.name : roleId;
    };

    const roleColor = (roleId) => {
        if (roleId === 'admin') return 'primary';
        if (roleId === 'teacher') return 'success';
        if (roleId === 'subadmin') return 'warning';
        return 'default';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => handleOpen()}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        boxShadow: 'none',
                        bgcolor: mode === 'dark' ? 'primary.main' : '#4484f4',
                        '&:hover': {
                            bgcolor: mode === 'dark' ? 'primary.dark' : '#3374e3',
                            boxShadow: '0 4px 12px rgba(68, 132, 244, 0.2)'
                        }
                    }}
                >
                    Add New User
                </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: mode === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'info.light' }}>
                Manage all system users here. Assigning a role automatically applies the default permissions for that role.
            </Alert>

            <Paper
                elevation={0}
                sx={{
                    p: 0,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    bgcolor: mode === 'dark' ? '#1E293B' : 'white',
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: mode === 'dark' ? '#0F172A' : 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>Contact Info</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>Assigned Role</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{
                                            width: 40, height: 40,
                                            bgcolor: user.roleId === 'admin' ? 'primary.main' : 'primary.light',
                                            fontSize: '0.9rem', fontWeight: 700
                                        }}>
                                            {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{user.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">ID: #{user.id.toString().padStart(4, '0')}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                            {user.email || 'Not provided'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user.phone || 'No phone'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getRoleName(user.roleId)}
                                        size="small"
                                        color={roleColor(user.roleId)}
                                        sx={{ fontWeight: 600, borderRadius: 1 }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<EditIcon sx={{ fontSize: '1rem !important' }} />}
                                            onClick={() => handleOpen(user)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderColor: 'divider',
                                                color: mode === 'dark' ? 'primary.light' : 'primary.main',
                                                '&:hover': {
                                                    bgcolor: mode === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'primary.light',
                                                    borderColor: 'primary.main',
                                                }
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<DeleteIcon sx={{ fontSize: '1rem !important' }} />}
                                            onClick={() => handleDelete(user)}
                                            disabled={user.id === 1}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderColor: 'divider',
                                                color: mode === 'dark' ? '#fca5a5' : 'error.main',
                                                '&:hover': {
                                                    bgcolor: mode === 'dark' ? 'rgba(248, 113, 113, 0.1)' : 'error.light',
                                                    borderColor: 'error.main',
                                                },
                                                '&.Mui-disabled': {
                                                    borderColor: 'divider',
                                                    opacity: mode === 'dark' ? 0.3 : 0.5
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: mode === 'dark' ? '#1E293B' : 'white',
                        backgroundImage: 'none'
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                    {editingUser ? 'Edit User' : 'Add New User'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 1 }}>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={userName}
                            onChange={(e) => handleFieldChange('userName', e.target.value)}
                            onBlur={() => handleFieldBlur('userName')}
                            placeholder="e.g. John Doe"
                            required
                            error={touched.userName && !!errors.userName}
                            helperText={touched.userName && errors.userName}
                        />
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={userEmail}
                            onChange={(e) => handleFieldChange('userEmail', e.target.value)}
                            onBlur={() => handleFieldBlur('userEmail')}
                            placeholder="e.g. john.doe@school.edu"
                            required
                            error={touched.userEmail && !!errors.userEmail}
                            helperText={touched.userEmail && errors.userEmail}
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={userPhone}
                            onChange={(e) => handleFieldChange('userPhone', e.target.value)}
                            onBlur={() => handleFieldBlur('userPhone')}
                            placeholder="e.g. +1-555-0123"
                            required
                            error={touched.userPhone && !!errors.userPhone}
                            helperText={touched.userPhone && errors.userPhone}
                        />
                        {!editingUser && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={userPassword}
                                    onChange={(e) => handleFieldChange('userPassword', e.target.value)}
                                    onBlur={() => handleFieldBlur('userPassword')}
                                    placeholder="Enter password (min 8 characters)"
                                    required
                                    error={touched.userPassword && !!errors.userPassword}
                                    helperText={touched.userPassword && errors.userPassword}
                                />
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    value={userConfirmPassword}
                                    onChange={(e) => handleFieldChange('userConfirmPassword', e.target.value)}
                                    onBlur={() => handleFieldBlur('userConfirmPassword')}
                                    placeholder="Re-enter password"
                                    required
                                    error={touched.userConfirmPassword && !!errors.userConfirmPassword}
                                    helperText={touched.userConfirmPassword && errors.userConfirmPassword}
                                />
                            </>
                        )}
                        {editingUser && (
                            <>
                                <TextField
                                    fullWidth
                                    label="New Password (Optional)"
                                    type="password"
                                    value={userPassword}
                                    onChange={(e) => handleFieldChange('userPassword', e.target.value)}
                                    onBlur={() => handleFieldBlur('userPassword')}
                                    placeholder="Leave blank to keep current password"
                                    error={touched.userPassword && !!errors.userPassword}
                                    helperText={touched.userPassword && errors.userPassword}
                                />
                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    type="password"
                                    value={userConfirmPassword}
                                    onChange={(e) => handleFieldChange('userConfirmPassword', e.target.value)}
                                    onBlur={() => handleFieldBlur('userConfirmPassword')}
                                    placeholder="Re-enter new password"
                                    error={touched.userConfirmPassword && !!errors.userConfirmPassword}
                                    helperText={touched.userConfirmPassword && errors.userConfirmPassword}
                                />
                            </>
                        )}
                        <FormControl fullWidth error={touched.userRole && !!errors.userRole}>
                            <InputLabel id="role-select-label">Assigned Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                value={userRole}
                                label="Assigned Role"
                                onChange={(e) => handleFieldChange('userRole', e.target.value)}
                                onBlur={() => handleFieldBlur('userRole')}
                                required
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {touched.userRole && errors.userRole && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                                    {errors.userRole}
                                </Typography>
                            )}
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            color: 'text.secondary',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            boxShadow: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Save User
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: mode === 'dark' ? '#1E293B' : 'white',
                        backgroundImage: 'none'
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                    Confirm Delete User
                </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{
                            width: 50, height: 50,
                            bgcolor: userToDelete?.roleId === 'admin' ? 'primary.main' : 'primary.light',
                            fontSize: '1.2rem', fontWeight: 700
                        }}>
                            {userToDelete?.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                {userToDelete?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {userToDelete?.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                ID: #{userToDelete?.id.toString().padStart(4, '0')}
                            </Typography>
                        </Box>
                    </Box>
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        <Typography variant="body2">
                            Are you sure you want to delete this user? This action cannot be undone and all associated data will be permanently removed.
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                        onClick={handleCancelDelete}
                        sx={{
                            color: 'text.secondary',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmDelete}
                        color="error"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            boxShadow: 'none',
                            fontWeight: 600,
                            bgcolor: 'error.main',
                            '&:hover': {
                                bgcolor: 'error.dark',
                                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
                            }
                        }}
                    >
                        Delete User
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManager;
