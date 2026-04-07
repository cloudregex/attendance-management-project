import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
    Alert,
    Grid,
    Paper,
    CssBaseline,
    Container,
    alpha,
    useTheme,
    CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, AccountTree, CheckCircleOutline } from '@mui/icons-material';

const AdminLogin = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@[a-zA-Z][\w.-]*\.[a-zA-Z]{2,}/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            setLoginError(''); // Clear previous login errors
            try {
                const response = await fetch('http://localhost:5000/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Login success:', data);
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminEmail', data.admin.email);
                    localStorage.setItem('adminRole', data.admin.roleId || 'admin');
                    localStorage.setItem('adminPermissions', JSON.stringify(data.admin.role || {}));
                    setIsSubmitted(true);
                    setLoginError('');
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                } else {
                    setLoginError(data.message || 'Invalid email or password');
                }
            } catch (error) {
                console.error('Login error:', error);
                setLoginError('Server connection failed. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <Box component="main" sx={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
            <CssBaseline />

            {/* Left Panel: Box Root (Branding Content) */}
            <Box
                sx={{
                    width: '50%',
                    position: 'relative',
                    background: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2070')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    p: 6,
                }}
            >
                {/* Visual Accent Layer */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: alpha(theme.palette.primary.dark, 0.35),
                        zIndex: 1
                    }}
                />

                <Box sx={{ zIndex: 2, textAlign: 'center', maxWidth: 520 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 2,
                            bgcolor: alpha(theme.palette.common.white, 0.1),
                            backdropFilter: 'blur(12px)',
                            borderRadius: '24px',
                            mb: 4,
                            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                        }}
                    >
                        <AccountTree sx={{ fontSize: 64, color: theme.palette.primary.light }} />
                    </Box>
                    <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 900, letterSpacing: '-2px', fontSize: { md: '3.5rem', lg: '4rem' } }}>
                        Attendance <span style={{ color: theme.palette.primary.light }}>Pro</span>
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300, mb: 6, lineHeight: 1.6, color: alpha('#fff', 0.8) }}>
                        Streamline your workforce management with our next-generation attendance tracking system. Built for scale, security, and simplicity.
                    </Typography>

                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        {[
                            { label: 'Real-time Sync', icon: <CheckCircleOutline sx={{ fontSize: 24 }} /> },
                            { label: 'Cloud Security', icon: <CheckCircleOutline sx={{ fontSize: 24 }} /> },
                            { label: 'AI Analytics', icon: <CheckCircleOutline sx={{ fontSize: 24 }} /> }
                        ].map((item, iconIdx) => (
                            <Grid item xs={4} key={iconIdx}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ color: theme.palette.primary.light, display: 'flex', p: 1.5, bgcolor: alpha('#fff', 0.1), borderRadius: '50%' }}>{item.icon}</Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.9, letterSpacing: '0.5px' }}>{item.label}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ position: 'absolute', bottom: 40, zIndex: 2, opacity: 0.8 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, letterSpacing: '1px' }}>Trusted by 500+ Enterprises Globally</Typography>
                </Box>
            </Box>

            {/* Right Panel: Grid Root (Login Content) */}
            <Grid
                container
                xs={12}
                md={6}
                sx={{
                    width: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f8fafc',
                    px: { xs: 2, md: 4 }
                }}
            >
                <Box
                    sx={{
                        p: { xs: 4, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        bgcolor: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                        width: '100%',
                        maxWidth: '460px',
                    }}
                >
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            bgcolor: 'primary.main',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}
                    >
                        <LockOutlined sx={{ color: 'white', fontSize: 32 }} />
                    </Box>

                    <Typography component="h1" variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#1e293b', textAlign: 'center' }}>
                        Admin Access
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 4, textAlign: 'center', fontSize: '1.05rem' }}>
                        Enter your credentials to manage the workspace.
                    </Typography>

                    {isSubmitted && (
                        <Alert
                            severity="success"
                            sx={{
                                width: '100%',
                                mb: 3,
                                borderRadius: '14px',
                                fontWeight: 600
                            }}
                        >
                            Success! Redirecting...
                        </Alert>
                    )}

                    {loginError && (
                        <Alert
                            severity="error"
                            sx={{
                                width: '100%',
                                mb: 3,
                                borderRadius: '14px',
                                fontWeight: 600
                            }}
                            onClose={() => setLoginError('')}
                        >
                            {loginError}
                        </Alert>
                    )}
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={{
                                mb: 1.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '14px',
                                    bgcolor: '#f1f5f9',
                                    '&:hover': { bgcolor: '#e2e8f0' },
                                    '&.Mui-focused': { bgcolor: 'white' },
                                    '& input': {
                                        color: '#000000', // Ensure text is black
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0 1000px #f1f5f9 inset',
                                        WebkitTextFillColor: '#000000',
                                        borderRadius: 'inherit'
                                    }
                                }
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 1.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '14px',
                                    bgcolor: '#f1f5f9',
                                    '&:hover': { bgcolor: '#e2e8f0' },
                                    '&.Mui-focused': { bgcolor: 'white' },
                                    '& input': {
                                        color: '#000000', // Ensure text is black
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0 1000px #f1f5f9 inset',
                                        WebkitTextFillColor: '#000000',
                                        borderRadius: 'inherit'
                                    }
                                }
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 3.5 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="rememberMe"
                                        color="primary"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        sx={{ borderRadius: 8 }}
                                    />
                                }
                                label={<Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>Remember me</Typography>}
                            />
                            <Link href="#" variant="body2" sx={{ textDecoration: 'none', fontWeight: 700, color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
                                Forgot Password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                py: 1.8,
                                borderRadius: '14px',
                                fontSize: '1rem',
                                fontWeight: 800,
                                textTransform: 'none',
                                boxShadow: `0 10px 20px -5px ${alpha(theme.palette.primary.main, 0.4)}`,
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                    boxShadow: `0 15px 25px -5px ${alpha(theme.palette.primary.main, 0.5)}`,
                                    transform: 'translateY(-1px)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to Dashboard'}
                        </Button>

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                Need assistance?{' '}
                                <Link href="#" sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main' }}>
                                    Contact Support
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Box>
    );
};

export default AdminLogin;
