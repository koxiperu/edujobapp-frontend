import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = user?.role === 'ADMIN';

    if (adminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!adminOnly && isAdmin) {
        return <Navigate to="/users-management" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
