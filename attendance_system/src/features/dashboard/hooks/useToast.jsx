import { useState, useCallback } from 'react';
import {
    Snackbar,
    Alert,
    AlertTitle,
    Slide,
} from '@mui/material';

/**
 * useToast — lightweight MUI Snackbar/Alert toast manager
 *
 * Usage:
 *   const { toast, ToastSnackbar } = useToast();
 *   toast.success('Done!');
 *   toast.error('Something went wrong.');
 *   toast.info('Loading…');
 *   toast.warning('Check this.');
 *
 * Render <ToastSnackbar /> once anywhere in the component.
 */

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

export function useToast(defaultDuration = 4000) {
    const [queue, setQueue] = useState([]);
    const [current, setCurrent] = useState(null);
    const [open, setOpen] = useState(false);

    const show = useCallback((severity, message, title = '', duration) => {
        const entry = {
            id: Date.now() + Math.random(),
            severity,   // 'success' | 'error' | 'warning' | 'info'
            message,
            title,
            duration: duration ?? defaultDuration,
        };

        setQueue(prev => {
            if (prev.length === 0 && !open) {
                // No toast visible → show immediately
                setCurrent(entry);
                setOpen(true);
                return [];
            }
            return [...prev, entry];
        });
    }, [defaultDuration, open]);

    const toast = {
        success: (msg, title = '') => show('success', msg, title),
        error:   (msg, title = '') => show('error',   msg, title),
        warning: (msg, title = '') => show('warning', msg, title),
        info:    (msg, title = '') => show('info',    msg, title),
    };

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleExited = () => {
        if (queue.length > 0) {
            const [next, ...rest] = queue;
            setCurrent(next);
            setQueue(rest);
            setOpen(true);
        } else {
            setCurrent(null);
        }
    };

    const ToastSnackbar = () => (
        <Snackbar
            open={open}
            autoHideDuration={current?.duration}
            onClose={handleClose}
            TransitionComponent={SlideTransition}
            TransitionProps={{ onExited: handleExited }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ mb: 1 }}
        >
            <Alert
                onClose={handleClose}
                severity={current?.severity || 'info'}
                variant="filled"
                elevation={6}
                sx={{
                    minWidth: 280,
                    maxWidth: 420,
                    borderRadius: 2,
                    fontWeight: 500,
                    '& .MuiAlert-message': { width: '100%' },
                }}
            >
                {current?.title && (
                    <AlertTitle sx={{ fontWeight: 700, mb: 0.25 }}>
                        {current.title}
                    </AlertTitle>
                )}
                {current?.message}
            </Alert>
        </Snackbar>
    );

    return { toast, ToastSnackbar };
}
