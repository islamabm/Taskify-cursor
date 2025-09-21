import React, { useMemo } from 'react';
import LinksList from '../helpers/links/LinksList';
import { ManageTaskTypeAndPriority } from './ManageTaskTypeAndPriority';

// Define constants for user types
const USER_TYPES = {
    DASHBOARD: '7',
    REGULAR_EMPLOYEE: '6',
    SUPER_ADMIN: '3',
    SHIFT_MANAGER: '5',
    ADMIN: '4',
    BUSINESSES_DATA_ACCESS: '10',
};

// Define constants for route names
const ROUTES = {
    DASHBOARD: 'DASHBOARD',
    TASKS: 'TASKS',
    LOGS: 'LOGS',
    STATISTICS: 'STATISTICS',
    BUSINESSESDATA: 'BUSINESSESDATA',
    CAMPAIGNS: 'CAMPAIGNS'
};

// Define the links associated with each user type
const USER_LINKS_MAP = {
    [USER_TYPES.DASHBOARD]: [
        { domName: 'Dashboard', routeName: ROUTES.DASHBOARD },
    ],
    [USER_TYPES.BUSINESSES_DATA_ACCESS]: [
        { domName: 'Businesses data', routeName: ROUTES.BUSINESSESDATA },
    ],
    [USER_TYPES.REGULAR_EMPLOYEE]: [
        { domName: 'Tasks', routeName: ROUTES.TASKS },
        { domName: 'Campaigns', routeName: ROUTES.CAMPAIGNS },

    ],
    [USER_TYPES.SUPER_ADMIN]: [
        { domName: 'Tasks', routeName: ROUTES.TASKS },
        { domName: 'Dashboard', routeName: ROUTES.DASHBOARD },
        { domName: 'Reports', routeName: ROUTES.LOGS },
        { domName: 'Statistics', routeName: ROUTES.STATISTICS },
        { domName: 'Businesses data', routeName: ROUTES.BUSINESSESDATA },

        { domName: 'Campaigns', routeName: ROUTES.CAMPAIGNS },

    ],
    [USER_TYPES.SHIFT_MANAGER]: [
        { domName: 'Tasks', routeName: ROUTES.TASKS },
        { domName: 'Dashboard', routeName: ROUTES.DASHBOARD },
        { domName: 'Reports', routeName: ROUTES.LOGS },
        { domName: 'Statistics', routeName: ROUTES.STATISTICS },
        { domName: 'Campaigns', routeName: ROUTES.CAMPAIGNS },
    ],
    [USER_TYPES.ADMIN]: [
        { domName: 'Tasks', routeName: ROUTES.TASKS },
        { domName: 'Dashboard', routeName: ROUTES.DASHBOARD },
        { domName: 'Reports', routeName: ROUTES.LOGS },
        { domName: 'Statistics', routeName: ROUTES.STATISTICS },
        { domName: 'Campaigns', routeName: ROUTES.CAMPAIGNS },

    ],
};

// Default links if user type doesn't match any predefined types
const DEFAULT_LINKS = [
    { domName: 'Tasks', routeName: ROUTES.TASKS },
    { domName: 'Dashboard', routeName: ROUTES.DASHBOARD },
    { domName: 'Reports', routeName: ROUTES.LOGS },
    { domName: 'Statistics', routeName: ROUTES.STATISTICS },
    { domName: 'Campaigns', routeName: ROUTES.CAMPAIGNS },

];

// Utility function to get user type from localStorage
const getUserTypeID = () => {
    const storedType = localStorage.getItem('USERTYPEID_TASKIFY');
    return storedType ? storedType.replace(/^"|"$/g, '') : '';
};

export default function AppHeaderLinks() {
    const userTypeID = useMemo(() => getUserTypeID(), []);

    const linksArr = useMemo(() => {
        return USER_LINKS_MAP[userTypeID] || DEFAULT_LINKS;
    }, [userTypeID]);

    return (
        <header className="flex items-center gap-8 py-4 px-6 bg-gray-800 rounded-lg shadow-lg">
            <nav>
                <LinksList linksArr={linksArr} />
            </nav>
            <ManageTaskTypeAndPriority />
        </header>
    );
}
