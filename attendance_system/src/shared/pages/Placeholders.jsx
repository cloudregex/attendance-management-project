import React from 'react';
import { Typography, Box, Paper, useTheme } from '@mui/material';

const PlaceholderPage = ({ title }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>{title}</Typography>
            <Paper sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
                bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: mode === 'dark' ? '#334155' : 'divider',
            }}>
                <Typography sx={{ color: mode === 'dark' ? '#94A3B8' : 'text.secondary' }}>This is a placeholder for the {title} page.</Typography>
            </Paper>
        </Box>
    );
};

export const EmployeesPage = () => <PlaceholderPage title="Employees" />;
export const SettingsPage = () => <PlaceholderPage title="Settings" />;
