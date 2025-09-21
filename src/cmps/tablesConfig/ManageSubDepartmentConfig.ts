export const columnNames: { [key: string]: string } = {
    // departmentID: "Department ID",
    // subDepartmentID: "Sub-Department ID",
    departmentName: "Department name",
    // subDepartmentName: "Sub-department name",
    actions: "actions",
};
export const excelConfig = {
    fields: [
        // { key: 'departmentID', header: 'Department ID' },
        // { key: 'subDepartmentID', header: 'Sub-Department ID' },
        // { key: 'subDepartmentName', header: 'Sub-department name' },
        { key: 'departmentName', header: 'Department name' },

    ],
    fileName: 'Sub-Department.xlsx'
};

