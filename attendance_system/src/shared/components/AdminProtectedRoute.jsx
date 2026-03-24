import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminProtectedRoute = ({ children }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('adminToken');
            
            if (!token) {
                setIsAuthenticated(false);
                setIsVerifying(false);
                return;
            }

            try {
                const response = await fetch(`${API}/admin/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('adminToken');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Verification failed', error);
                setIsAuthenticated(false);
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, []);

    if (isVerifying) {
        return <div>Verifying Authentication...</div>; // Add a proper loader if needed
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminProtectedRoute;
