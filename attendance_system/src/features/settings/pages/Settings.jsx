import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Switch,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Button,
    TextField,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    alpha,
    useTheme,
    Card,
    CardContent,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useColorMode } from '../../../shared/components/ThemeContext';
import {
    Notifications,
    Security,
    Person,
    Palette,
    Language,
    CloudUpload,
    Backup,
    Vibration,
    Mail,
    PhoneIphone,
    NavigateNext,
    Save,
    Refresh,
    Edit as EditIcon,
} from '@mui/icons-material';

const Settings = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { mode, setMode } = useColorMode();

    // Mapping of paths to tab indices
    const tabPaths = [
        '/settings/account',
        '/settings/notifications',
        '/settings/security',
        '/settings/appearance',
        '/settings/backup'
    ];

    const [tabIndex, setTabIndex] = useState(() => {
        const index = tabPaths.indexOf(location.pathname);
        return index !== -1 ? index : 0;
    });

    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        twoFactor: true,
        darkMode: mode === 'dark',
        language: 'English',
        timezone: '(GMT-05:00) Eastern Time',
    });

    // Sync local state when global mode changes
    React.useEffect(() => {
        setSettings(prev => ({ ...prev, darkMode: mode === 'dark' }));
    }, [mode]);

    // Synchronize tab index with URL
    React.useEffect(() => {
        const index = tabPaths.indexOf(location.pathname);
        if (index !== -1) {
            setTabIndex(index);
        } else if (location.pathname === '/settings' || location.pathname === '/settings/') {
            navigate('/settings/account', { replace: true });
        }
    }, [location.pathname]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        navigate(tabPaths[newValue]);
    };

    const handleToggle = (setting) => {
        setSettings({ ...settings, [setting]: !settings[setting] });
    };

    const SettingItem = ({ icon, title, subtitle, action }) => (
        <ListItem
            sx={{
                py: 2,
                px: 3,
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
            }}
        >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 48 }}>
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
            />
            {action}
        </ListItem>
    );

    return (
        <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: mode === 'dark' ? '#F8FAFC' : '#1e293b', mb: 0.5 }}>
                        System Settings
                    </Typography>
                    <Typography variant="body1" sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>
                        Manage your account preferences and global system configurations.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        sx={{ borderRadius: '10px', fontWeight: 600 }}
                    >
                        Reset Defaults
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        sx={{ borderRadius: '10px', bgcolor: 'primary.main', fontWeight: 600, px: 3 }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* Main Content Area - Full Width */}
                <Grid item xs={12}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            minHeight: 500,
                            bgcolor: mode === 'dark' ? '#0F172A' : 'background.paper',
                            border: '1px solid',
                            borderColor: mode === 'dark' ? '#1E293B' : 'divider',
                            boxShadow: mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ borderBottom: 1, borderColor: mode === 'dark' ? '#1E293B' : 'divider', bgcolor: mode === 'dark' ? alpha('#1E293B', 0.4) : alpha(theme.palette.primary.main, 0.02) }}>
                            <Tabs
                                value={tabIndex}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    '& .MuiTab-root': {
                                        py: 2,
                                        px: 3,
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: mode === 'dark' ? '#94A3B8' : 'text.secondary',
                                        minHeight: 64,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: mode === 'dark' ? '#cbd5e1' : 'text.primary',
                                        },
                                        '&.Mui-selected': {
                                            color: mode === 'dark' ? '#3B82F6' : 'primary.main',
                                            bgcolor: mode === 'dark' ? alpha('#3B82F6', 0.05) : 'transparent',
                                        },
                                    },
                                    '& .MuiTabs-indicator': {
                                        height: 3,
                                        borderRadius: '3px 3px 0 0',
                                        backgroundColor: mode === 'dark' ? '#3B82F6' : 'primary.main',
                                        boxShadow: mode === 'dark' ? '0 -2px 10px rgba(59, 130, 246, 0.6)' : 'none',
                                    },
                                }}
                            >
                                <Tab icon={<Person sx={{ mr: 1 }} />} iconPosition="start" label="Account Details" />
                                <Tab icon={<Notifications sx={{ mr: 1 }} />} iconPosition="start" label="Notifications" />
                                <Tab icon={<Security sx={{ mr: 1 }} />} iconPosition="start" label="Security & Privacy" />
                                <Tab icon={<Palette sx={{ mr: 1 }} />} iconPosition="start" label="Appearance" />
                                <Tab icon={<CloudUpload sx={{ mr: 1 }} />} iconPosition="start" label="Data & Backup" />
                            </Tabs>
                        </Box>

                        {/* Tab Content: Account */}
                        {tabIndex === 0 && (
                            <Box sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>General Profile</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
                                    <Avatar
                                        sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
                                    >
                                        A
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Alex Johnson</Typography>
                                        <Typography variant="body2" color="text.secondary">Main Admin • Workspace Creator</Typography>
                                        <Button size="small" sx={{ mt: 1, fontWeight: 600 }}>Change Avatar</Button>
                                    </Box>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Full Name" defaultValue="Alex Johnson" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Email Address" defaultValue="alex@attendancepro.com" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Phone Number" defaultValue="+1 (555) 000-0000" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Timezone"
                                            value={settings.timezone}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
                                            <option value="(GMT-08:00) Pacific Time">(GMT-08:00) Pacific Time</option>
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Tab Content: Notifications */}
                        {tabIndex === 1 && (
                            <Box>
                                <Box sx={{ p: 4, pb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Notification Preferences</Typography>
                                    <Typography variant="body2" color="text.secondary">Select how you want to be alerted for system activities.</Typography>
                                </Box>
                                <List disablePadding>
                                    <SettingItem
                                        icon={<Mail />}
                                        title="Email Notifications"
                                        subtitle="Receive daily summaries and critical alerts via email."
                                        action={<Switch checked={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />}
                                    />
                                    <Divider />
                                    <SettingItem
                                        icon={<Notifications />}
                                        title="Push Notifications"
                                        subtitle="Get real-time browser alerts for immediate actions."
                                        action={<Switch checked={settings.pushNotifications} onChange={() => handleToggle('pushNotifications')} />}
                                    />
                                    <Divider />
                                    <SettingItem
                                        icon={<PhoneIphone />}
                                        title="SMS Alerts"
                                        subtitle="Send emergency alerts directly to your mobile device."
                                        action={<Switch />}
                                    />
                                </List>
                            </Box>
                        )}

                        {/* Tab Content: Security */}
                        {tabIndex === 2 && (
                            <Box sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Security & Access</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Configure your workspace security parameters.</Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Card variant="outlined" sx={{
                                            borderRadius: '12px',
                                            bgcolor: mode === 'dark' ? '#1E293B' : alpha(theme.palette.success.main, 0.02),
                                            borderColor: mode === 'dark' ? '#334155' : 'divider',
                                            boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
                                        }}>
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <Security color="success" />
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Two-Factor Authentication</Typography>
                                                        <Typography variant="body2" color="text.secondary">Your account is currently protected with 2FA.</Typography>
                                                    </Box>
                                                </Box>
                                                <Button variant="outlined" color="success" size="small">Configure</Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Password Management</Typography>
                                        <Button variant="outlined" sx={{ mr: 2 }}>Change Password</Button>
                                        <Button color="error">Logout from all devices</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Tab Content: Appearance */}
                        {tabIndex === 3 && (
                            <Box sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>User Interface</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Box
                                            onClick={() => setMode('light')}
                                            sx={{
                                                p: 3,
                                                border: '2px solid',
                                                borderColor: mode === 'light' ? 'primary.main' : (mode === 'dark' ? '#1E293B' : 'divider'),
                                                borderRadius: '12px',
                                                bgcolor: mode === 'light' ? alpha(theme.palette.primary.main, 0.05) : (mode === 'dark' ? '#1E293B' : 'transparent'),
                                                boxShadow: mode === 'light' ? '0 4px 14px rgba(59, 130, 246, 0.15)' : '0 4px 14px rgba(0,0,0,0.2)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    borderColor: mode === 'light' ? 'primary.main' : (mode === 'dark' ? '#334155' : 'primary.light'),
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.4)' : '0 6px 16px rgba(59, 130, 246, 0.1)',
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: mode === 'light' ? 'primary.main' : 'text.primary' }}>Light Mode</Typography>
                                                <Palette color={mode === 'light' ? 'primary' : 'inherit'} />
                                            </Box>
                                            <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '8px', border: '1px solid #ddd', height: 40 }} />
                                            <Box sx={{ p: 1, mt: 1, bgcolor: '#f1f5f9', borderRadius: '4px', width: '60%' }} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box
                                            onClick={() => setMode('dark')}
                                            sx={{
                                                p: 3,
                                                border: '2px solid',
                                                borderColor: mode === 'dark' ? '#3B82F6' : 'divider',
                                                borderRadius: '12px',
                                                bgcolor: mode === 'dark' ? '#1E293B' : 'transparent',
                                                boxShadow: mode === 'dark' ? '0 4px 20px rgba(59, 130, 246, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    borderColor: mode === 'dark' ? '#3B82F6' : 'primary.light',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: mode === 'dark' ? '0 6px 25px rgba(59, 130, 246, 0.3)' : '0 6px 16px rgba(0,0,0,0.1)',
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: mode === 'dark' ? '#3B82F6' : 'text.primary' }}>Dark Mode</Typography>
                                                <Palette color={mode === 'dark' ? 'primary' : 'inherit'} />
                                            </Box>
                                            <Box sx={{ p: 2, bgcolor: '#0B1220', borderRadius: '8px', border: '1px solid #334155', height: 40 }} />
                                            <Box sx={{ p: 1, mt: 1, bgcolor: '#334155', borderRadius: '4px', width: '60%' }} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Tab Content: Data & Backup */}
                        {tabIndex === 4 && (
                            <Box sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Data Management</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Export your data or manage system backups.</Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Paper variant="outlined" sx={{
                                            p: 3,
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                            bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                                            borderColor: mode === 'dark' ? '#334155' : 'divider',
                                            boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                boxShadow: mode === 'dark' ? '0 6px 24px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.05)',
                                            }
                                        }}>
                                            <Backup sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Automated Backups</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Last backup: 2 hours ago</Typography>
                                            <Button variant="contained" size="small">Backup Now</Button>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Paper variant="outlined" sx={{
                                            p: 3,
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                            bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                                            borderColor: mode === 'dark' ? '#334155' : 'divider',
                                            boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                boxShadow: mode === 'dark' ? '0 6px 24px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.05)',
                                            }
                                        }}>
                                            <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Export Data</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>CSV, JSON, and PDF supported</Typography>
                                            <Button variant="outlined" size="small">Choose Format</Button>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
