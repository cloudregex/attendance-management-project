const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'features', 'timetable', 'pages', 'TimetableManagement.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add ConfirmDialog import
content = content.replace(
    /import axiosInstance from '\.\.\/\.\.\/\.\.\/utils\/axiosInstance';/,
    "import ConfirmDialog from '../components/ConfirmDialog';\nimport axiosInstance from '../../../utils/axiosInstance';"
);

// 2. Add confirmDialog state
content = content.replace(
    /const \[toast, setToast\] = useState\(\{ open: false, severity: 'success', message: '' \}\);/,
    "const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });\n    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', content: '', endpoint: '', successMessage: '' });"
);

// 3. Add executeDelete and confirmDelete, update delete functions
content = content.replace(
    /const deleteEntry = async \(id\) => \{[\s\S]*?catch \(error\) \{[\s\S]*?notify\('error', error\.response\?\.data\?\.message \|\| 'Could not delete timetable entry\.'\);[\s\S]*?\}[\s\S]*?\};/m,
    `const confirmDelete = (endpoint, successMessage, entityName) => {
        setConfirmDialog({
            open: true,
            title: \`Delete \${entityName}?\`,
            content: \`Are you sure you want to delete \${entityName}? This action cannot be undone.\`,
            endpoint,
            successMessage,
        });
    };

    const executeDelete = async () => {
        const { endpoint, successMessage } = confirmDialog;
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        try {
            await axiosInstance.delete(endpoint);
            notify('success', successMessage);
            loadData();
        } catch (error) {
            notify('error', error.response?.data?.message || 'Delete failed.');
        }
    };

    const deleteEntry = (id) => {
        confirmDelete(\`/timetable/entries/\${id}\`, 'Timetable period removed.', 'this period');
    };`
);

content = content.replace(
    /const deleteSlot = async \(id\) => \{[\s\S]*?catch \(error\) \{[\s\S]*?notify\('error', error\.response\?\.data\?\.message \|\| 'Could not delete lecture slot\.'\);[\s\S]*?\}[\s\S]*?\};/m,
    `const deleteSlot = (id) => {
        confirmDelete(\`/timetable/slots/\${id}\`, 'Lecture slot removed.', 'this lecture slot');
    };`
);

// 4. SR No changes
// Source allocations
content = content.replace(
    /<TableCell>Subject<\/TableCell>\s*<TableCell>Faculty<\/TableCell>\s*<TableCell>Course<\/TableCell>\s*<TableCell>Weekly Periods<\/TableCell>/m,
    "<TableCell>SR No.</TableCell>\n                                    <TableCell>Subject</TableCell>\n                                    <TableCell>Faculty</TableCell>\n                                    <TableCell>Course</TableCell>\n                                    <TableCell>Weekly Periods</TableCell>"
);
content = content.replace(
    /\{\(overview\.allocations \|\| \[\]\)\.map\(\(allocation\) => \(/,
    "{(overview.allocations || []).map((allocation, index) => ("
);
content = content.replace(
    /<TableRow key=\{allocation\.id\}>\s*<TableCell>\{allocation\.subject\?\.code\}<\/TableCell>/m,
    "<TableRow key={allocation.id}>\n                                        <TableCell>{index + 1}</TableCell>\n                                        <TableCell>{allocation.subject?.code}</TableCell>"
);

// Weekly view
content = content.replace(
    /<TableCell>Time<\/TableCell>\s*<TableCell>Subject<\/TableCell>\s*<TableCell>Course \/ Sem<\/TableCell>\s*<TableCell>Faculty<\/TableCell>\s*<TableCell>Room<\/TableCell>\s*<TableCell>Status<\/TableCell>\s*<TableCell align="right">Action<\/TableCell>/m,
    "<TableCell>SR No.</TableCell>\n                                        <TableCell>Time</TableCell>\n                                        <TableCell>Subject</TableCell>\n                                        <TableCell>Course / Sem</TableCell>\n                                        <TableCell>Faculty</TableCell>\n                                        <TableCell>Room</TableCell>\n                                        <TableCell>Status</TableCell>\n                                        <TableCell align=\"right\">Action</TableCell>"
);
content = content.replace(
    /\{\(entriesByDay\[day\] \|\| \[\]\)\.map\(\(entry\) => \(/,
    "{(entriesByDay[day] || []).map((entry, index) => ("
);
content = content.replace(
    /<TableRow key=\{entry\.id\} hover>\s*<TableCell>\{entry\.slot\?\.start_time\?\.slice\(0, 5\)\} - \{entry\.slot\?\.end_time\?\.slice\(0, 5\)\}<\/TableCell>/m,
    "<TableRow key={entry.id} hover>\n                                            <TableCell>{index + 1}</TableCell>\n                                            <TableCell>{entry.slot?.start_time?.slice(0, 5)} - {entry.slot?.end_time?.slice(0, 5)}</TableCell>"
);
content = content.replace(
    /<TableCell colSpan=\{7\} align="center" sx=\{\{ py: 3, color: 'text\.secondary' \}\}>No periods scheduled\.<\/TableCell>/,
    "<TableCell colSpan={8} align=\"center\" sx={{ py: 3, color: 'text.secondary' }}>No periods scheduled.</TableCell>"
);

// Timings
content = content.replace(
    /<TableCell>Day<\/TableCell>\s*<TableCell>Timing<\/TableCell>\s*<TableCell>Type<\/TableCell>\s*<TableCell>Sequence<\/TableCell>\s*<TableCell align="right">Actions<\/TableCell>/m,
    "<TableCell>SR No.</TableCell>\n                                    <TableCell>Day</TableCell>\n                                    <TableCell>Timing</TableCell>\n                                    <TableCell>Type</TableCell>\n                                    <TableCell>Sequence</TableCell>\n                                    <TableCell align=\"right\">Actions</TableCell>"
);
content = content.replace(
    /\{\(overview\.slots \|\| \[\]\)\.map\(\(slot\) => \(/,
    "{(overview.slots || []).map((slot, index) => ("
);
content = content.replace(
    /<TableRow key=\{slot\.id\} hover>\s*<TableCell>\{slot\.day_of_week\}<\/TableCell>/m,
    "<TableRow key={slot.id} hover>\n                                        <TableCell>{index + 1}</TableCell>\n                                        <TableCell>{slot.day_of_week}</TableCell>"
);
content = content.replace(
    /<TableCell colSpan=\{5\} align="center" sx=\{\{ py: 3, color: 'text\.secondary' \}\}>No timings found\.<\/TableCell>/,
    "<TableCell colSpan={6} align=\"center\" sx={{ py: 3, color: 'text.secondary' }}>No timings found.</TableCell>"
);

// Add Dialog component at the end
content = content.replace(
    /<Snackbar/,
    `<ConfirmDialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog(p => ({ ...p, open: false }))}
                onConfirm={executeDelete}
                title={confirmDialog.title}
                content={confirmDialog.content}
            />

            <Snackbar`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Success');
