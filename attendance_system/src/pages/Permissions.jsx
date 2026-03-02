import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import PermissionList from '../components/PermissionList';
import RoleManager from '../components/RoleManager';

const PermissionsPage = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState(searchParams.get('view') === 'roles' ? 'roles' : 'users');

  useEffect(() => {
    const currentView = searchParams.get('view');
    if (currentView === 'roles') {
      setView('roles');
    } else {
      setView('users');
    }
  }, [searchParams]);

  return (
    <Box sx={{ width: '100%', minHeight: '80vh' }}>
      {/* Simplified Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
          {view === 'users' ? 'User Role Permission' : 'Role Management'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {view === 'users' ? 'System users ki granular permissions manage karein.' : 'System roles aur unke default permissions define karein.'}
        </Typography>
      </Box>

      {/* Content Area */}
      <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
        {view === 'users' ? (
          <PermissionList />
        ) : (
          <RoleManager />
        )}
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
