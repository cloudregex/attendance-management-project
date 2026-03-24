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

    const ToastSnackbar = ({ sx: extraSx }) => (
        <Snackbar
            open={open}
            autoHideDuration={current?.duration}
            onClose={handleClose}
            TransitionComponent={SlideTransition}
            TransitionProps={{ onExited: handleExited }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ 
                mb: 2, 
                mr: 1,
                ...extraSx 
            }}
        >
            <Alert
                onClose={handleClose}
                severity={current?.severity || 'info'}
                variant="filled"
                elevation={0}
                sx={{
                    minWidth: 320,
                    maxWidth: 450,
                    borderRadius: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: current?.severity === 'success' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    '& .MuiAlert-icon': {
                        fontSize: '1.5rem',
                        alignItems: 'center'
                    },
                    '& .MuiAlert-message': { 
                        width: '100%',
                        fontSize: '0.9rem',
                        py: 0.5 
                    },
                }}
            >
                {current?.title && (
                    <AlertTitle sx={{ fontWeight: 800, mb: 0.25, fontSize: '0.95rem' }}>
                        {current.title}
                    </AlertTitle>
                )}
                {current?.message}
            </Alert>
        </Snackbar>
    );

    return { toast, ToastSnackbar };
}
