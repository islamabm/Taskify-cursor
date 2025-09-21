import React from 'react';
import { utilService } from '../services/util.service';
import { Navigate } from 'react-router-dom';
import { routeService } from '../services/route.service';

interface ProtectedRouteProps {
    allowedRoles: string[];
    children: React.ReactNode; // Add children prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const userType = utilService.getLocalStorageValue('USERTYPEID_TASKIFY');

    if (!allowedRoles.includes(userType)) {
        return <Navigate to={routeService.TASKS} replace />;
    }

    // Render children if the userType is included in allowedRoles
    return <>{children}</>;
};

export default ProtectedRoute;
