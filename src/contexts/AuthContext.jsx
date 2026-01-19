import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('edujobapp_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('edujobapp_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await api.auth.login(credentials);
        // Assuming backend returns { token: "...", user: {...} } or similar
        // Adjust based on actual backend response structure from previous learnings
        // Previous learning said data.token
        const newToken = data.accessToken || data.token;

        sessionStorage.setItem('edujobapp_token', newToken);
        setToken(newToken);

        // If the login response doesn't contain full user details, fetch them
        // But let's assume valid token allows fetching me
        const userData = await api.auth.getMe();
        setUser(userData);
        sessionStorage.setItem('edujobapp_user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('edujobapp_token');
        sessionStorage.removeItem('edujobapp_user');
    };

    const register = async (userData) => {
        return await api.auth.register(userData);
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
