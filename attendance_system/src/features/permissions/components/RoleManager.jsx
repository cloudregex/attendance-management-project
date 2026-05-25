import React, { useState, useEffect } from 'react';
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
    CircularProgress,
    useTheme,
    Stack,
    Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Security as SecurityIcon, Refresh as RefreshIcon } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';

export const RoleManager = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [editingRole, setEditingRole] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [roleId, setRoleId] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [permissionsList, setPermissionsList] = useState([]);

    // Validation states
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Delete confirmation states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/roles/get`);
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissionsList = async () => {
        try {
            const response = await axiosInstance.get(`/permissions/definitions/get`);
            setPermissionsList(response.data);
        } catch (error) {
            console.error('Error fetching permissions list:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchPermissionsList();
    }, []);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'roleId':
                if (!value.trim()) {
                    error = 'Role ID is required';
                } else if (!/^[a-z0-9_]+$/.test(value)) {
                    error = 'Role ID can only contain lowercase letters, numbers, and underscores';
                } else if (!editingRole && roles.some(r => r.id === value.trim())) {
                    error = 'This Role ID already exists';
                }
                break;
            case 'roleName':
                if (!value.trim()) {
                    error = 'Role Name is required';
                } else if (value.trim().length < 2) {
                    error = 'Role Name must be at least 2 characters long';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleFieldChange = (name, value) => {
        if (name === 'roleId') setRoleId(value.toLowerCase().replace(/\s+/g, ''));
        if (name === 'roleName') setRoleName(value);

        const error = validateField(name, name === 'roleId' ? value.toLowerCase().replace(/\s+/g, '') : value);
        setErrors(prev => ({ ...prev, [name]: error }));

        if (!touched[name]) {
            setTouched(prev => ({ ...prev, [name]: true }));
        }
    };

    const handleFieldBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, name === 'roleId' ? roleId : roleName);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleOpen = (role = null) => {
        if (role) {
            setEditingRole(role);
            setRoleName(role.name);
            setRoleId(role.id);
            setPermissions(role.permissions ? role.permissions.map(p => p.id) : []);
        } else {
            setEditingRole(null);
            setRoleName('');
            setRoleId('');
            setPermissions([]);
        }
        setErrors({});
        setTouched({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        const fieldsToValidate = ['roleId', 'roleName'];
        let hasErrors = false;
        const newErrors = {};

        fieldsToValidate.forEach(field => {
            const value = field === 'roleId' ? roleId : roleName;
            const error = validateField(field, value);
            if (error) {
                newErrors[field] = error;
                hasErrors = true;
            }
        });

        setErrors(newErrors);
        setTouched(Object.fromEntries(fieldsToValidate.map(field => [field, true])));

        if (hasErrors) return;

        const roleData = {
            id: roleId.trim(),
            name: roleName.trim(),
            permissions
        };

        try {
            if (editingRole) {
                await axiosInstance.put(`/roles/update/${editingRole.id}`, roleData);
            } else {
                await axiosInstance.post(`/roles/create`, roleData);
            }
            fetchRoles();
            handleClose();
        } catch (error) {
            console.error('Error saving role:', error);
            alert(error.response?.data?.error || 'Failed to save role');
        }
    };

    const handleDelete = (role) => {
        if (role.id === 'admin') return; // Protect admin role
        setRoleToDelete(role);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (roleToDelete) {
            try {
                await axiosInstance.delete(`/roles/delete/${roleToDelete.id}`);
                fetchRoles();
            } catch (error) {
                console.error('Error deleting role:', error);
                alert(error.response?.data?.error || 'Failed to delete role');
            }
        }
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', color: 'text.primary' }}>
                        ROLE MANAGEMENT
                    </Typography>
                    <Box sx={{ bgcolor: 'primary.light', color: 'primary.main', px: 1, py: 0.2, borderRadius: 10, fontSize: '0.7rem', fontWeight: 800, opacity: 0.8 }}>
                        {roles.length} ROLES
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Tooltip title="Refresh Data">
                        <IconButton
                            onClick={fetchRoles}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                bgcolor: mode === 'dark' ? '#1E293B' : 'white'
                            }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
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
                        Add New Role
                    </Button>
                </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: mode === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'info.light' }}>
                Manage system roles and their permissions here. Changes will affect all users assigned to these roles.
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
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>Permissions</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : roles.map((role) => (
                            <TableRow key={role.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{
                                            width: 40, height: 40,
                                            bgcolor: 'primary.main',
                                            fontSize: '0.9rem', fontWeight: 700
                                        }}>
                                            <SecurityIcon fontSize="small" />
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{role.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">ID: {role.id}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {role.permissions && role.permissions.map(perm => (
                                            <Chip
                                                key={perm.id}
                                                label={perm.name}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                                            />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<EditIcon sx={{ fontSize: '1rem !important' }} />}
                                            onClick={() => navigate(`/permissions/edit-role/${role.id}`)}
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
                                            onClick={() => handleDelete(role)}
                                            disabled={role.id === 'admin'}
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
                        {!loading && roles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                                    <Typography color="text.secondary">No roles found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: mode === 'dark' ? '#1E293B' : 'white',
                        backgroundImage: 'none'
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                    {editingRole ? 'Edit Role' : 'Add New Role'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 1 }}>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Role ID"
                                value={roleId}
                                onChange={(e) => handleFieldChange('roleId', e.target.value)}
                                onBlur={() => handleFieldBlur('roleId')}
                                placeholder="e.g. teacher"
                                disabled={!!editingRole}
                                required
                                error={touched.roleId && !!errors.roleId}
                                helperText={touched.roleId && errors.roleId}
                            />
                            <TextField
                                fullWidth
                                label="Role Name"
                                value={roleName}
                                onChange={(e) => handleFieldChange('roleName', e.target.value)}
                                onBlur={() => handleFieldBlur('roleName')}
                                placeholder="e.g. Teacher"
                                required
                                error={touched.roleName && !!errors.roleName}
                                helperText={touched.roleName && errors.roleName}
                            />
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mt: 2 }}>
                            Permissions
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                            {permissionsList.map((perm) => (
                                <FormControl key={perm.id} component="fieldset" variant="standard">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <input
                                            type="checkbox"
                                            checked={permissions.includes(perm.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setPermissions(prev => [...prev, perm.id]);
                                                else setPermissions(prev => prev.filter(id => id !== perm.id));
                                            }}
                                            style={{ transform: 'scale(1.2)' }}
                                        />
                                        <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                            {perm.name}
                                        </Typography>
                                    </Box>
                                </FormControl>
                            ))}
                        </Box>
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
                        Save Role
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
                    Confirm Delete Role
                </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{
                            width: 50, height: 50,
                            bgcolor: 'primary.main',
                            fontSize: '1.2rem', fontWeight: 700
                        }}>
                            <SecurityIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                {roleToDelete?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                ID: {roleToDelete?.id}
                            </Typography>
                        </Box>
                    </Box>
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        <Typography variant="body2">
                            Are you sure you want to delete this role? This action cannot be undone and may affect users assigned to this role.
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
                        Delete Role
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RoleManager;
