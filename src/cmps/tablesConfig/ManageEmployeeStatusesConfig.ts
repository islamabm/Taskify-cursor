
export const columnNames: { [key: string]: string } = {
    // statusID: "Status ID",
    userStatus: "Status",
    actions: "actions",
};
export const excelConfig = {
    fields: [
        // { key: 'statusID', header: 'Status ID' },
        { key: 'userStatus', header: 'Status' },

    ],
    fileName: 'EmployeeStatuses.xlsx'
};
