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
    InputBase,
    alpha,
    styled,
    Collapse,
    useTheme,
} from '@mui/material';
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
    Person as PersonIcon,
    Palette as PaletteIcon,
    Backup as BackupIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

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
    const [settingsOpen, setSettingsOpen] = useState(true); // Default open to show the new dropdown
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSettingsToggle = () => {
        setSettingsOpen(!settingsOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Departments', icon: <BusinessIcon />, path: '/departments' },
        { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
        { text: 'Permissions', icon: <SecurityIcon />, path: '/permissions' },
        { text: 'Activity Logs', icon: <HistoryIcon />, path: '/activity-logs' },
        { text: 'Attendance Reports', icon: <DescriptionIcon />, path: '/reports' },
    ];

    const settingsSubItems = [
        { text: 'Account Details', icon: <PersonIcon />, path: '/settings/account' },
        { text: 'Notifications', icon: <NotificationsIcon />, path: '/settings/notifications' },
        { text: 'Security & Privacy', icon: <SecurityIcon />, path: '/settings/security' },
        { text: 'Appearance', icon: <PaletteIcon />, path: '/settings/appearance' },
        { text: 'Data & Backup', icon: <BackupIcon />, path: '/settings/backup' },
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
                {menuItems.map((item) => (
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

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleSettingsToggle}
                        sx={{
                            mx: 1,
                            borderRadius: 1,
                            mb: 0.5,
                            bgcolor: location.pathname.startsWith('/settings') ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <SettingsIcon color={location.pathname.startsWith('/settings') ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Settings"
                            primaryTypographyProps={{
                                fontSize: '0.9rem',
                                fontWeight: location.pathname.startsWith('/settings') ? 700 : 500,
                                color: location.pathname.startsWith('/settings') ? 'primary.main' : 'inherit'
                            }}
                        />
                        {settingsOpen ? <ExpandLess size="small" /> : <ExpandMore size="small" />}
                    </ListItemButton>
                </ListItem>

                <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {settingsSubItems.map((subItem) => (
                            <ListItemButton
                                key={subItem.text}
                                onClick={() => navigate(subItem.path)}
                                selected={location.pathname === subItem.path}
                                sx={{
                                    pl: 4.5,
                                    mx: 1,
                                    borderRadius: 1,
                                    mb: 0.5,
                                    '&.Mui-selected': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 32, '& svg': { fontSize: '1.2rem' } }}>
                                    {subItem.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={subItem.text}
                                    primaryTypographyProps={{
                                        fontSize: '0.85rem',
                                        fontWeight: location.pathname === subItem.path ? 600 : 400
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
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
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
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

                    <Search sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' }, color: 'text.secondary' }}>
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
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Alex Johnson</Typography>
                                <Typography variant="caption" color="text.secondary">Main Admin</Typography>
                            </Box>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>A</Avatar>
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
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
