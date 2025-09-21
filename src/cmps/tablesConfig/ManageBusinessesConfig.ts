export const columnNames: { [key: string]: string } = {

    actions: "actions",
};
export const excelConfig = {
    fields: [
        { key: 'marketName', header: 'Market Name' },
        { key: 'HaatBussID', header: 'Haat Buss ID' },
        { key: 'phone1', header: 'Phone 1' },
        { key: 'phone2', header: 'Phone 2' },
        { key: 'logoURL', header: 'Logo URL' },

    ],
    fileName: 'Businesses.xlsx'
};