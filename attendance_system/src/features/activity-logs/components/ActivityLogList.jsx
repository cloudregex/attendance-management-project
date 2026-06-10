import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  useTheme,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SaveAlt as ExportIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const API_LOGS = 'http://localhost:5000/api/activity-logs';

const formatTime = (iso) => {
  const d = new Date(iso);
  return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const exportCSV = (rows) => {
  if (!rows || rows.length === 0) return;
  const headers = ['time', 'action', 'actor', 'entityType', 'entityId', 'targetName', 'details'];
  const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `activity-logs-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const ActivityLogList = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async (pg = 1, size = 25) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const offset = (pg - 1) * size;
      const response = await axios.get(`${API_LOGS}/get?limit=${size}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page, pageSize);
  }, [page, pageSize]);

  const filtered = useMemo(() => {
    let arr = logs.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(l => (l.actor || '').toLowerCase().includes(q) || (l.action || '').toLowerCase().includes(q) || (l.targetName || '').toLowerCase().includes(q));
    }
    if (actionFilter !== 'all') {
      arr = arr.filter(l => (l.action || '').toLowerCase().includes(actionFilter));
    }
    return arr;
  }, [logs, query, actionFilter]);

  const actionTypes = Array.from(new Set(logs.map(l => (l.action || '').split(':')[0]))).filter(Boolean);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>
          System Activity Logs
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField size="small" placeholder="Search actor, action, target" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select size="small" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            <MenuItem value="all">All Actions</MenuItem>
            {actionTypes.map(t => <MenuItem key={t} value={t.toLowerCase()}>{t}</MenuItem>)}
          </Select>
          <Select size="small" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Tooltip title="Refresh">
            <IconButton onClick={() => fetchLogs(page, pageSize)} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export CSV">
            <IconButton onClick={() => exportCSV(filtered)}>
              <ExportIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2, border: '1px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
              <Typography color="text.secondary">No activity recorded for this query.</Typography>
            </Paper>
          ) : (
            filtered.map((log, idx) => (
              <Paper key={idx} sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: mode === 'dark' ? '#1E293B' : '#fff',
                border: '1px solid',
                borderColor: mode === 'dark' ? '#334155' : 'grey.100',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#2563EB',
                  bgcolor: mode === 'dark' ? alpha('#2563EB', 0.05) : alpha('#2563EB', 0.01),
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Typography variant="caption" fontWeight={700}>
                      {formatTime(log.createdAt || log.time)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{log.action}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(log.createdAt || log.time).toLocaleDateString()} • {log.actor || log.adminId || 'System'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{
                  px: 1.5, py: 0.5, borderRadius: 1,
                  bgcolor: mode === 'dark' ? alpha('#fff', 0.02) : 'grey.50',
                  border: '1px solid', borderColor: 'divider'
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Target: {log.targetName || log.entityType || log.entityId || '-'}
                  </Typography>
                </Box>
              </Paper>
            ))
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">Showing {filtered.length} records</Typography>
            <Box>
              <Button size="small" sx={{ mr: 1 }} disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
              <Button size="small" onClick={() => setPage(p => p + 1)}>Next</Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ActivityLogList;
