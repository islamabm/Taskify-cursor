export const columnNames: { [key: string]: string } = {
    // departmentID: "Department ID",
    ticketType: "Task type",
    actions: "actions",
};
export const excelConfig = {
    fields: [
        // { key: 'departmentID', header: 'Department ID' },
        { key: 'ticketType', header: 'Task type' },

    ],
    fileName: 'TaskTypes.xlsx'
};