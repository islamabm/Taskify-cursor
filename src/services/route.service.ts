// routes.ts

// נשמור על שמות בקונבנציית SCREAMING_SNAKE_CASE ובאחידות בין interface לאובייקט
export interface RouteService {
    [key: string]: string; // מאפשר גישה דינמית במידת הצורך

    // Auth / Shell
    LOGIN: string;
    HOME: string;
    DASHBOARD: string;
    PROFILE: string;

    // Employees
    EMPLOYEES: string;
    EMPLOYEE_TYPES: string;
    EMPLOYEE_STATUSES: string;

    // Tasks
    TASKS: string;
    TASK_TYPES: string;
    TASK_PRIORITY_LEVELS: string;
    CREATE: string;
    TASK_STATUSES: string;

    // Departments
    DEPARTMENTS: string;
    SUBDEPARTMENTS: string;


    // Reports / Analytics
    REPORTS: string;
    WORKLOGS_BY_TICKET_ID: string;
    STATISTICS: string;

    // Businesses / Catalog
    BUSINESSES: string;
    BUSINESSES_DATA: string;
    SHEET_PRODUCTS: string;
    PROBLEM_PRODUCTS: string;

    // Campaigns
    CAMPAIGNS: string;
    CAMPAIGN_DETAILS: string;
}

// קיבוץ לפי היררכיה של נתיבים (בסיס ואז תתי־מסכים)
export const routeService = {
    // Auth / Shell
    LOGIN: '/',
    HOME: '/home',
    DASHBOARD: '/real-time-work',
    PROFILE: '/profile',

    // Employees
    USERS: '/users',
    USER_TYPES: '/user/types',
    USER_STATUSES: '/user/statuses',

    // Tasks
    TASKS: '/tasks',
    CREATE: '/create',
    TASK_TYPES: '/task/types',
    TASK_PRIORITY_LEVELS: '/task/priority-levels',
    TASK_STATUSES: '/task/statuses',

    // Departments
    DEPARTMENTS: '/departments',
    SUBDEPARTMENTS: '/departments/sub',



    // Reports / Analytics
    REPORTS: '/reports',
    WORKLOGS_BY_TICKET_ID: '/reports/by-ticket-id',
    STATISTICS: '/statistics',

    // Businesses / Catalog
    BUSINESSES: '/businesses',
    BUSINESSES_DATA: '/businesses-data',
    SHEET_PRODUCTS: '/task/products',
    PROBLEM_PRODUCTS: '/task/stuck-products',
    // Campaigns
    CAMPAIGNS: '/campaigns',
    CAMPAIGN_DETAILS: '/campaign/details',
} as const satisfies RouteService;
