import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import DeptDashboard from './pages/DeptDashboard';
import AdminLogin from './pages/AdminLogin';
import { EmployeesPage, ReportsPage, SettingsPage } from './pages/Placeholders';
import PermissionsPage from './pages/Permissions';
import ActivityLogsPage from './pages/ActivityLogs';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                  <Route path="/activity-logs" element={<ActivityLogsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />

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
    </ThemeProvider>
  );
}

export default App;
