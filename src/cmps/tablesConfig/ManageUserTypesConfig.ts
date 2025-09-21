export const columnNames: { [key: string]: string } = {
    // departmentID: "Department ID",
    userType: "User type",
    actions: "actions",
};
export const excelConfig = {
    fields: [
        // { key: 'departmentID', header: 'Department ID' },
        { key: 'userType', header: 'User type' },

    ],
    fileName: 'UserTypes.xlsx'
};