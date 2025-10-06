import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, isAuthenticated, hasRole } from '../utils/auth';

interface ProtectedRouteProps {
    roles?: string[];
    fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, fallbackPath = '/unauthorized' }) => {
    const token = getToken();

    if (!token || !isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!roles || roles.length === 0) {
        return <Outlet />;
    }

    const allowed = hasRole(roles);
    return allowed ? <Outlet /> : <Navigate to={fallbackPath} replace />;
};

export default ProtectedRoute;