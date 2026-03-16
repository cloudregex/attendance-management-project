import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import ThemeProviderWrapper from './shared/components/ThemeContext';
import Layout from './shared/components/Layout';
import AdminDashboard from './features/dashboard/pages/AdminDashboard';
import DeptDashboard from './features/dashboard/pages/DeptDashboard';
import AdminLogin from './features/auth/pages/AdminLogin';
import { EmployeesPage, ReportsPage } from './shared/pages/Placeholders';
import SettingsPage from './features/settings/pages/Settings';
import PermissionsPage from './features/permissions/pages/Permissions';
import ActivityLogsPage from './features/activity-logs/pages/ActivityLogs';
import EditUserPermissions from './features/permissions/pages/EditUserPermissions';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SystemAdmin from './features/admin/pages/SystemAdmin';

function App() {
  return (
    <ThemeProviderWrapper>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<AdminLogin />} />

            {/* Protected/Dashboard Routes */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/departments" element={<DeptDashboard />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/permissions" element={<PermissionsPage />} />
                    <Route path="/permissions/edit/:userId" element={<EditUserPermissions />} />
                    <Route path="/activity-logs" element={<ActivityLogsPage />} />
                    <Route path="/system-admin" element={<SystemAdmin />} />
                    <Route path="/settings/*" element={<SettingsPage />} />

                    {/* Default dashboard route */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              }
            />

            {/* Global Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProviderWrapper>
    //comment by darshan 
  );
}

export default App;
