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
import { Department } from "../../types/commonTypes/commonTypes";
import { DownloadToExcelBtnTable } from "../helpers/tableHelpers/DownloadToExcelBtnTable";
import { DeleteValidationModal } from "../modals/DeleteValidationModal";
import { routeService } from "../../services/route.service";
import { navigateService } from "../../services/navigate.service";
import { useNavigate } from "react-router-dom";
import { AddDepartmentModal } from "../modals/AddDepartmentModal";
import { EditDepartmentModal } from "../modals/EditDepartmentModal";


interface DepartmentsTableProps<T> {
    readonly departments: Department[];
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

export function DepartmentsTable<T>({ departments, columnVisibilityName, placeHolder, filterColumnName, tableTitle, columnNames, inputTableName, excelConfig }: DepartmentsTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const navigate = useNavigate()
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
        const savedColumnVisibility = localStorage.getItem(`columnVisibility${columnVisibilityName}`);
        return savedColumnVisibility ? JSON.parse(savedColumnVisibility) : {};
    });


    React.useEffect(() => {
        localStorage.setItem(`columnVisibility${columnVisibilityName}`, JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    const [rowSelection, setRowSelection] = React.useState({});



    function handleGoToSubDepartments(departmentID: number, departmentName: string) {
        const queryParams = new URLSearchParams({
            departmentID: departmentID.toString(),
            departmentName
        });
        const path = `${routeService.SUBDEPARTMENTS}/?${queryParams.toString()}`;
        navigateService.handleNavigation(navigate, path);

    }


    const TableDepartmentsColumns: ColumnDef<Department>[] = [

        {
            accessorKey: "departmentName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Depatment name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{row.getValue("departmentName")}</div>,
        },





        {
            accessorKey: "Actions",
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center  gap-2">
                    <EditDepartmentModal departmentData={info.row.original} />
                    <DeleteValidationModal tooltipTitle='Delete department' alertDialogTitle='Are you sure you want to delete this department?' whichCmp='department' usefulVariable={info.row.original.departmentID} queryOptionalVariable='employeeId' />
                    <IconWithTooltip tooltipTitle='Show sub-departments' iconName='Book' onClick={() => handleGoToSubDepartments(info.row.original.departmentID, info.row.original.departmentName)} />
                </div>)
        },





    ]


    const table = useReactTable({
        data: departments,
        columns: TableDepartmentsColumns,
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

            <AddDepartmentModal />
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
