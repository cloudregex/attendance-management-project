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
import EditRolePermissions from './features/permissions/pages/EditRolePermissions';
import ActivityLogsPage from './features/activity-logs/pages/ActivityLogs';
import EditUserPermissions from './features/permissions/pages/EditUserPermissions';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SystemAdmin from './features/admin/pages/SystemAdmin';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;

  const adminRole = localStorage.getItem('adminRole');
  if (adminRole === 'admin') return children;

  const permissionsStr = localStorage.getItem('adminPermissions');
  const adminPermissions = permissionsStr ? JSON.parse(permissionsStr) : {};

  if (requiredPermission && !adminPermissions[requiredPermission]) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

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
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<AdminDashboard />} />
                      <Route path="/departments" element={<ProtectedRoute requiredPermission="canManageDepts"><DeptDashboard /></ProtectedRoute>} />
                      <Route path="/employees" element={<ProtectedRoute requiredPermission="canManageUsers"><EmployeesPage /></ProtectedRoute>} />
                      <Route path="/reports" element={<ProtectedRoute requiredPermission="canViewReports"><ReportsPage /></ProtectedRoute>} />
                      <Route path="/permissions" element={<ProtectedRoute requiredPermission="canManageUsers"><PermissionsPage /></ProtectedRoute>} />
                      <Route path="/permissions/edit/:userId" element={<ProtectedRoute requiredPermission="canManageUsers"><EditUserPermissions /></ProtectedRoute>} />
                      <Route path="/permissions/edit-role/:roleId" element={<ProtectedRoute requiredPermission="canManageRoles"><EditRolePermissions /></ProtectedRoute>} />
                      <Route path="/activity-logs" element={<ProtectedRoute requiredPermission="canAccessLogs"><ActivityLogsPage /></ProtectedRoute>} />
                      <Route path="/system-admin" element={<ProtectedRoute requiredPermission="canSystemConfig"><SystemAdmin /></ProtectedRoute>} />
                      <Route path="/settings/*" element={<SettingsPage />} />

                      {/* Default dashboard route */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
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
