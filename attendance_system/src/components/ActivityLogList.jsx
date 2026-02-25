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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Activity Logs</Typography>
        <Box>
          <Button onClick={refresh} sx={{ mr: 1 }}>Refresh</Button>
          <Button color="error" variant="outlined" onClick={handleClear}>Clear Logs</Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
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
