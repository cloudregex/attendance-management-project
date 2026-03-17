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
  Menu,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  ViewColumn as ViewColumnIcon,
} from '@mui/icons-material';
import { readRoles } from './RoleManager';
import { useNavigate } from 'react-router-dom';

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

const PermissionList = () => {
  const [users, setUsers] = useState(() => readUsers());
  const [roles, setRoles] = useState(() => readRoles());
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '' });

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const mode = theme.palette.mode;

  useEffect(() => {
    setRoles(readRoles());
  }, []);

  const refresh = () => setUsers(readUsers());

  const filtered = users
    .filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
    .filter((u) => (roleFilter ? u.roleId === roleFilter : true));

  const totalRecords = filtered.length;
  const paginatedUsers = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const roleColor = (roleId) => {
    if (roleId === 'admin') return 'primary';
    if (roleId === 'teacher') return 'success';
    if (roleId === 'subadmin') return 'warning';
    return 'default';
  };

  // Export Logic
  const handleExportClick = (event) => setExportAnchorEl(event.currentTarget);
  const handleExportClose = () => setExportAnchorEl(null);

  const handleExportData = (type) => {
    handleExportClose();
    if (type === 'csv') {
      const headers = ['ID', 'NAME', 'ROLE', 'GRANT', 'APPROVE', 'TAKE'];
      const rows = filtered.map(u => [
        u.id,
        u.name,
        roles.find(r => r.id === u.roleId)?.name || u.roleId,
        u.permissions?.canGrant ? 'Yes' : 'No',
        u.permissions?.canApprove ? 'Yes' : 'No',
        u.permissions?.canTakeAttendance ? 'Yes' : 'No'
      ]);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `user_permissions_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box>
      {/* Top Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', color: 'text.primary' }}>
            USER PERMISSIONS
          </Typography>
          <Box sx={{ bgcolor: 'primary.light', color: 'primary.main', px: 1, py: 0.2, borderRadius: 10, fontSize: '0.7rem', fontWeight: 800, opacity: 0.8 }}>
            {totalRecords} RECORDS
          </Box>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={refresh} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filter Bar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportClick}
            sx={{
              bgcolor: mode === 'dark' ? 'grey.800' : '#2563eb',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 'none',
              px: 2,
              '&:hover': { bgcolor: mode === 'dark' ? 'grey.700' : 'primary.dark' }
            }}
          >
            Exports
          </Button>
          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={() => handleExportData('csv')}>Export as CSV</MenuItem>
            <MenuItem onClick={() => handleExportData('print')} disabled>Print Table</MenuItem>
          </Menu>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1.2rem', color: 'text.disabled' }} /></InputAdornment>
              )
            }}
            sx={{
              width: { xs: '100%', sm: 250 },
              '& .MuiOutlinedInput-root': {
                bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                borderRadius: 2,
              }
            }}
          />
          <Select
            size="small"
            displayEmpty
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            sx={{
              minWidth: 120,
              borderRadius: 2,
              bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
            }}
          >
            <MenuItem value="">All roles</MenuItem>
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Table Container */}
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
              <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase' }}>Permissions</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No users found.</Typography>
                </TableCell>
              </TableRow>
            )}
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{
                      width: 40, height: 40,
                      bgcolor: user.roleId === 'admin' ? 'primary.main' : 'primary.light',
                      fontSize: '0.9rem', fontWeight: 700
                    }}>
                      {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: #{user.id.toString().padStart(4, '0')}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={roles.find(r => r.id === user.roleId)?.name || user.roleId}
                    color={roleColor(user.roleId)}
                    size="small"
                    sx={{ fontWeight: 600, borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Can Grant Permissions">
                      <Chip label="G" size="small" variant={user.permissions?.canGrant ? 'filled' : 'outlined'} color={user.permissions?.canGrant ? 'primary' : 'default'} sx={{ minWidth: 24, padding: 0 }} />
                    </Tooltip>
                    <Tooltip title="Can Approve Requests">
                      <Chip label="A" size="small" variant={user.permissions?.canApprove ? 'filled' : 'outlined'} color={user.permissions?.canApprove ? 'success' : 'default'} sx={{ minWidth: 24 }} />
                    </Tooltip>
                    <Tooltip title="Can Take Attendance">
                      <Chip label="T" size="small" variant={user.permissions?.canTakeAttendance ? 'filled' : 'outlined'} color={user.permissions?.canTakeAttendance ? 'secondary' : 'default'} sx={{ minWidth: 24 }} />
                    </Tooltip>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon sx={{ fontSize: '1rem !important' }} />}
                      onClick={() => navigate(`/permissions/edit/${user.id}`)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: 'divider',
                        color: mode === 'dark' ? 'primary.light' : 'primary.main',
                        '&:hover': {
                          bgcolor: mode === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'primary.light',
                          borderColor: 'primary.main',
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination Footer */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 1, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Show:</Typography>
            <Select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(e.target.value); setPage(1); }}
              size="small"
              sx={{
                borderRadius: 1.5,
                bgcolor: mode === 'dark' ? '#1E293B' : 'white',
                height: 32,
                '& .MuiSelect-select': { py: 0.5, fontSize: '0.85rem' }
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, totalRecords)} of {totalRecords} results
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5}>
          <Button
            size="small"
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            sx={{ minWidth: 40, borderRadius: 1.5, borderColor: 'divider' }}
          >
            Prev
          </Button>
          {[...Array(Math.ceil(totalRecords / rowsPerPage))].map((_, i) => (
            <Button
              key={i}
              size="small"
              onClick={() => setPage(i + 1)}
              sx={{
                minWidth: 32,
                borderRadius: 1.5,
                p: 0,
                bgcolor: page === i + 1 ? 'primary.main' : 'transparent',
                color: page === i + 1 ? 'white' : 'text.secondary',
                border: '1px solid',
                borderColor: page === i + 1 ? 'primary.main' : 'divider',
                '&:hover': { bgcolor: page === i + 1 ? 'primary.dark' : 'action.hover' }
              }}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            size="small"
            variant="outlined"
            disabled={page === Math.ceil(totalRecords / rowsPerPage)}
            onClick={() => setPage(p => p + 1)}
            sx={{ minWidth: 40, borderRadius: 1.5, borderColor: 'divider' }}
          >
            Next
          </Button>
        </Stack>
      </Box>

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
