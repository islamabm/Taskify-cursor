export const columnNames: { [key: string]: string } = {
    // departmentID: "Department ID",
    departmentName: "Department name",
    actions: "actions",
};
export const excelConfig = {
    fields: [
        // { key: 'departmentID', header: 'Department ID' },
        { key: 'departmentName', header: 'Department name' },

    ],
    fileName: 'Departments.xlsx'
};