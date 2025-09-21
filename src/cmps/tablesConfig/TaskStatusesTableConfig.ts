
export const columnNames: { [key: string]: string } = {
    // statusID: "Status ID",
    customStatus: "Status",

    actions: "actions",
};
export const excelConfig = {
    fields: [
        // { key: 'statusID', header: 'Status ID' },
        { key: 'customStatus', header: 'Status' },
        { key: 'orderOfDisplay', header: 'Order of Display' },
        { key: 'type', header: 'type' },

    ],
    fileName: 'TaskStatuses.xlsx'
};