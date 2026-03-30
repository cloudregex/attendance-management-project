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
  Button,
  useTheme,
} from '@mui/material';

const STORAGE_LOGS = 'am_logs_v1';

function readLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function clearLogs() {
  localStorage.removeItem(STORAGE_LOGS);
}

const ActivityLogList = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(readLogs());
  }, []);

  const refresh = () => setLogs(readLogs());

  const handleClear = () => {
    clearLogs();
    setLogs([]);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: mode === 'dark' ? '#F8FAFC' : 'text.primary' }}>Activity Logs</Typography>
        <Box>
          <Button onClick={refresh} sx={{ mr: 1, fontWeight: 600 }}>Refresh</Button>
          <Button color="error" variant="outlined" onClick={handleClear} sx={{ fontWeight: 600 }}>Clear Logs</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {logs.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2, border: '1px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
            <Typography color="text.secondary">No activity recorded yet.</Typography>
          </Paper>
        ) : (
          logs.slice(0).reverse().map((log, idx) => (
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
                    {new Date(log.time).getHours()}:{new Date(log.time).getMinutes().toString().padStart(2, '0')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{log.action}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(log.time).toLocaleDateString()} • {log.actor}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                px: 1.5, py: 0.5, borderRadius: 1, 
                bgcolor: mode === 'dark' ? alpha('#fff', 0.02) : 'grey.50',
                border: '1px solid', borderColor: 'divider'
              }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Target: {log.targetName || log.targetId || '-'}
                </Typography>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ActivityLogList;
