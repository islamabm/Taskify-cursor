import React from 'react';
import { NavLink } from "react-router-dom";
import { routeService } from '../../../services/route.service';

interface LinksPreviewProps {
    readonly domName: string;
    readonly routeName: string;
    readonly queryParams?: URLSearchParams;
}

export function LinksPreview({ domName, routeName, queryParams }: LinksPreviewProps) {
    const path = queryParams ? `${routeService[routeName]}/?${queryParams.toString()}` : routeService[routeName];

    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors duration-300 ${isActive ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
            }
        >
            {domName}
        </NavLink>
    );
}
