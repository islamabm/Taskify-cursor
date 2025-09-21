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
import { IconWithTooltip } from "../helpers/IconWithTooltip";
import { User } from "../../types/commonTypes/commonTypes";
import { DownloadToExcelBtnTable } from "../helpers/tableHelpers/DownloadToExcelBtnTable";
import { EditEmployeeModal } from "../modals/EditEmployeeModal";
import { EditPasswordModal } from "../modals/EditPasswordModal";
import { DeleteValidationModal } from "../modals/DeleteValidationModal";
import { AddEmployeeModal } from "../modals/AddEmployeeModal";


interface EmployeesTableProps<T> {
    readonly employees: User[];
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

export function EmployeesTable<T>({ employees, columnVisibilityName, placeHolder, filterColumnName, tableTitle, columnNames, inputTableName, excelConfig }: EmployeesTableProps<T>) {
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



    const TableEmployeesColumns: ColumnDef<User>[] = [

        {
            accessorKey: "fullName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{row.getValue("fullName")}</div>,
        },
        {
            accessorKey: "departmentName",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Department
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.original.departmentName || "N/A"}</div>,
        },
        {
            accessorKey: "userStatus",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.original.userStatus || "N/A"}</div>,
        },
        {
            accessorKey: "userType",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    User type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.original.userType || "N/A"}</div>,
        },

        {
            accessorKey: "phone1",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Phone
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{row.getValue("phone1")}</div>,
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{row.getValue("email")}</div>,

        },




        {
            accessorKey: "Actions",
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center  gap-2">
                    <EditPasswordModal userID={info.row.original.userID} />
                    <EditEmployeeModal employeeData={info.row.original} />
                    <DeleteValidationModal tooltipTitle='Delete user' alertDialogTitle='Are you sure you want to delete this user?' whichCmp='employee' usefulVariable={info.row.original.userID} queryOptionalVariable='employeeId' />
                </div>)
        },





    ]


    const table = useReactTable({
        data: employees,
        columns: TableEmployeesColumns,
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
            <AddEmployeeModal />

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
