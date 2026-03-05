import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    Alert,
    Chip,
    Grid,
    Checkbox,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Refresh as RefreshIcon,
    Star as StarIcon,
    Groups as GroupsIcon,
    Work as WorkIcon,
    Person as PersonIcon,
    Check as CheckIcon,
    ArrowBackIosNew as ArrowBackIosNewIcon
} from '@mui/icons-material';
import { readRoles } from '../components/RoleManager';

const STORAGE_USERS = 'am_users_v1';
const STORAGE_LOGS = 'am_logs_v1';

function readUsers() {
    try {
        const raw = localStorage.getItem(STORAGE_USERS);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function writeUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function addLog(entry) {
    try {
        const raw = localStorage.getItem(STORAGE_LOGS);
        const logs = raw ? JSON.parse(raw) : [];
        logs.unshift({ ...entry, time: new Date().toISOString() });
        localStorage.setItem(STORAGE_LOGS, JSON.stringify(logs.slice(0, 500)));
    } catch (e) {
        // noop
    }
}

const EditUserPermissions = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [roleId, setRoleId] = useState('');
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const users = readUsers();
        const availableRoles = readRoles();
        setRoles(availableRoles);

        const foundUser = users.find((u) => u.id === parseInt(userId));
        if (foundUser) {
            setUser(foundUser);
            setRoleId(foundUser.roleId || '');
            setPermissions(foundUser.permissions || {});
        }
        setLoading(false);
    }, [userId]);

    const handleToggle = (key) => {
        setPermissions((p) => ({ ...p, [key]: !p[key] }));
    };

    const handleRoleChange = (newRoleId) => {
        setRoleId(newRoleId);
        const roleObj = roles.find(r => r.id === newRoleId);
        if (roleObj) {
            setPermissions({ ...roleObj.permissions });
        }
    };

    const handleSave = () => {
        const users = readUsers();
        const updatedUsers = users.map((u) =>
            u.id === user.id ? { ...u, roleId, permissions } : u
        );
        writeUsers(updatedUsers);
        addLog({
            actor: 'Admin',
            action: `Updated permissions for ${user.name}`,
            targetId: user.id,
            targetName: user.name,
        });
        navigate('/permissions?view=users');
    };

    const RoleCard = ({ role, isSelected, onSelect }) => {
        const getIcon = (id) => {
            switch (id) {
                case 'admin': return <StarIcon sx={{ color: isSelected ? 'white' : 'primary.main' }} />;
                case 'subadmin': return <GroupsIcon sx={{ color: isSelected ? 'white' : 'warning.main' }} />;
                case 'teacher': return <WorkIcon sx={{ color: isSelected ? 'white' : 'success.main' }} />;
                default: return <PersonIcon sx={{ color: isSelected ? 'white' : 'text.secondary' }} />;
            }
        };

        return (
            <Paper
                elevation={0}
                onClick={onSelect}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    backgroundColor: isSelected ? 'primary.main' : 'background.paper',
                    color: isSelected ? 'white' : 'text.primary',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: isSelected ? 'primary.main' : 'primary.light',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    position: 'relative',
                }}
            >
                {isSelected && (
                    <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
                        <CheckIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />
                    </Box>
                )}
                <Box sx={{
                    p: 1,
                    borderRadius: 1.5,
                    display: 'flex',
                    bgcolor: isSelected ? 'rgba(255,255,255,0.2)' : 'action.hover'
                }}>
                    {getIcon(role.id)}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {role.name}
                </Typography>
            </Paper>
        );
    };

    const PermissionGroupCard = ({ title, groupPerms }) => {
        const allSelected = groupPerms.every(p => !!permissions[p.key]);

        const toggleAll = () => {
            const nextVal = !allSelected;
            setPermissions(prev => {
                const updated = { ...prev };
                groupPerms.forEach(p => updated[p.key] = nextVal);
                return updated;
            });
        };

        return (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box sx={{
                    bgcolor: '#4484f4',
                    color: 'white',
                    px: 2,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                        {title}
                    </Typography>
                    <Checkbox
                        size="small"
                        checked={allSelected}
                        onChange={toggleAll}
                        sx={{ p: 0, color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: 'white' } }}
                    />
                </Box>
                <Box sx={{ p: 2, flex: 1, bgcolor: 'white' }}>
                    <Stack spacing={1}>
                        {groupPerms.map((p) => (
                            <Box key={p.key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Checkbox
                                    size="small"
                                    checked={!!permissions[p.key]}
                                    onChange={() => handleToggle(p.key)}
                                    color="success"
                                    sx={{ p: 0.5 }}
                                />
                                <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                                    {p.label}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Paper>
        );
    };

    if (loading) return null;

    if (!user) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">User not found.</Alert>
                <Button onClick={() => navigate('/permissions')} sx={{ mt: 2 }}>
                    Back to Permissions
                </Button>
            </Box>
        );
    }

    const permissionStructure = [
        {
            title: "Administrative Permissions",
            permissions: [
                { key: 'canGrant', label: 'Grant Permissions' },
                { key: 'canApprove', label: 'Approve Requests' },
                { key: 'canManageUsers', label: 'User Create/Edit/Delete' },
                { key: 'canManageRoles', label: 'Role Create/Edit/Delete' }
            ]
        },
        {
            title: "Attendance Permissions",
            permissions: [
                { key: 'canTakeAttendance', label: 'Take Attendance' },
                { key: 'canViewReports', label: 'View Attendance Reports' },
                { key: 'canModifyRecords', label: 'Modify Attendance Records' },
                { key: 'canExportData', label: 'Export Attendance Data' }
            ]
        },
        {
            title: "System Permissions",
            permissions: [
                { key: 'canAccessLogs', label: 'View Activity Logs' },
                { key: 'canManageDepts', label: 'Manage Departments' },
                { key: 'canViewSchedules', label: 'View Class Schedules' },
                { key: 'canSystemConfig', label: 'System Configuration' }
            ]
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 10 }}>
            {/* Top Bar */}
            <Box sx={{
                bgcolor: 'white',
                borderBottom: '1px solid',
                borderColor: '#e2e8f0',
                px: { xs: 2, md: 4 },
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                mb: 4
            }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    Edit Role Permission
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '0.7rem !important' }} />}
                    onClick={() => navigate('/permissions')}
                    sx={{
                        bgcolor: '#4484f4',
                        textTransform: 'none',
                        borderRadius: 1.5,
                        px: 2.5,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#3374e3', boxShadow: 'none' }
                    }}
                >
                    Go Back To List
                </Button>
            </Box>

            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
                {/* Role Name Display */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', mb: 1.5, ml: 0.5 }}>
                        Role Name
                    </Typography>
                    <Box sx={{
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: '#e2e8f0',
                        borderLeft: '4px solid',
                        borderLeftColor: '#4484f4',
                        borderRadius: 2,
                        p: 2.5,
                        color: '#1e293b',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                    }}>
                        {roles.find(r => r.id === roleId)?.name || 'Custom Role'}
                    </Box>
                </Box>

                {/* Role Selection Grid */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', mb: 2, ml: 0.5 }}>
                        Select Role Type
                    </Typography>
                    <Grid container spacing={2}>
                        {roles.map((r) => (
                            <Grid item xs={12} sm={6} md={3} key={r.id}>
                                <RoleCard
                                    role={r}
                                    isSelected={roleId === r.id}
                                    onSelect={() => handleRoleChange(r.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Permissions Section Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, px: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        Select Permission
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                            size="small"
                            color="primary"
                            checked={Object.values(permissions).every(v => v === true)}
                            onChange={(e) => {
                                const nextVal = e.target.checked;
                                const updated = {};
                                Object.keys(permissions).forEach(k => updated[k] = nextVal);
                                // Also ensure all structure keys are handled if they don't exist in state yet
                                permissionStructure.forEach(g => g.permissions.forEach(p => updated[p.key] = nextVal));
                                setPermissions(updated);
                            }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>Select All</Typography>
                    </Box>
                </Box>

                {/* Permissions Grid */}
                <Grid container spacing={3}>
                    {permissionStructure.map((group, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                            <PermissionGroupCard
                                title={group.title}
                                groupPerms={group.permissions}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Footer Actions */}
                <Box sx={{
                    mt: 6,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    borderTop: '1px solid',
                    borderColor: '#e2e8f0',
                    pt: 4
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/permissions')}
                        sx={{
                            borderRadius: 2,
                            color: '#64748b',
                            borderColor: '#e2e8f0',
                            textTransform: 'none',
                            px: 4,
                            fontWeight: 600,
                            '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            borderRadius: 2,
                            bgcolor: '#4484f4',
                            textTransform: 'none',
                            px: 4,
                            fontWeight: 600,
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#3374e3', boxShadow: 'none' }
                        }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default EditUserPermissions;
