import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import ThemeProviderWrapper from './components/ThemeContext';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import DeptDashboard from './pages/DeptDashboard';
import AdminLogin from './pages/AdminLogin';
import { EmployeesPage, ReportsPage } from './pages/Placeholders';
import SettingsPage from './pages/Settings';
import PermissionsPage from './pages/Permissions';
import ActivityLogsPage from './pages/ActivityLogs';

function App() {
  return (
    <ThemeProviderWrapper>
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
    </ThemeProviderWrapper>
  );
}

export default App;
