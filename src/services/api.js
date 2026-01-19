const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = sessionStorage.getItem('edujobapp_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401) {
            // Token expired or invalid
            sessionStorage.removeItem('edujobapp_token');
            sessionStorage.removeItem('edujobapp_user');
            window.location.href = '/login';
        }
        const error = await response.text();
        throw new Error(error || 'Something went wrong');
    }
    return response.json();
};

const api = {
    auth: {
        login: async (credentials) => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            return handleResponse(response);
        },
        register: async (userData) => {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            return handleResponse(response);
        },
        getMe: async () => {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: getHeaders(),
            });
            return handleResponse(response);
        }
    },
    dashboard: {
        getStats: async () => {
            const response = await fetch(`${API_URL}/dashboard`, {
                headers: getHeaders(),
            });
            return handleResponse(response);
        }
    },
    applications: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/applications`, {
                headers: getHeaders(),
            });
            return handleResponse(response);
        },
        create: async (data) => {
            const response = await fetch(`${API_URL}/applications`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        }
    },
    companies: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/companies`, {
                headers: getHeaders(),
            });
            return handleResponse(response);
        },
        create: async (data) => {
            const response = await fetch(`${API_URL}/companies`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        }
    },
    documents: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/documents`, {
                headers: getHeaders(),
            });
            return handleResponse(response);
        },
        upload: async (formData) => {
            const token = sessionStorage.getItem('edujobapp_token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            // Do NOT set Content-Type, let browser set boundary
            
            const response = await fetch(`${API_URL}/documents/upload`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });
            return handleResponse(response);
        },
        download: async (id) => {
            const response = await fetch(`${API_URL}/documents/${id}/download`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error("Download failed");
            return response.blob();
        }
    },
    jobs: {
        getAll: async () => {
            // Public endpoint, no authentication needed
            const response = await fetch(`${API_URL}/public/jobs`);
            return handleResponse(response);
        }
    }
};

export default api;
