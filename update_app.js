const fs = require('fs');
let content = fs.readFileSync('attendance_system/src/App.jsx', 'utf-8');

content = content.replace(
    "import { EmployeesPage, ReportsPage } from './shared/pages/Placeholders';",
    "import { EmployeesPage } from './shared/pages/Placeholders';"
);

content = content.replace(
    "import TimetableManagement from './features/timetable/pages/TimetableManagement';",
    "import TimetableManagement from './features/timetable/pages/TimetableManagement';\nimport AttendanceReports from './features/reports/pages/AttendanceReports';"
);

content = content.replace(
    '<Route path="/reports" element={<ProtectedRoute requiredPermission="canViewReports"><ReportsPage /></ProtectedRoute>} />',
    '<Route path="/reports" element={<ProtectedRoute requiredPermission="canViewReports"><AttendanceReports /></ProtectedRoute>} />'
);

fs.writeFileSync('attendance_system/src/App.jsx', content);
console.log("App.jsx updated");
