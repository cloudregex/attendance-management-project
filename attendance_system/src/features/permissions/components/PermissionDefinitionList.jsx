import React, { useState, useEffect } from 'react';
import {
    Paper,
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination,
    Stack,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Tooltip,
    useTheme,
    Menu,
    Checkbox,
    ListItemIcon,
    ListItemText,
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon,
    FileDownload as FileDownloadIcon,
    ViewColumn as ViewColumnIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/permissions/definitions';

const PermissionDefinitionList = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingPerm, setEditingPerm] = useState(null);
    const [permName, setPermName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Column visibility state
    const [columns, setColumns] = useState({
        srNo: true,
        name: true,
        actions: true
    });

    const [columnAnchorEl, setColumnAnchorEl] = useState(null);
    const [exportAnchorEl, setExportAnchorEl] = useState(null);

    const theme = useTheme();
    const mode = theme.palette.mode;

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/get`);
            setPermissions(response.data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const handleOpen = (perm = null) => {
        if (perm) {
            setEditingPerm(perm);
            setPermName(perm.name);
        } else {
            setEditingPerm(null);
            setPermName('');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (!permName.trim()) return;

        try {
            if (editingPerm) {
                await axios.put(`${API_URL}/update/${editingPerm.id}`, { name: permName.trim() });
            } else {
                await axios.post(`${API_URL}/create`, { name: permName.trim() });
            }
            fetchPermissions();
            handleClose();
        } catch (error) {
            console.error('Error saving permission:', error);
            alert(error.response?.data?.error || 'Failed to save permission');
        }
    };

    const handleDelete = async (id) => {
        if (id <= 12) {
            alert('Default permissions cannot be deleted');
            return;
        }

        if (window.confirm('Are you sure you want to delete this permission?')) {
            try {
                await axios.delete(`${API_URL}/delete/${id}`);
                fetchPermissions();
            } catch (error) {
                console.error('Error deleting permission:', error);
                alert('Failed to delete permission');
            }
        }
    };

    // Filter and Paginate
    const filteredPermissions = permissions.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRecords = filteredPermissions.length;
    const paginatedPermissions = filteredPermissions.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Export Logic
    const handleExportClick = (event) => setExportAnchorEl(event.currentTarget);
    const handleExportClose = () => setExportAnchorEl(null);

    const handleExportData = (type) => {
        handleExportClose();
        if (type === 'csv') {
            const headers = ['SR.NO', 'NAME'];
            const rows = filteredPermissions.map((p, idx) => [idx + 1, p.name]);
            const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `permissions_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Column Toggle Logic
    const handleColumnClick = (event) => setColumnAnchorEl(event.currentTarget);
    const handleColumnClose = () => setColumnAnchorEl(null);
    const toggleColumn = (col) => {
        setColumns(prev => ({ ...prev, [col]: !prev[col] }));
    };

    return (
        <Box>
            {/* Top Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', color: 'text.primary' }}>
                        PERMISSION LIST
                    </Typography>
                    <Box sx={{ bgcolor: 'primary.light', color: 'primary.main', px: 1, py: 0.2, borderRadius: 10, fontSize: '0.7rem', fontWeight: 800, opacity: 0.8 }}>
                        {totalRecords} RECORDS
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: 'none',
                        fontWeight: 600,
                        px: 3
                    }}
                >
                    Create Permission
                </Button>
            </Box>

            {/* Filter Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExportClick}
                        sx={{
                            bgcolor: mode === 'dark' ? 'grey.800' : '#2563eb',
                            textTransform: 'none',
                            borderRadius: 2,
                            boxShadow: 'none',
                            px: 2,
                            '&:hover': { bgcolor: mode === 'dark' ? 'grey.700' : 'primary.dark' }
                        }}
                    >
                        Exports
                    </Button>
                    <Menu
                        anchorEl={exportAnchorEl}
                        open={Boolean(exportAnchorEl)}
                        onClose={handleExportClose}
                    >
                        <MenuItem onClick={() => handleExportData('csv')}>Export as CSV</MenuItem>
                        <MenuItem onClick={() => handleExportData('print')} disabled>Print Table</MenuItem>
                    </Menu>
                    <Button
                        variant="contained"
                        startIcon={<ViewColumnIcon />}
                        onClick={handleColumnClick}
                        sx={{
                            bgcolor: mode === 'dark' ? 'grey.800' : 'grey.600',
                            textTransform: 'none',
                            borderRadius: 2,
                            boxShadow: 'none',
                            px: 2,
                            '&:hover': { bgcolor: mode === 'dark' ? 'grey.700' : 'grey.700' }
                        }}
                    >
                        Columns
                    </Button>
                    <Menu
                        anchorEl={columnAnchorEl}
                        open={Boolean(columnAnchorEl)}
                        onClose={handleColumnClose}
                    >
                        <MenuItem onClick={() => toggleColumn('srNo')}>
                            <Checkbox size="small" checked={columns.srNo} />
                            <ListItemText primary="SR.NO" />
                        </MenuItem>
                        <MenuItem onClick={() => toggleColumn('name')}>
                            <Checkbox size="small" checked={columns.name} />
                            <ListItemText primary="NAME" />
                        </MenuItem>
                        <MenuItem onClick={() => toggleColumn('actions')}>
                            <Checkbox size="small" checked={columns.actions} />
                            <ListItemText primary="ACTIONS" />
                        </MenuItem>
                    </Menu>
                </Box>
                <TextField
                    size="small"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.disabled', fontSize: '1.2rem' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: 300,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: mode === 'dark' ? '#1E293B' : 'background.paper',
                            borderRadius: 2,
                        }
                    }}
                />
            </Box>

            {/* Table */}
            <Paper
                elevation={0}
                sx={{
                    p: 0,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: mode === 'dark' ? '#0F172A' : 'grey.50' }}>
                        <TableRow>
                            {columns.srNo && (
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase' }}>
                                    SR.NO
                                </TableCell>
                            )}
                            {columns.name && (
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase' }}>
                                    NAME
                                </TableCell>
                            )}
                            {columns.actions && (
                                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase' }}>
                                    ACTIONS
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedPermissions.map((item, index) => (
                                <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    {columns.srNo && (
                                        <TableCell sx={{ py: 1.5, color: 'text.primary', fontWeight: 600 }}>
                                            {(page - 1) * rowsPerPage + index + 1}
                                        </TableCell>
                                    )}
                                    {columns.name && (
                                        <TableCell sx={{ py: 1.5, color: 'primary.main', fontWeight: 700, textTransform: 'capitalize' }}>
                                            {item.name}
                                        </TableCell>
                                    )}
                                    {columns.actions && (
                                        <TableCell align="right" sx={{ py: 1.5 }}>
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<EditIcon sx={{ fontSize: '1rem !important' }} />}
                                                    onClick={() => handleOpen(item)}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        borderColor: 'divider',
                                                        color: mode === 'dark' ? 'primary.light' : 'primary.main',
                                                        '&:hover': {
                                                            bgcolor: mode === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'primary.light',
                                                            borderColor: 'primary.main',
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<DeleteIcon sx={{ fontSize: '1rem !important' }} />}
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={item.id <= 12}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        borderColor: 'divider',
                                                        color: mode === 'dark' ? '#fca5a5' : 'error.main',
                                                        '&:hover': {
                                                            bgcolor: mode === 'dark' ? 'rgba(248, 113, 113, 0.1)' : 'error.light',
                                                            borderColor: 'error.main',
                                                        },
                                                        '&.Mui-disabled': {
                                                            borderColor: 'divider',
                                                            opacity: mode === 'dark' ? 0.3 : 0.5
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                        {!loading && paginatedPermissions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={Object.values(columns).filter(v => v).length} align="center" sx={{ py: 8 }}>
                                    <Typography color="text.secondary">No permissions found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Pagination / Footer */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Show:</Typography>
                        <Select
                            value={rowsPerPage}
                            onChange={(e) => { setRowsPerPage(e.target.value); setPage(1); }}
                            size="small"
                            sx={{
                                borderRadius: 1.5,
                                bgcolor: mode === 'dark' ? '#1E293B' : 'white',
                                height: 32,
                                '& .MuiSelect-select': { py: 0.5, fontSize: '0.85rem' }
                            }}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, totalRecords)} of {totalRecords} results
                    </Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                    <Button size="small" variant="outlined" disabled={page === 1} onClick={() => setPage(p => p - 1)} sx={{ minWidth: 40, borderRadius: 1.5, borderColor: 'divider' }}>Prev</Button>
                    {[...Array(Math.ceil(totalRecords / rowsPerPage))].map((_, i) => (
                        <Button
                            key={i}
                            size="small"
                            onClick={() => setPage(i + 1)}
                            sx={{
                                minWidth: 32, borderRadius: 1.5, p: 0,
                                bgcolor: page === i + 1 ? 'primary.main' : 'transparent',
                                color: page === i + 1 ? 'white' : 'text.secondary',
                                border: '1px solid', borderColor: page === i + 1 ? 'primary.main' : 'divider'
                            }}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button size="small" variant="outlined" disabled={page === Math.ceil(totalRecords / rowsPerPage)} onClick={() => setPage(p => p + 1)} sx={{ minWidth: 40, borderRadius: 1.5, borderColor: 'divider' }}>Next</Button>
                </Stack>
            </Box>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>{editingPerm ? 'Edit Permission' : 'Create New Permission'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <TextField fullWidth label="Permission Name" value={permName} onChange={(e) => setPermName(e.target.value)} placeholder="e.g. create report" autoFocus sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleClose} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2, boxShadow: 'none', textTransform: 'none', fontWeight: 600, px: 3 }}>Save Permission</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PermissionDefinitionList;
