interface QueryKeysService {
    [key: string]: string; // This allows dynamic property access
    TASKS: string;
    USERS: string;
    BUSINESSES: string;
    TASK_STATUSES: string;
    USER_TYPES: string;
    TASK_TYPES: string;
    SUB_DEPARTMENTS: string;
    DEPARTMENTS: string;
    DEPARTMENTS2: string;
    MARKET_PRODUCTS: string;
    DASHBOARD: string;
    PRIORITY_LEVELS: string;
    USER_STATUSES: string;
    TICKET: string;
    PARTNERS: string;
    LOGS: string;
    WORK_LOGS_BY_TICKET_ID: string;
    USER_INFO: string;

    PROBLEM_PRODUCTS: string,



}


export const queryKeysService: QueryKeysService = {
    TASKS: 'tasks',
    USERS: 'users',
    BUSINESSES: 'businesses',
    TASK_STATUSES: 'taskStatuses',
    WORK_LOGS_BY_TICKET_ID: 'workLogsByTicketId',
    USER_TYPES: 'userTypes',
    TASK_TYPES: 'taskTypes',
    DASHBOARD: "dashboardData",
    MARKET_PRODUCTS: "marketProductsSheet",
    PROBLEM_PRODUCTS: "problemProducts",
    TICKET: "ticket",
    USER_INFO: "ticket",
    PARTNERS: "partners",
    LOGS: "logs",

    SUB_DEPARTMENTS: 'sub-departments-manage',
    DEPARTMENTS: 'departments',
    DEPARTMENTS2: "departments2",

    PRIORITY_LEVELS: 'priority-levels',
    USER_STATUSES: 'userStatuses',


}
