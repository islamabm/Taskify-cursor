import * as React from "react";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnDef
} from "@tanstack/react-table";
import TableColumnsDropDown from "../helpers/tableHelpers/TableColumnsDropDown";
import TableContent from "../helpers/tableHelpers/TableContent";
import { InputTable } from "../helpers/tableHelpers/InputTable";
import { NumberOfRowsTable } from "../helpers/tableHelpers/NumberOfRowsTable";
import TablePagination from "../helpers/tableHelpers/TablePagination";
import { ClearFilterTable } from "../helpers/tableHelpers/ClearFilterTable";
import { TableItemsNumberTitle } from "../helpers/tableHelpers/TableItemsNumberTitle";
import { Button } from "../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { IconWithTooltip } from "../helpers/IconWithTooltip";
import { DownloadToExcelBtnTable } from "../helpers/tableHelpers/DownloadToExcelBtnTable";
import { Product } from "../../types/commonTypes/commonTypes";

import { toastService } from "../../services/toast.service";
import ToastComponent from "../helpers/ToastComponent";
import { useQueryClient } from "@tanstack/react-query";

import ImageModal from "../modals/ImageModal";
import { productsService } from "../../services/products.service";
import { WriteNoteToProduct } from "../modals/WriteNoteToProduct";
import { queryKeysService } from "../../services/queryKeys.service";

interface ProductsTableProps<T> {
    readonly products: Product[];
    readonly columnVisibilityName: string;
    readonly placeHolder: string;
    readonly ticketID: number;
    readonly inputTableName: string;
    readonly filterColumnName: string;
    readonly tableTitle: string;
    readonly columnNames: { [key: string]: string };
    readonly excelConfig: {
        fields: {
            key: string;
            header: string;
            formatter?: (value: any) => any;
        }[];
        fileName: string;
    };
}

export function ProductsTable<T>({
    products,
    ticketID,
    columnVisibilityName,
    placeHolder,
    inputTableName,
    filterColumnName,
    tableTitle,
    columnNames,
    excelConfig,
}: ProductsTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
        const savedColumnVisibility = localStorage.getItem(`columnVisibility${columnVisibilityName}`);
        return savedColumnVisibility ? JSON.parse(savedColumnVisibility) : {};
    });

    const [showImage, setShowImage] = React.useState<boolean>(false);
    const [imageURL, setImageURL] = React.useState<string>('');
    const userID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || '';
    const queryClient = useQueryClient()

    const [toastProps, setToastProps] = React.useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    React.useEffect(() => {
        localStorage.setItem(`columnVisibility${columnVisibilityName}`, JSON.stringify(columnVisibility));
    }, [columnVisibility]);





    function handleCloseImageModal() {
        setShowImage(false);
        setImageURL("");

    }

    function handleShowImage(url: string) {
        setShowImage(true);
        setImageURL(url);
    }



    async function updateProductStatus(productID: number, customStatusID: number) {
        try {
            const productData = {
                "customStatus": {
                    "customStatusID": customStatusID,
                },
            };



            const res = await productsService.updateProduct(productID, productData);
            queryClient.invalidateQueries({ queryKey: [queryKeysService.MARKET_PRODUCTS, ticketID.toString] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, ticketID.toString()] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.MARKET_PRODUCTS, queryKeysService.PROBLEM_PRODUCTS, ticketID.toString()] });
            toastService.showToast(
                setToastProps,
                'Product updated successfully!',
                'success'
            );
            // window.scrollTo(0, 0);

        } catch (error) {
            console.error('Error starting task:', error);

            // Type guard to check if 'error' is an instance of Error
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred';

            // Handle the error gracefully by showing a toast message
            toastService.showToast(
                setToastProps,
                `Error occurred while starting the task. ${errorMessage}. Please pause or end the task and try again.`,
                'destructive'
            );
        } finally {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.MARKET_PRODUCTS, ticketID.toString()] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, ticketID.toString()] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.MARKET_PRODUCTS, queryKeysService.PROBLEM_PRODUCTS, ticketID.toString()] });
        }
    }


    function copyToClipboard(text: string) {
        if (text) {

            navigator.clipboard.writeText(text);
            setToastProps({
                key: Math.random(),
                variant: "success",
                title: "value Copied!",
                description: "The value has been copied to your clipboard.",
            });
        }
    }
    console.log("alooooooooooo")
    const TableTasksColumns: ColumnDef<Product>[] = [

        {
            accessorKey: "combined",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Details
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div>
                        <strong>Name:</strong> {row.original.prodName || "N/A"}
                        <IconWithTooltip iconName="Copy" tooltipTitle="Copy" onClick={() => copyToClipboard(row.original.prodName)} />
                    </div>
                    <div>
                        <strong>Price:</strong> {row.original.price || "N/A"}
                        <IconWithTooltip iconName="Copy" tooltipTitle="Copy" onClick={() => copyToClipboard((row.original.price).toString())} />
                    </div>
                    <div>
                        <strong>Barcode:</strong> {row.original.barcode || "N/A"}
                        <IconWithTooltip iconName="Copy" tooltipTitle="Copy" onClick={() => copyToClipboard(row.original.barcode)} />
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "categories",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Categories
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div>
                        <strong>Category:</strong> {row.original.category || "N/A"}
                        <IconWithTooltip iconName="Copy" tooltipTitle="Copy" onClick={() => copyToClipboard(row.original.category)} />
                    </div>
                    <div>
                        <strong>Sub category:</strong> {row.original.subCategory || "N/A"}
                        <IconWithTooltip iconName="Copy" tooltipTitle="Copy" onClick={() => copyToClipboard(row.original.subCategory)} />
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "bussNotes",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Buss notes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    {row.original.bussNotes || "N/A"}
                    <IconWithTooltip iconName="Copy" tooltipTitle="Copy" onClick={() => copyToClipboard(row.original.bussNotes)} />
                </div>
            ),
        },
        {
            accessorKey: "employeeNotes",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Employee notes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    {row.original.employeeNotes || "N/A"}
                    <IconWithTooltip iconName="Copy" tooltipTitle="Copy" onClick={() => copyToClipboard(row.original.employeeNotes)} />
                </div>
            ),
        },
        {
            accessorKey: "image",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Image
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {/* {row.original.imageURL ? `${row.original.imageURL.substring(0, 20)}...` : "N/A"} */}
                    <img src={row.original.imageURL} alt="product" className="w-20 h-20 rounded-full" />

                </div>
            ),
        },

        {
            accessorKey: "imageURL",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Image URL
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    {row.original.imageURL ? `${row.original.imageURL.substring(0, 20)}...` : "N/A"}
                    <IconWithTooltip iconName="Copy" tooltipTitle="Copy" onClick={() => {
                        navigator.clipboard.writeText(row.original.imageURL);
                        setToastProps({
                            key: Math.random(),
                            variant: "success",
                            title: "Image URL Copied!",
                            description: "The image URL has been copied to your clipboard.",
                        });
                    }} />
                </div>
            ),
        },



        {
            accessorKey: "Actions",
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center gap-2">

                    <IconWithTooltip iconName="Image" tooltipTitle="View Image" onClick={() => {
                        handleShowImage(info.row.original.imageURL)
                    }} />
                    <IconWithTooltip iconName="Highlighter" tooltipTitle="Mark as done" onClick={() => updateProductStatus(info.row.original.productID, 16)} />
                    <WriteNoteToProduct productID={info.row.original.productID} ticketID={ticketID} />


                </div>

            )
        },

        {
            accessorKey: "productIndex",
            header: 'Index',
            cell: (info) => (
                <div className="flex items-center gap-2 font-bold text-xl">

                    {info.row.index + 1}


                </div>

            )
        },





    ]


    const table = useReactTable({
        data: products,
        columns: TableTasksColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        initialState: {
            pagination: {
                pageSize: 800,
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    function clearFiltering() {
        table.getColumn(filterColumnName)?.setFilterValue("");
    }

    return (
        <div className="w-full p-10">

            <TableItemsNumberTitle numberOfItems={table.getFilteredRowModel().rows.length} title={tableTitle} />
            <div className="flex items-center py-4 justify-between">
                <div className="flex items-center gap-4">
                    <InputTable table={table} placeHolder={placeHolder} filterColumnName={filterColumnName} name={inputTableName} />
                    <ClearFilterTable onClick={clearFiltering} />
                </div>
                <div className="flex items-center gap-4">
                    <TableColumnsDropDown table={table} columnNamesProps={columnNames} />
                    <DownloadToExcelBtnTable table={table} excelConfig={excelConfig} />
                </div>
            </div>
            <TableContent table={table} />
            <div className="flex items-center justify-end space-x-2 py-4">
                <NumberOfRowsTable table={table} />
                <TablePagination table={table} />
            </div>
            {
                showImage && <ImageModal imageUrl={imageURL} onClose={handleCloseImageModal} />
            }
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}
        </div>
    );
}