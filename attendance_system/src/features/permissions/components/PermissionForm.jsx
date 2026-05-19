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
  useTheme
} from '@mui/material';

const PermissionForm = ({ open, onClose, user, onSave }) => {
  const [permissions, setPermissions] = useState({});
  const theme = useTheme();
  const mode = theme.palette.mode;

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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: mode === 'dark' ? '#1E293B' : 'white',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
        Edit Granular Permissions {user ? `- ${user.name}` : ''}
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 1 }}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Toggle granular permissions for this user. These override role defaults.
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <FormGroup sx={{ gap: 1 }}>
            <FormControlLabel
              control={<Switch checked={!!permissions.canGrant} onChange={() => handleToggle('canGrant')} />}
              label={<Typography sx={{ fontWeight: 500 }}>Can grant permissions to others</Typography>}
            />
            <FormControlLabel
              control={<Switch checked={!!permissions.canApprove} onChange={() => handleToggle('canApprove')} />}
              label={<Typography sx={{ fontWeight: 500 }}>Can approve requests</Typography>}
            />
            <FormControlLabel
              control={<Switch checked={!!permissions.canTakeAttendance} onChange={() => handleToggle('canTakeAttendance')} />}
              label={<Typography sx={{ fontWeight: 500 }}>Can take attendance on behalf</Typography>}
            />
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          onClick={onClose}
          sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            boxShadow: 'none',
            fontWeight: 600,
            bgcolor: mode === 'dark' ? 'primary.main' : '#4484f4',
            '&:hover': {
              bgcolor: mode === 'dark' ? 'primary.dark' : '#3374e3',
              boxShadow: '0 4px 12px rgba(68, 132, 244, 0.2)'
            }
          }}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionForm;
