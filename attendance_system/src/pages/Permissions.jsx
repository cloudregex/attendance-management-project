import React, { useState, useEffect } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Paper } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import PermissionList from '../components/PermissionList';
import RoleManager from '../components/RoleManager';
import PermissionDefinitionList from '../components/PermissionDefinitionList';
import { People as PeopleIcon, Security as SecurityIcon, List as ListIcon } from '@mui/icons-material';

const PermissionsPage = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState(searchParams.get('view') === 'roles' ? 'roles' : 'users');

  useEffect(() => {
    const currentView = searchParams.get('view');
    if (currentView === 'roles') {
      setView('roles');
    } else if (currentView === 'definitions') {
      setView('definitions');
    } else {
      setView('users');
    }
  }, [searchParams]);

  const getTitle = () => {
    if (view === 'users') return 'User Role Permission';
    if (view === 'roles') return 'Role Management';
    return 'Permission Definition List';
  };

  const getSubtitle = () => {
    if (view === 'users') return 'Manage granular permissions for system users.';
    if (view === 'roles') return 'Define system roles and their default permission sets.';
    return 'Define and manage permissions that can be assigned to roles and users.';
  };

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
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
            bgcolor: 'grey.100',
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
                  bgcolor: 'white',
                  color: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: 'white',
                  }
                }
              }
            }}
          >
            <ToggleButton value="users">
              <PeopleIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
              Users
            </ToggleButton>
            <ToggleButton value="roles">
              <SecurityIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
              Roles
            </ToggleButton>
            <ToggleButton value="definitions">
              <ListIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
              Permissions
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>

      <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
        {view === 'users' && <PermissionList />}
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
