import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, isAuthenticated, hasRole } from '../utils/auth';

interface ProtectedRouteProps {
    roles?: string[]; // allowed roles (if omitted => any authenticated user)
    fallbackPath?: string; // where to redirect when unauthorized
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, fallbackPath = '/unauthorized' }) => {
    const token = getToken();

    if (!token || !isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // no roles requirement -> any authenticated user is allowed
    if (!roles || roles.length === 0) {
        return <Outlet />;
    }

    // check role
    const allowed = hasRole(roles);
    return allowed ? <Outlet /> : <Navigate to={fallbackPath} replace />;
};

export default ProtectedRoute;