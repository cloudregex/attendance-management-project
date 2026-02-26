import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Divider,
  FormGroup,
} from '@mui/material';

const PermissionForm = ({ open, onClose, user, onSave }) => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || {});
    } else {
      setPermissions({});
    }
  }, [user]);

  const handleToggle = (key) => {
    setPermissions((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    onSave({ ...user, permissions });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Permissions {user ? `- ${user.name}` : ''}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Toggle granular permissions for this user. These override role defaults.
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <FormGroup>
            <FormControlLabel
              control={<Switch checked={!!permissions.canGrant} onChange={() => handleToggle('canGrant')} />}
              label="Can grant permissions to others"
            />
            <FormControlLabel
              control={<Switch checked={!!permissions.canApprove} onChange={() => handleToggle('canApprove')} />}
              label="Can approve requests"
            />
            <FormControlLabel
              control={<Switch checked={!!permissions.canTakeAttendance} onChange={() => handleToggle('canTakeAttendance')} />}
              label="Can take attendance on behalf"
            />
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionForm;
