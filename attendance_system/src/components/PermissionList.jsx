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
  Checkbox,
} from '@mui/material';
import { Edit as EditIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import PermissionForm from './PermissionForm';
import { readRoles } from './RoleManager';

const STORAGE_USERS = 'am_users_v1';
const STORAGE_LOGS = 'am_logs_v1';

const defaultUsers = [
  { id: 1, name: 'Alex Johnson', roleId: 'admin', permissions: { canGrant: true, canApprove: true, canTakeAttendance: true } },
  { id: 2, name: 'Sara Parker', roleId: 'teacher', permissions: { canGrant: false, canApprove: true, canTakeAttendance: true } },
  { id: 3, name: 'Mark Lee', roleId: 'staff', permissions: { canGrant: false, canApprove: false, canTakeAttendance: true } },
  { id: 4, name: 'Nina Gomez', roleId: 'subadmin', permissions: { canGrant: true, canApprove: true, canTakeAttendance: true } },
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
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '' });

  useEffect(() => {
    setUsers(readUsers());
    setRoles(readRoles());
  }, []);

  // clear selection when filters change to avoid stale selections
  useEffect(() => {
    setSelectedIds([]);
  }, [query, roleFilter]);

  const refresh = () => {
    setUsers(readUsers());
    setRoles(readRoles());
  };

  const handleRoleChange = (userId, newRoleId) => {
    const roleObj = roles.find(r => r.id === newRoleId);
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          roleId: newRoleId,
          permissions: roleObj ? { ...roleObj.permissions } : u.permissions
        };
      }
      return u;
    });
    setUsers(updated);
    writeUsers(updated);
    const roleName = roleObj ? roleObj.name : newRoleId;
    addLog({ actor: 'System', action: `Role changed to ${roleName}`, targetId: userId, targetName: users.find(u => u.id === userId)?.name });
    setSnack({ open: true, message: `Role updated to ${roleName}` });
  };

  const handleEditSave = (user) => {
    const updated = users.map((u) => (u.id === user.id ? user : u));
    setUsers(updated);
    writeUsers(updated);
    addLog({ actor: 'Admin', action: `Updated permissions for ${user.name}`, targetId: user.id, targetName: user.name });
    setEditing(null);
    setSnack({ open: true, message: `Permissions updated for ${user.name}` });
  };

  const filtered = users
    .filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
    .filter((u) => (roleFilter ? u.roleId === roleFilter : true));

  const roleColor = (roleId) => {
    if (roleId === 'admin') return 'primary';
    if (roleId === 'teacher') return 'success';
    if (roleId === 'subadmin') return 'warning';
    return 'default';
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
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
          <Select
            size="small"
            displayEmpty
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All roles</MenuItem>
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
            ))}
          </Select>
          <Tooltip title="Refresh">
            <IconButton onClick={refresh} sx={{ bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper', border: '1px solid', borderColor: mode === 'dark' ? '#334155' : 'divider' }}><RefreshIcon /></IconButton>
          </Tooltip>
        </Box>
      </Box>

      {selectedIds.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">{selectedIds.length} selected:</Typography>
          <Select
            size="small"
            value=""
            displayEmpty
            onChange={(e) => {
              const newRole = e.target.value;
              if (newRole) {
                selectedIds.forEach((id) => handleRoleChange(id, newRole));
                setSelectedIds([]);
              }
            }}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="" disabled>Change role to…</MenuItem>
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
            ))}
          </Select>
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: mode === 'dark' ? '#0F172A' : 'grey.50' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length > 0 && selectedIds.length === filtered.length && filtered.length > 0}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < filtered.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(filtered.map((u) => u.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Permissions</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No users found.</TableCell>
              </TableRow>
            )}
            {filtered.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds((s) => [...s, user.id]);
                      } else {
                        setSelectedIds((s) => s.filter((id) => id !== user.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: user.roleId === 'admin' ? 'primary.main' : 'primary.light' }}>{user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: {user.id}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip label={getRoleName(user.roleId)} color={roleColor(user.roleId)} size="small" />
                    <Select value={user.roleId || ''} onChange={(e) => handleRoleChange(user.id, e.target.value)} size="small">
                      {roles.map((r) => (
                        <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                      ))}
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
                  <IconButton onClick={() => setEditing(user)} size="small" sx={{ color: 'primary.main', bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
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
