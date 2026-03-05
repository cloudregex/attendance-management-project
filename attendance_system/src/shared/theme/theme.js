import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#135bec', // Primary color from the design
            light: '#4b88ff',
            dark: '#0032b8',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1b',
            secondary: '#6c757d',
        },
    },
    typography: {
        fontFamily: '"Lexend", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(31, 41, 55, 0.1)',
                },
            },
        },
    },
});

export default theme;
