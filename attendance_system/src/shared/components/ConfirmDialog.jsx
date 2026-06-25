import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
} from '@mui/material';

const ConfirmDialog = ({ open, onClose, onConfirm, title, content, confirmText = 'Delete', confirmColor = 'error' }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? '#334155' : 'grey.200',
                    boxShadow: theme.shadows[4],
                },
            }}
        >
            <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 800 }}>
                {title || 'Confirm Action'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {content || 'Are you sure you want to perform this action? This cannot be undone.'}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cancel
                </Button>
                <Button onClick={onConfirm} variant="contained" color={confirmColor} autoFocus>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
