import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const PlaceholderPage = ({ title }) => (
    <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">This is a placeholder for the {title} page.</Typography>
        </Paper>
    </Box>
);

export const EmployeesPage = () => <PlaceholderPage title="Employees" />;
export const ReportsPage = () => <PlaceholderPage title="Attendance Reports" />;
export const SettingsPage = () => <PlaceholderPage title="Settings" />;
