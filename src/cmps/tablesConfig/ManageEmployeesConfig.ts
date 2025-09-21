
export const columnNames: { [key: string]: string } = {
    fullName: "User name",
    email: "Email",
    phone1: "Phone",
    departmentName: "Department",
    userType: "User type",
    userStatus: "Status",
    actions: "actions",
};
export const excelConfig = {
    fields: [
        { key: 'fullName', header: 'User name' },
        { key: 'email', header: 'Email' },
        { key: 'phone1', header: 'Phone' },
        { key: 'departmentName', header: 'Department' },
        { key: 'userType', header: 'User type' },
        { key: 'userStatus', header: 'Status' },
    ],
    fileName: 'Employees.xlsx'
};
