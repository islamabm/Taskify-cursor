export const columnNames: { [key: string]: string } = {
    // departmentID: "Department ID",
    priorityLevel: "Priority level",
    actions: "actions",
};
export const excelConfig = {
    fields: [
        // { key: 'departmentID', header: 'Department ID' },
        { key: 'priorityLevel', header: 'Priority level' },

    ],
    fileName: 'Priority.xlsx'
};