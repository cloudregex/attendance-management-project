import { useState } from 'react';
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
    useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, AccountTree, CheckCircleOutline } from '@mui/icons-material';

const AdminLogin = () => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            console.log('Login attempt with:', formData);
            setIsSubmitted(true);
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
            <CssBaseline />

            {/* Left Branding Panel */}
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
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
                {/* Glassmorphism Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: alpha(theme.palette.primary.dark, 0.4),
                        zIndex: 1
                    }}
                />

                <Box sx={{ zIndex: 2, textAlign: 'center', maxWidth: 500 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 2,
                            bgcolor: alpha(theme.palette.common.white, 0.1),
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            mb: 4,
                            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                        }}
                    >
                        <AccountTree sx={{ fontSize: 56, color: theme.palette.primary.light }} />
                    </Box>
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
                        Attendance <span style={{ color: theme.palette.primary.light }}>Pro</span>
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, mb: 6, lineHeight: 1.6 }}>
                        Streamline your workforce management with our next-generation attendance tracking system. Built for scale, security, and simplicity.
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        {[
                            { label: 'Real-time Sync', icon: <CheckCircleOutline sx={{ fontSize: 20 }} /> },
                            { label: 'Cloud Security', icon: <CheckCircleOutline sx={{ fontSize: 20 }} /> },
                            { label: 'AI Analytics', icon: <CheckCircleOutline sx={{ fontSize: 20 }} /> }
                        ].map((item, index) => (
                            <Grid item xs={4} key={index}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ color: theme.palette.primary.light }}>{item.icon}</Box>
                                    <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8 }}>{item.label}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ position: 'absolute', bottom: 40, zIndex: 2, opacity: 0.7 }}>
                    <Typography variant="body2">Trusted by 500+ Enterprises Globally</Typography>
                </Box>
            </Grid>

            {/* Right Login Panel */}
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', // Horizontal centering
                    bgcolor: '#f8fafc'
                }}
            >
                <Container maxWidth="xs" sx={{ p: 0 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'transparent',
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'primary.main',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3,
                                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`
                            }}
                        >
                            <LockOutlined sx={{ color: 'white' }} />
                        </Box>

                        <Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>
                            Admin Access
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', mb: 4, textAlign: 'center' }}>
                            Enter your credentials to manage the workspace.
                        </Typography>

                        {isSubmitted && (
                            <Alert
                                severity="success"
                                sx={{
                                    width: '100%',
                                    mb: 3,
                                    borderRadius: '12px',
                                    fontWeight: 500
                                }}
                            >
                                Success! Redirecting...
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
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        bgcolor: 'white'
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
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        bgcolor: 'white'
                                    }
                                }}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 4 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="rememberMe"
                                            color="primary"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            sx={{ borderRadius: 6 }}
                                        />
                                    }
                                    label={<Typography variant="body2" sx={{ fontWeight: 500, color: '#475569' }}>Remember me</Typography>}
                                />
                                <Link href="#" variant="body2" sx={{ textDecoration: 'none', fontWeight: 600, color: 'primary.main' }}>
                                    Forgot Password?
                                </Link>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{
                                    py: 2,
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    boxShadow: `0 10px 15px -3px ${alpha(theme.palette.primary.main, 0.25)}`,
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                        boxShadow: `0 20px 25px -5px ${alpha(theme.palette.primary.main, 0.3)}`,
                                    }
                                }}
                            >
                                Sign In to Dashboard
                            </Button>

                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    Need assistance?{' '}
                                    <Link href="#" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                                        Contact Support
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Grid>
        </Grid>
    );
};

export default AdminLogin;
