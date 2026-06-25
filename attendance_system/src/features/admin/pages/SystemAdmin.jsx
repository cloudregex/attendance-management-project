import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    useTheme,
    Snackbar,
    Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    Security,
    ExitToApp,
    Settings as SettingsIcon,
    Psychology,
    Sync,
    Replay,
    ErrorOutline,
} from '@mui/icons-material';

const SystemAdmin = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });
    const [checkingStatus, setCheckingStatus] = React.useState(false);

    const handleCheckStatus = () => {
        setCheckingStatus(true);
        // Simulate an API check for the training engine status
        setTimeout(() => {
            setCheckingStatus(false);
            setSnackbar({
                open: true,
                message: 'System AI Engine is currently offline. Please start the local service.',
                severity: 'warning'
            });
        }, 1500);
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Box sx={{ p: 0, maxWidth: 1200, margin: '0 auto' }}>
            <Paper elevation={0} sx={{
                borderRadius: '16px',
                bgcolor: mode === 'dark' ? '#0F172A' : 'background.paper',
                border: '1px solid',
                borderColor: mode === 'dark' ? '#1E293B' : 'divider',
                overflow: 'hidden'
            }}>
                {/* Top Banner */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: mode === 'dark' ? '#1E293B' : 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 48, height: 48, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff8a65, #ff5252)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(255, 82, 82, 0.4)'
                        }}>
                            <Security sx={{ color: '#fff' }} />
                        </Box>
                        <Box>
                            <Typography variant="overline" sx={{ color: '#ff8a65', fontWeight: 800, letterSpacing: 1.5, lineHeight: 1 }}>ADMIN CONTROL</Typography>
                            <Typography variant="h6" sx={{ color: mode === 'dark' ? '#F8FAFC' : 'text.primary', fontWeight: 700, mt: 0.5 }}>System AI</Typography>
                        </Box>
                    </Box>
                    <IconButton sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>
                        <ExitToApp />
                    </IconButton>
                </Box>



                {/* Manage Content (FaceNet Engine) */}
                <Box sx={{ p: 3 }}>
                    <Paper variant="outlined" sx={{
                        p: 3,
                        borderRadius: '16px',
                        bgcolor: mode === 'dark' ? alpha('#3B82F6', 0.05) : 'background.paper',
                        borderColor: mode === 'dark' ? '#1E293B' : 'divider',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Status Dot */}
                        <Box sx={{ position: 'absolute', top: 24, right: 24, width: 10, height: 10, borderRadius: '50%', bgcolor: '#475569' }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Box sx={{
                                width: 56, height: 56, borderRadius: '12px',
                                bgcolor: '#3B82F6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(59,130,246,0.5)'
                            }}>
                                <Psychology sx={{ color: '#fff', fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ color: mode === 'dark' ? '#F8FAFC' : 'text.primary', fontWeight: 700 }}>FaceNet Training Engine</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>Local Python server required</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', flexDirection: { xs: 'column', md: 'row' } }}>
                            <Button 
                                variant="outlined" 
                                startIcon={checkingStatus ? <CircularProgress size={18} /> : <Sync />} 
                                onClick={handleCheckStatus}
                                disabled={checkingStatus}
                                sx={{
                                    flex: 1, minWidth: '150px',
                                    color: '#3B82F6', borderColor: mode === 'dark' ? '#1E293B' : 'divider',
                                    borderRadius: '8px', py: 1.5,
                                    '&:hover': { borderColor: '#3B82F6', bgcolor: alpha('#3B82F6', 0.1) }
                                }}
                            >
                                {checkingStatus ? 'Checking...' : 'Check Status'}
                            </Button>
                            <Button variant="outlined" startIcon={<Psychology />} sx={{
                                flex: 1, minWidth: '150px',
                                color: '#06b6d4', borderColor: mode === 'dark' ? '#1E293B' : 'divider',
                                borderRadius: '8px', py: 1.5,
                                '&:hover': { borderColor: '#06b6d4', bgcolor: alpha('#06b6d4', 0.1) }
                            }}>
                                Train Faces
                            </Button>
                            <Button variant="outlined" startIcon={<Replay />} sx={{
                                flex: 1, minWidth: '150px',
                                color: '#f59e0b', borderColor: mode === 'dark' ? '#1E293B' : 'divider',
                                borderRadius: '8px', py: 1.5,
                                '&:hover': { borderColor: '#f59e0b', bgcolor: alpha('#f59e0b', 0.1) }
                            }}>
                                Retrain All
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444' }}>
                            <ErrorOutline fontSize="small" />
                            <Typography variant="body2">Training engine is offline. Start the backend by clicking "Check Status"...</Typography>
                        </Box>
                    </Paper>
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '10px' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SystemAdmin;
