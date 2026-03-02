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
    FormControlLabel,
    Switch,
    FormGroup,
    Chip,
    Stack,
    Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const STORAGE_ROLES = 'am_roles_v1';

const defaultRoles = [
    { id: 'admin', name: 'Admin', permissions: { canGrant: true, canApprove: true, canTakeAttendance: true } },
    { id: 'subadmin', name: 'Subadmin', permissions: { canGrant: true, canApprove: true, canTakeAttendance: true } },
    { id: 'teacher', name: 'Teacher', permissions: { canGrant: false, canApprove: true, canTakeAttendance: true } },
    { id: 'staff', name: 'Staff', permissions: { canGrant: false, canApprove: false, canTakeAttendance: true } },
];

export function readRoles() {
    try {
        const raw = localStorage.getItem(STORAGE_ROLES);
        return raw ? JSON.parse(raw) : defaultRoles;
    } catch (e) {
        return defaultRoles;
    }
}

export function writeRoles(roles) {
    localStorage.setItem(STORAGE_ROLES, JSON.stringify(roles));
}

const RoleManager = () => {
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [permissions, setPermissions] = useState({
        canGrant: false,
        canApprove: false,
        canTakeAttendance: false,
    });

    useEffect(() => {
        setRoles(readRoles());
    }, []);

    const handleOpen = (role = null) => {
        if (role) {
            setEditingRole(role);
            setRoleName(role.name);
            setPermissions(role.permissions);
        } else {
            setEditingRole(null);
            setRoleName('');
            setPermissions({ canGrant: false, canApprove: false, canTakeAttendance: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        if (!roleName.trim()) return;

        let updatedRoles;
        if (editingRole) {
            updatedRoles = roles.map((r) =>
                r.id === editingRole.id ? { ...r, name: roleName, permissions } : r
            );
        } else {
            const newRole = {
                id: roleName.toLowerCase().replace(/\s+/g, '-'),
                name: roleName,
                permissions,
            };
            updatedRoles = [...roles, newRole];
        }

        setRoles(updatedRoles);
        writeRoles(updatedRoles);
        handleClose();
    };

    const handleDelete = (id) => {
        if (id === 'admin') return; // Protect admin role
        const updatedRoles = roles.filter((r) => r.id !== id);
        setRoles(updatedRoles);
        writeRoles(updatedRoles);
    };

    const handleToggle = (key) => {
        setPermissions((p) => ({ ...p, [key]: !p[key] }));
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => handleOpen()}>
                    Add New Role
                </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
                Define roles and their default permissions here. These will be available in the user assignment dropdown.
            </Alert>

            <Paper
                elevation={0}
                sx={{
                    p: 0,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Role Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Default Permissions</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>{role.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">Internal ID: {role.id}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Chip
                                            label="Grant"
                                            size="small"
                                            color={role.permissions.canGrant ? 'primary' : 'default'}
                                            variant={role.permissions.canGrant ? 'filled' : 'outlined'}
                                            sx={{ minWidth: 70 }}
                                        />
                                        <Chip
                                            label="Approve"
                                            size="small"
                                            color={role.permissions.canApprove ? 'success' : 'default'}
                                            variant={role.permissions.canApprove ? 'filled' : 'outlined'}
                                            sx={{ minWidth: 80 }}
                                        />
                                        <Chip
                                            label="Take"
                                            size="small"
                                            color={role.permissions.canTakeAttendance ? 'secondary' : 'default'}
                                            variant={role.permissions.canTakeAttendance ? 'filled' : 'outlined'}
                                            sx={{ minWidth: 70 }}
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleOpen(role)}
                                        size="small"
                                        sx={{
                                            color: 'primary.main',
                                            bgcolor: 'primary.light',
                                            mr: 1,
                                            opacity: 0.8,
                                            '&:hover': { bgcolor: 'primary.main', color: 'white', opacity: 1 }
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(role.id)}
                                        size="small"
                                        sx={{
                                            color: 'error.main',
                                            bgcolor: 'error.light',
                                            opacity: 0.8,
                                            '&:hover': { bgcolor: 'error.main', color: 'white', opacity: 1 }
                                        }}
                                        disabled={role.id === 'admin'}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Role Name"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="e.g. Intern, Moderator"
                        />
                        <Typography variant="subtitle2" color="text.secondary">Default Permissions</Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={!!permissions.canGrant} onChange={() => handleToggle('canGrant')} />}
                                label="Can grant permissions"
                            />
                            <FormControlLabel
                                control={<Switch checked={!!permissions.canApprove} onChange={() => handleToggle('canApprove')} />}
                                label="Can approve requests"
                            />
                            <FormControlLabel
                                control={<Switch checked={!!permissions.canTakeAttendance} onChange={() => handleToggle('canTakeAttendance')} />}
                                label="Can take attendance"
                            />
                        </FormGroup>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Role</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RoleManager;
