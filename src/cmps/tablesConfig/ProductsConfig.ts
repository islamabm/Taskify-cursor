
export const columnNames: { [key: string]: string } = {
    prodName: "Product Name",
    price: "Price",
    barcode: "Barcode",
    imageURL: "Image",

};
export const excelConfig = {
    fields: [
        { key: 'prodName', header: 'Name' },
        { key: 'price', header: 'Price' },
        { key: 'barcode', header: 'Barcode' },
        { key: 'imageURL', header: 'Image' },

    ],
    fileName: 'Products.xlsx'
};
