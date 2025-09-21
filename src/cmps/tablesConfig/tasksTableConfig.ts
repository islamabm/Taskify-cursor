// src/config/tasksTableConfig.ts
export const columnNames: { [key: string]: string } = {
    businessName: "Business name",
    businessID: "Business ID",
    departmentName: "Department name",
    subDepartmentName: "Sub-department name",
    employeeName: "Employee name",
    status: "Status",
    priority: "Priority",
    type: "Type",
    quantity: "Quantity",
    notes: "Notes",
    createdDateTime: "Created date time",
    startTime: "Start time",
    endTime: "End time",
    actions: "Actions",
};

export const excelConfig = {
    fields: [
        { key: 'businessName', header: 'Business name' },
        { key: 'businessID', header: 'Business ID' },
        { key: 'employeeName', header: 'Employee name' },
        { key: 'departmentName', header: 'Department name' },
        { key: 'subDepartmentName', header: 'Sub-department name' },
        { key: 'status', header: 'Status' },
        { key: 'priority', header: 'Priority' },
        { key: 'type', header: 'Type' },
        { key: 'quantity', header: 'Quantity' },
        { key: 'notes', header: 'Notes' },
        { key: 'createdDateTime', header: 'Created date time' },
        { key: 'startTime', header: 'Start time' },
        { key: 'endTime', header: 'End time' },
    ],
    fileName: 'Tasks.xlsx'
};
