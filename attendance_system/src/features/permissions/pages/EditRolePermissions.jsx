import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    Alert,
    Checkbox,
    useTheme,
    CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBackIosNew as ArrowBackIosNewIcon } from '@mui/icons-material';
import axiosInstance from '../../../utils/axiosInstance';
import { buildPermissionGroups } from '../utils/permissionGroups';

const EditRolePermissions = () => {
    const { roleId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const mode = theme.palette.mode;

    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState({}); // Stores { permissionId: boolean }
    const [permissionsList, setPermissionsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rolesRes, permsRes] = await Promise.all([
                    axiosInstance.get('/roles/get'),
                    axiosInstance.get('/permissions/definitions/get')
                ]);

                setPermissionsList(permsRes.data);

                const foundRole = rolesRes.data.find((r) => r.id === roleId);
                if (foundRole) {
                    setRole(foundRole);
                    const rolePerms = {};
                    if (foundRole.permissions) {
                        foundRole.permissions.forEach(p => {
                            rolePerms[p.id] = true;
                        });
                    }
                    setPermissions(rolePerms);
                }
            } catch (error) {
                console.error('Error fetching role or permissions:', error);
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
            // Convert boolean map back to an array of IDs
            const selectedPermissionIds = Object.keys(permissions).filter(id => permissions[id]).map(Number);

            await axiosInstance.put(`/roles/update/${role.id}`, {
                name: role.name,
                permissions: selectedPermissionIds
            });
            navigate('/permissions?view=roles');
        } catch (error) {
            console.error('Error saving role permissions:', error);
            alert('Failed to save permissions');
        }
    };

    const PermissionGroupCard = ({ title, groupPerms }) => {
        const allSelected = groupPerms.every(p => !!permissions[p.id]);

        const toggleAll = () => {
            const nextVal = !allSelected;
            setPermissions(prev => {
                const updated = { ...prev };
                groupPerms.forEach(p => updated[p.id] = nextVal);
                return updated;
            });
        };

        return (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 0.75,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.18)' : '#dbe4f0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: mode === 'dark' ? '#111827' : '#ffffff'
                }}
            >
                <Box sx={{
                    background: mode === 'dark'
                        ? 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%)'
                        : 'linear-gradient(90deg, #0f7bf2 0%, #6ea8ff 100%)',
                    color: 'white',
                    px: 1,
                    py: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {title}
                    </Typography>
                    <Checkbox
                        size="small"
                        checked={allSelected}
                        onChange={toggleAll}
                        sx={{ p: 0, color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: 'white' } }}
                    />
                </Box>
                <Box sx={{ p: 1, flex: 1 }}>
                    <Stack spacing={0.45}>
                        {groupPerms.map((p) => (
                            <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Checkbox
                                    size="small"
                                    checked={!!permissions[p.id]}
                                    onChange={() => handleToggle(p.id)}
                                    color="success"
                                    sx={{
                                        p: 0.35,
                                        '& .MuiSvgIcon-root': { fontSize: 22 }
                                    }}
                                />
                                <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.9rem', textTransform: 'capitalize', lineHeight: 1.45 }}>
                                    {p.name}
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

    const permissionStructure = buildPermissionGroups(permissionsList);

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
                            checked={permissionsList.length > 0 && permissionsList.every(p => !!permissions[p.id])}
                            onChange={(e) => {
                                const nextVal = e.target.checked;
                                const updated = {};
                                permissionsList.forEach(p => updated[p.id] = nextVal);
                                setPermissions(updated);
                            }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Select All</Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
                        gap: 0,
                        border: '1px solid',
                        borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.18)' : '#dbe4f0',
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: mode === 'dark' ? '#020617' : '#f8fafc'
                    }}
                >
                    {permissionStructure.map((group) => (
                        <Box key={group.title} sx={{ minHeight: 205 }}>
                            <PermissionGroupCard
                                title={group.title}
                                groupPerms={group.permissions}
                            />
                        </Box>
                    ))}
                </Box>

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
