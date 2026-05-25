import React from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Paper, useTheme } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import PermissionDefinitionList from '../components/PermissionDefinitionList';
import UserManager from '../components/AdminManager';
import RoleManager from '../components/RoleManager';
import { People as PeopleIcon, List as ListIcon, Security as SecurityIcon } from '@mui/icons-material';

const PermissionsPage = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [searchParams, setSearchParams] = useSearchParams();
  const view = (() => {
    const v = searchParams.get('view');
    if (v === 'roles' || v === 'definitions') return v;
    return 'manage_users';
  })();

  const getTitle = () => {
    if (view === 'manage_users') return 'User Management';
    if (view === 'roles') return 'Role Management';
    return 'Permission Definition List';
  };

  const getSubtitle = () => {
    if (view === 'manage_users') return 'Add, edit, and manage system users.';
    if (view === 'roles') return 'Define system roles and their default permission sets.';
    return 'Define and manage permissions that can be assigned to roles and users.';
  };

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      if (nextView === 'manage_users') {
        setSearchParams({});
      } else {
        setSearchParams({ view: nextView });
      }
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '80vh' }}>
      {/* Header with Toggle */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        mb: 2.5
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            {getTitle()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getSubtitle()}
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 0.5,
            borderRadius: 2,
            bgcolor: mode === 'dark' ? 'background.paper' : 'grey.100',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: 1.5,
                px: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
                '&.Mui-selected': {
                  bgcolor: mode === 'dark' ? '#1E293B' : 'white',
                  color: mode === 'dark' ? 'primary.light' : 'primary.main',
                  boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: mode === 'dark' ? '#1E293B' : 'white',
                  }
                }
              }
            }}
          >
            <ToggleButton value="manage_users">
              <PeopleIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
              User List
            </ToggleButton>
            <ToggleButton value="roles">
              <SecurityIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
              Roles
            </ToggleButton>
            <ToggleButton value="definitions">
              <ListIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
              Permission Definitions
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>

      <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
        {view === 'manage_users' && <UserManager />}
        {view === 'roles' && <RoleManager />}
        {view === 'definitions' && <PermissionDefinitionList />}
      </Box>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default PermissionsPage;
