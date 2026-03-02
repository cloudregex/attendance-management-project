import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  Button,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Snackbar,
  useTheme,
} from '@mui/material';
import { Edit as EditIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import PermissionForm from './PermissionForm';

const STORAGE_USERS = 'am_users_v1';
const STORAGE_LOGS = 'am_logs_v1';

const defaultUsers = [
  { id: 1, name: 'Alex Johnson', role: 'Admin', permissions: { canGrant: true, canApprove: true, canTakeAttendance: true } },
  { id: 2, name: 'Sara Parker', role: 'Teacher', permissions: { canGrant: false, canApprove: true, canTakeAttendance: true } },
  { id: 3, name: 'Mark Lee', role: 'Staff', permissions: { canGrant: false, canApprove: false, canTakeAttendance: true } },
  { id: 4, name: 'Nina Gomez', role: 'Teacher', permissions: { canGrant: false, canApprove: true, canTakeAttendance: false } },
];

function readUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    return raw ? JSON.parse(raw) : defaultUsers;
  } catch (e) {
    return defaultUsers;
  }
}

function writeUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function addLog(entry) {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift({ ...entry, time: new Date().toISOString() });
    localStorage.setItem(STORAGE_LOGS, JSON.stringify(logs.slice(0, 500)));
  } catch (e) {
    // noop
  }
}

const PermissionList = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '' });

  useEffect(() => {
    const u = readUsers();
    setUsers(u);
  }, []);

  const refresh = () => setUsers(readUsers());

  const handleRoleChange = (userId, newRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setUsers(updated);
    writeUsers(updated);
    addLog({ actor: 'System', action: `Role changed to ${newRole}`, targetId: userId, targetName: users.find(u => u.id === userId)?.name });
    setSnack({ open: true, message: `Role updated to ${newRole}` });
  };

  const handleEditSave = (user) => {
    const updated = users.map((u) => (u.id === user.id ? user : u));
    setUsers(updated);
    writeUsers(updated);
    addLog({ actor: 'Admin', action: `Updated permissions for ${user.name}`, targetId: user.id, targetName: user.name });
    setEditing(null);
    setSnack({ open: true, message: `Permissions updated for ${user.name}` });
  };

  const filtered = users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));

  const roleColor = (role) => {
    if (role === 'Admin') return 'primary';
    if (role === 'Teacher') return 'success';
    return 'default';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>Permissions</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
              }
            }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={refresh} sx={{ bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper', border: '1px solid', borderColor: mode === 'dark' ? '#334155' : 'divider' }}><RefreshIcon /></IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid',
        borderColor: mode === 'dark' ? '#334155' : 'divider',
      }}>
        <Table>
          <TableHead sx={{ bgcolor: mode === 'dark' ? '#0F172A' : 'grey.50' }}>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No users found.</TableCell>
              </TableRow>
            )}
            {filtered.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: user.role === 'Admin' ? 'primary.main' : 'primary.light' }}>{user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: {user.id}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip label={user.role} color={roleColor(user.role)} size="small" />
                    <Select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} size="small">
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Teacher">Teacher (Subadmin)</MenuItem>
                      <MenuItem value="Staff">Staff</MenuItem>
                    </Select>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Chip label={user.permissions?.canGrant ? 'Grant' : 'No Grant'} size="small" color={user.permissions?.canGrant ? 'primary' : 'default'} />
                    <Chip label={user.permissions?.canApprove ? 'Approve' : 'No Approve'} size="small" color={user.permissions?.canApprove ? 'success' : 'default'} />
                    <Chip label={user.permissions?.canTakeAttendance ? 'Take' : 'No Take'} size="small" color={user.permissions?.canTakeAttendance ? 'secondary' : 'default'} />
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Button startIcon={<EditIcon />} size="small" onClick={() => setEditing(user)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <PermissionForm open={!!editing} onClose={() => setEditing(null)} user={editing} onSave={handleEditSave} />

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack({ open: false, message: '' })}
        message={snack.message}
      />
    </Box>
  );
};

export default PermissionList;
