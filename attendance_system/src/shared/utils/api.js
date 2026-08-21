const BASE_URL = 'http://localhost:5000/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const api = {
    get: (endpoint, options = {}) => api.request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options = {}) => api.request(endpoint, { ...options, method: 'DELETE' }),

    request: async (endpoint, options = {}) => {
        let token = localStorage.getItem('adminToken');
        
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
            credentials: 'true' === import.meta.env.VITE_USE_CREDENTIALS ? 'include' : 'same-origin', // Fallback, but let's use include for refresh
        };
        
        // Ensure credentials are included for cookies
        config.credentials = 'include';

        try {
            let response = await fetch(`${BASE_URL}${endpoint}`, config);
            
            if (response.status === 401 && !options._retry) {
                if (isRefreshing) {
                    return new Promise(function(resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        const newConfig = {
                            ...config,
                            headers: {
                                ...config.headers,
                                'Authorization': `Bearer ${token}`
                            }
                        };
                        return fetch(`${BASE_URL}${endpoint}`, newConfig);
                    }).catch(err => {
                        throw err;
                    });
                }

                options._retry = true;
                isRefreshing = true;

                try {
                    const refreshRes = await fetch(`${BASE_URL}/admin/refresh-token`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include'
                    });
                    
                    if (refreshRes.ok) {
                        const data = await refreshRes.json();
                        localStorage.setItem('adminToken', data.accessToken);
                        
                        processQueue(null, data.accessToken);
                        
                        // Retry original request
                        const newConfig = {
                            ...config,
                            headers: {
                                ...config.headers,
                                'Authorization': `Bearer ${data.accessToken}`
                            }
                        };
                        return await fetch(`${BASE_URL}${endpoint}`, newConfig);
                    } else {
                        throw new Error('Refresh token failed');
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    console.warn('Session expired or unauthorized, logging out...');
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    window.location.href = '/login';
                    throw refreshError;
                } finally {
                    isRefreshing = false;
                }
            }

            return response;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }
};

export default api;
