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
              <TableCell>Time</TableCell>
              <TableCell>Actor</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Target</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No activity recorded yet.</TableCell>
              </TableRow>
            )}
            {logs.map((log, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{new Date(log.time).toLocaleString()}</TableCell>
                <TableCell>{log.actor}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.targetName || log.targetId || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ActivityLogList;
