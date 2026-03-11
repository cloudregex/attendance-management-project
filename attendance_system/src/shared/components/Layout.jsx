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
    RadioButtonUnchecked,
} from '@mui/icons-material';
import { Collapse } from '@mui/material';
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
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handlePermissionsClick = () => {
        setPermissionsOpen(!permissionsOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Departments', icon: <BusinessIcon />, path: '/departments' },
        { text: 'Activity Logs', icon: <HistoryIcon />, path: '/activity-logs' },
        { text: 'Attendance Reports', icon: <DescriptionIcon />, path: '/reports' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
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
                            selected={location.pathname === '/permissions' && !location.search.includes('view=roles')}
                            onClick={() => navigate('/permissions?view=users')}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                <RadioButtonUnchecked sx={{ fontSize: '0.8rem' }} />
                            </ListItemIcon>
                            <ListItemText primary="User Role Permission" primaryTypographyProps={{ fontSize: '0.85rem' }} />
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
        </Box>
    );
};

export default Layout;
