const BASE_URL = 'http://localhost:5000/api';

const api = {
    get: (endpoint, options = {}) => api.request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options = {}) => api.request(endpoint, { ...options, method: 'DELETE' }),

    request: async (endpoint, options = {}) => {
        const token = localStorage.getItem('adminToken');
        
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, config);
            
            if (response.status === 401) {
                // Token expired or invalid - handled by ProtectedRoute usually, 
                // but good to clear here
                localStorage.removeItem('adminToken');
                // We don't necessarily want to redirect here if we're in the middle of a check
            }

            return response;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }
};

export default api;
