"use client";

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
import { Business } from "../../types/commonTypes/commonTypes";
import { DownloadToExcelBtnTable } from "../helpers/tableHelpers/DownloadToExcelBtnTable";
import { DeleteValidationModal } from "../modals/DeleteValidationModal";
import { AddBusinessModal } from "../modals/AddBusinessModal";
import { EditBusinessModal } from "../modals/EditBusinessModal";

interface BusinessTableProps<T> {
    readonly businesses: Business[];
    readonly columnVisibilityName: string;
    readonly placeHolder: string;
    readonly inputTableName: string
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

export function BusinessTable<T>({ businesses, columnVisibilityName, placeHolder, filterColumnName, tableTitle, columnNames, inputTableName, excelConfig }: BusinessTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);



    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
        const savedColumnVisibility = localStorage.getItem(`columnVisibility${columnVisibilityName}`);
        return savedColumnVisibility ? JSON.parse(savedColumnVisibility) : {};
    });


    React.useEffect(() => {
        localStorage.setItem(`columnVisibility${columnVisibilityName}`, JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    const [rowSelection, setRowSelection] = React.useState({});





    const TableBusinessesColumns: ColumnDef<Business>[] = [

        {
            accessorKey: "marketName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Business name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{row.getValue("marketName")}</div>,
        },
        {
            accessorKey: "Image", // New combined column
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Image                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div
                        className="w-16 h-16"

                    >
                        <img
                            src={row.original.logoURL ? row.original.logoURL : "https://haatdaas.lan-wan.net/daas/images/drLogo.png"}
                            className="rounded-full w-full h-full object-cover"
                            alt="business-logo"
                        />
                    </div>

                </div>
            ),
        },
        {
            accessorKey: "HaatBussID",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Business ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{row.getValue("HaatBussID")}</div>,
        },



        {
            accessorKey: "businessPhones", // New combined column
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Business phones                    <ArrowUpDown className="ml-2 h-4 w-4" />
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div>{row.original.phone1 || "N/A"}</div>
                    <div>{row.original.phone2 || "N/A"}</div>

                </div>
            ),
        },


        {
            accessorKey: "Actions",
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center  gap-2">
                    <EditBusinessModal businessData={info.row.original} />
                    <DeleteValidationModal tooltipTitle='Delete business' alertDialogTitle='Are you sure you want to delete this business?' whichCmp='business' usefulVariable={info.row.original.marketID} queryOptionalVariable='employeeId' />
                </div>)
        },





    ]


    const table = useReactTable({
        data: businesses, // Only pass the array of Business objects
        columns: TableBusinessesColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    function clearFiltering() {
        table.getColumn(filterColumnName)?.setFilterValue("");
    }



    return (
        <div className="w-full p-10">

            <AddBusinessModal />
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


        </div>
    );
}
