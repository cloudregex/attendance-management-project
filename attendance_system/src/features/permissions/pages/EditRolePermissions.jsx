import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    Alert,
    Grid,
    Checkbox,
    useTheme,
    CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBackIosNew as ArrowBackIosNewIcon } from '@mui/icons-material';
import axios from 'axios';

const API_ROLES = 'http://localhost:5000/api/roles';

const EditRolePermissions = () => {
    const { roleId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const mode = theme.palette.mode;

    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);

    const permissionKeys = [
        'canGrant', 'canApprove', 'canManageUsers', 'canManageRoles',
        'canTakeAttendance', 'canViewReports', 'canModifyRecords', 'canExportData',
        'canAccessLogs', 'canManageDepts', 'canViewSchedules', 'canSystemConfig'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesRes = await axios.get(`${API_ROLES}/get`);
                const foundRole = rolesRes.data.find((r) => r.id === roleId);

                if (foundRole) {
                    setRole(foundRole);
                    // Construct permissions directly from the role definition
                    const rolePerms = {};
                    permissionKeys.forEach(key => {
                        rolePerms[key] = foundRole[key] || false;
                    });
                    setPermissions(rolePerms);
                }
            } catch (error) {
                console.error('Error fetching role:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [roleId]);

    const handleToggle = (key) => {
        setPermissions((p) => ({ ...p, [key]: !p[key] }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`${API_ROLES}/update/${role.id}`, {
                name: role.name,
                ...permissions
            });
            navigate('/permissions?view=roles');
        } catch (error) {
            console.error('Error saving role permissions:', error);
            alert('Failed to save permissions');
        }
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
                    flexDirection: 'column',
                    bgcolor: 'background.paper'
                }}
            >
                <Box sx={{
                    bgcolor: mode === 'dark' ? 'primary.dark' : '#4484f4',
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
                <Box sx={{ p: 2, flex: 1, bgcolor: mode === 'dark' ? 'background.default' : 'white' }}>
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

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    if (!role) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Role not found.</Alert>
                <Button onClick={() => navigate('/permissions?view=roles')} sx={{ mt: 2 }}>
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
        <Box sx={{ minHeight: '100vh', bgcolor: mode === 'dark' ? 'background.default' : '#f8fafc', pb: 10 }}>
            <Box sx={{
                bgcolor: mode === 'dark' ? 'background.paper' : 'white',
                borderBottom: '1px solid',
                borderColor: 'divider',
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
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Edit Role Definition
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '0.7rem !important' }} />}
                    onClick={() => navigate('/permissions?view=roles')}
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
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1.5, ml: 0.5 }}>
                        Role: {role.name}
                    </Typography>
                    <Box sx={{
                        bgcolor: mode === 'dark' ? 'background.paper' : 'white',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderLeft: '4px solid',
                        borderLeftColor: mode === 'dark' ? 'primary.main' : '#4484f4',
                        borderRadius: 2,
                        p: 2.5,
                        color: 'text.primary',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                    }}>
                        Role ID: {role.id}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, px: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        Custom Permissions
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                            size="small"
                            color="primary"
                            checked={permissionKeys.every(k => !!permissions[k])}
                            onChange={(e) => {
                                const nextVal = e.target.checked;
                                const updated = {};
                                permissionKeys.forEach(k => updated[k] = nextVal);
                                setPermissions(updated);
                            }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Select All</Typography>
                    </Box>
                </Box>

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

                <Box sx={{
                    mt: 6,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 4
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/permissions?view=roles')}
                        sx={{
                            borderRadius: 2,
                            color: 'text.secondary',
                            borderColor: 'divider',
                            textTransform: 'none',
                            px: 4,
                            fontWeight: 600,
                            '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' }
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
                        Save Role Definitions
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default EditRolePermissions;
