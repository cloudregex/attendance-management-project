import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Badge,
    Popover,
    InputBase,
    useTheme,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Business as BusinessIcon,
    People as PeopleIcon,
    Description as DescriptionIcon,
    Settings as SettingsIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Security as SecurityIcon,
    History as HistoryIcon,
    ExpandLess,
    ExpandMore,
    RadioButtonUnchecked,
    AdminPanelSettings,
    Logout,
    DarkMode,
    LightMode,
    MoreHoriz,
    DeleteOutline,
    ReportProblem,
} from '@mui/icons-material';

const mockNotifications = [
    {
        id: 1,
        user: 'Jolyon Wagg',
        action: 'and 1 other friend have birthdays today.',
        time: '2 hours ago',
        avatar: 'J',
        iconColor: '#1976d2',
    },
    {
        id: 2,
        user: 'Captain Haddock',
        action: 'commented on your recent update.',
        time: '5 hours ago',
        avatar: 'C',
        iconColor: '#2e7d32',
    },
    {
        id: 3,
        user: 'Tintin',
        action: 'mentioned you in a discussion.',
        time: '1 day ago',
        avatar: 'T',
        iconColor: '#ed6c02',
    },
    {
        id: 4,
        user: 'Professor Calculus',
        action: 'uploaded a new document.',
        time: '2 days ago',
        avatar: 'P',
        iconColor: '#9c27b0',
    }
];
import { useColorMode } from './ThemeContext';
import { Collapse } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateToken } from '../../Notifications/firebase';
// const [anchorEl, setAnchorEl] = React.useState(null);
// const open = Boolean(anchorEl);

const drawerWidth = 260;

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifAnchor, setNotifAnchor] = React.useState(null);
    const notifOpen = Boolean(notifAnchor);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedNotifId, setSelectedNotifId] = useState(null);

    React.useEffect(() => {
        // Request token on dashboard load
        generateToken().catch(err => console.error("Error generating permission token:", err));
    }, []);

    const handleActionMenuOpen = (event, id) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedNotifId(id);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchor(null);
        setSelectedNotifId(null);
    };

    const handleRemoveNotification = () => {
        setNotifications((prev) => prev.filter((n) => n.id !== selectedNotifId));
        handleActionMenuClose();
    };

    const handleReportIssue = () => {
        console.log(`Report issue for notification ${selectedNotifId}`);
        handleActionMenuClose();
    };

    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const colorMode = useColorMode();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handlePermissionsClick = () => {
        setPermissionsOpen(!permissionsOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        navigate('/login', { 
            state: { 
                message: 'You have been logged out successfully', 
                severity: 'success' 
            } 
        });
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Departments', icon: <BusinessIcon />, path: '/departments' },
        { text: 'Activity Logs', icon: <HistoryIcon />, path: '/activity-logs' },
        { text: 'Attendance Reports', icon: <DescriptionIcon />, path: '/reports' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
        { text: 'System AI', icon: <AdminPanelSettings />, path: '/system-admin' },
    ];

    const drawer = (
        <div>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                >
                    A
                </Box>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Attendance
                </Typography>
            </Box>
            <Divider />
            <List>
                {menuItems.slice(0, 3).map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                mx: 1,
                                borderRadius: 1,
                                mb: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'white' : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}

                {/* Collapsible Permissions Menu */}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handlePermissionsClick}
                        selected={location.pathname.startsWith('/permissions')}
                        sx={{
                            mx: 1,
                            borderRadius: 1,
                            mb: 0.5,
                            '&.Mui-selected': {
                                bgcolor: location.pathname.startsWith('/permissions') ? 'rgba(19, 91, 236, 0.08)' : 'transparent',
                                color: 'primary.main',
                                '& .MuiListItemIcon-root': {
                                    color: 'primary.main',
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: location.pathname.startsWith('/permissions') ? 'primary.main' : 'inherit' }}>
                            <SecurityIcon />
                        </ListItemIcon>
                        <ListItemText primary="User Management" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                        {permissionsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={permissionsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{ pl: 4, mx: 1, borderRadius: 1, mb: 0.5 }}
                            selected={location.pathname === '/permissions' && (!location.search || location.search.includes('view=manage_users'))}
                            onClick={() => navigate('/permissions?view=manage_users')}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <RadioButtonUnchecked sx={{ fontSize: '0.8rem' }} />
                            </ListItemIcon>
                            <ListItemText primary="User List" primaryTypographyProps={{ fontSize: '0.85rem' }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, mx: 1, borderRadius: 1, mb: 0.5 }}
                            selected={location.search.includes('view=users')}
                            onClick={() => navigate('/permissions?view=users')}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <RadioButtonUnchecked sx={{ fontSize: '0.8rem' }} />
                            </ListItemIcon>
                            <ListItemText primary="Permissions" primaryTypographyProps={{ fontSize: '0.85rem' }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, mx: 1, borderRadius: 1, mb: 0.5 }}
                            selected={location.search.includes('view=roles')}
                            onClick={() => navigate('/permissions?view=roles')}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <RadioButtonUnchecked sx={{ fontSize: '0.8rem' }} />
                            </ListItemIcon>
                            <ListItemText primary="Role Management" primaryTypographyProps={{ fontSize: '0.85rem' }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, mx: 1, borderRadius: 1, mb: 0 }}
                            selected={location.search.includes('view=definitions')}
                            onClick={() => navigate('/permissions?view=definitions')}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <RadioButtonUnchecked sx={{ fontSize: '0.7rem' }} />
                            </ListItemIcon>
                            <ListItemText primary="Permission List" primaryTypographyProps={{ fontSize: '0.85rem' }} />
                        </ListItemButton>
                    </List>
                </Collapse>

                {menuItems.slice(3).map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path || (item.path === '/settings' && location.pathname.startsWith('/settings'))}
                            sx={{
                                mx: 1,
                                borderRadius: 1,
                                mb: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: (location.pathname === item.path || (item.path === '/settings' && location.pathname.startsWith('/settings'))) ? 'white' : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}


            </List>
        </div>
    );
    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: theme.palette.mode === 'dark' ? '#0F172A' : 'white',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? '#334155' : 'divider',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Search sx={{
                        bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : 'grey.100',
                        '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#334155' : 'grey.200' },
                        color: theme.palette.mode === 'dark' ? '#94A3B8' : 'text.secondary',
                        border: theme.palette.mode === 'dark' ? '1px solid #334155' : 'none'
                    }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search anything..."
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton color="inherit" >
                            <Badge badgeContent={4} color="error" onClick={(e) => setNotifAnchor(e.currentTarget)}>
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Popover
                            open={notifOpen}
                            anchorEl={notifAnchor}
                            onClose={() => setNotifAnchor(null)}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right"
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right"
                            }}
                            PaperProps={{
                                sx: {
                                    width: { xs: '100%', sm: 360 },
                                    borderRadius: '12px',
                                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                    mt: 1.5,
                                    overflow: 'hidden'
                                }
                            }}
                        >
                            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Notifications
                                </Typography>
                            </Box>
                            
                            <Box sx={{ px: 2, pb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                    Today
                                </Typography>
                            </Box>

                            <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
                                {notifications.map((notif, index) => (
                                    <React.Fragment key={notif.id}>
                                        <ListItem 
                                            disablePadding
                                            sx={{
                                                px: 2,
                                                py: 1.5,
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 2,
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'
                                                }
                                            }}
                                        >
                                            <Avatar sx={{ bgcolor: notif.iconColor, width: 48, height: 48 }}>
                                                {notif.avatar}
                                            </Avatar>
                                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.3, mb: 0.5 }}>
                                                    <Box component="span" sx={{ fontWeight: 'bold' }}>{notif.user}</Box> {notif.action}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                    {notif.time}
                                                </Typography>
                                            </Box>
                                            <IconButton 
                                                size="small" 
                                                sx={{ color: 'text.secondary' }}
                                                onClick={(e) => handleActionMenuOpen(e, notif.id)}
                                            >
                                                <MoreHoriz />
                                            </IconButton>
                                        </ListItem>
                                        {index < notifications.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                            <Divider />
                            <Box sx={{ p: 1, textAlign: 'center' }}>
                                <Button size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>
                                    Load more notifications
                                </Button>
                            </Box>
                        </Popover>

                        {/* Dropdown Menu for Individual Notification Actions */}
                        <Menu
                            anchorEl={actionMenuAnchor}
                            open={Boolean(actionMenuAnchor)}
                            onClose={handleActionMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            PaperProps={{
                                elevation: 3,
                                sx: { minWidth: 150, borderRadius: 2, mt: 0.5 }
                            }}
                        >
                            <MenuItem onClick={handleRemoveNotification} sx={{ color: 'error.main' }}>
                                <ListItemIcon sx={{ color: 'inherit' }}>
                                    <DeleteOutline fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body2">Remove notification</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleReportIssue}>
                                <ListItemIcon>
                                    <ReportProblem fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body2">Report issue</Typography>
                            </MenuItem>
                        </Menu>
                        <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
                            {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                                    {(localStorage.getItem('adminEmail') || 'A').charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        minWidth: 150,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <Box sx={{ px: 2, py: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {localStorage.getItem('adminEmail') || 'Admin'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Main Admin</Typography>
                                </Box>
                                <Divider />
                                <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
                                    <ListItemIcon>
                                        <SettingsIcon fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <MenuItem
                                    onClick={() => { handleMenuClose(); setLogoutDialogOpen(true); }}
                                    sx={{ color: 'error.main' }}
                                >
                                    <ListItemIcon sx={{ color: 'inherit' }}>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    flexBasis: 0, // allow flex item to shrink properly alongside drawer
                    minWidth: 0, // prevents overflow when using flex
                    p: 3,
                    mt: '64px',
                    overflowX: 'hidden',
                }}
            >
                {children}
            </Box>



            {/* Logout Confirmation Dialog */}
            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">
                    {"Confirm Logout"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        Are you sure you want to log out of your session?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={() => { setLogoutDialogOpen(false); handleLogout(); }} color="error" variant="contained" autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Layout;
