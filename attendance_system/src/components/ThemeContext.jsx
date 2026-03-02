import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { alpha } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ColorModeContext);

const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            setMode: (newMode) => {
                setMode(newMode);
            },
            mode,
        }),
        [mode]
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: mode === 'light' ? '#135bec' : '#3b82f6', // Slightly more vibrant blue for dark mode
                        light: '#60a5fa',
                        dark: '#1d4ed8',
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#ef4444',
                    },
                    background: {
                        default: mode === 'light' ? '#f8f9fa' : '#0b1220',
                        paper: mode === 'light' ? '#ffffff' : '#1e293b',
                    },
                    text: {
                        primary: mode === 'light' ? '#1e293b' : '#f8fafc',
                        secondary: mode === 'light' ? '#64748b' : '#94a3b8',
                    },
                    divider: mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
                },
                typography: {
                    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                    h1: { fontWeight: 800, color: mode === 'light' ? '#0f172a' : '#f8fafc' },
                    h2: { fontWeight: 800, color: mode === 'light' ? '#0f172a' : '#f8fafc' },
                    h3: { fontWeight: 700, color: mode === 'light' ? '#0f172a' : '#f8fafc' },
                    h4: { fontWeight: 700, color: mode === 'light' ? '#0f172a' : '#f8fafc' },
                    h5: { fontWeight: 700, color: mode === 'light' ? '#0f172a' : '#f8fafc' },
                    h6: { fontWeight: 600, color: mode === 'light' ? '#0f172a' : '#f8fafc' },
                    subtitle1: { fontWeight: 500 },
                    body1: { lineHeight: 1.6 },
                    button: { textTransform: 'none', fontWeight: 600 },
                },
                shape: {
                    borderRadius: 14,
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                scrollbarColor: mode === 'dark' ? '#334155 #0b1220' : '#cbd5e1 #f8f9fa',
                                '&::-webkit-scrollbar': {
                                    width: 8,
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: mode === 'dark' ? '#0b1220' : '#f8f9fa',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: mode === 'dark' ? '#334155' : '#cbd5e1',
                                    borderRadius: 8,
                                },
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#0f172a',
                                borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                                backgroundImage: 'none',
                                color: mode === 'light' ? '#0f172a' : '#f8fafc',
                            },
                        },
                    },
                    MuiDrawer: {
                        styleOverrides: {
                            paper: {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#0f172a',
                                borderRight: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                                backgroundImage: 'none',
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundImage: 'none',
                                boxShadow: mode === 'light'
                                    ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 10,
                                padding: '8px 16px',
                            },
                            containedPrimary: {
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                },
                            },
                        },
                    },
                    MuiIconButton: {
                        styleOverrides: {
                            root: {
                                color: mode === 'light' ? '#64748b' : '#94a3b8',
                                '&:hover': {
                                    backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)',
                                },
                            },
                        },
                    },
                    MuiListItemButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default ThemeProvider;
