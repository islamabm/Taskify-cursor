"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnDef,
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
import { Priority } from "../../types/commonTypes/commonTypes";
import { DownloadToExcelBtnTable } from "../helpers/tableHelpers/DownloadToExcelBtnTable";
import { DeleteValidationModal } from "../modals/DeleteValidationModal";
import { AddPriorityLevelModal } from "../modals/AddPriorityLevelModal";
import { EditPriorityModal } from "../modals/EditPriorityModal";

/**
 * Props interface for PriorityLevelsTable component.
 */
interface PriorityLevelsTableProps {
    priorityLevels: Priority[];
    columnVisibilityName: string;
    placeHolder: string;
    inputTableName: string;
    filterColumnName: string;
    tableTitle: string;
    columnNames: { [key: string]: string };
    excelConfig: {
        fields: {
            key: string;
            header: string;
            formatter?: (value: any) => any;
        }[];
        fileName: string;
    };
}

/**
 * Custom hook to manage column visibility with localStorage.
 * @param key - The unique key for storing column visibility.
 * @returns A tuple containing column visibility state and its setter.
 */
const useColumnVisibility = (
    key: string
): [VisibilityState, React.Dispatch<React.SetStateAction<VisibilityState>>] => {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
        const savedVisibility = localStorage.getItem(`columnVisibility_${key}`);
        return savedVisibility ? JSON.parse(savedVisibility) : {};
    });

    useEffect(() => {
        localStorage.setItem(`columnVisibility_${key}`, JSON.stringify(columnVisibility));
    }, [columnVisibility, key]);

    return [columnVisibility, setColumnVisibility];
};

/**
 * PriorityLevelsTable Component
 *
 * Renders a table displaying priority levels with features like sorting, filtering,
 * pagination, column visibility toggling, and actions for editing and deleting priorities.
 */
export const PriorityLevelsTable: React.FC<PriorityLevelsTableProps> = React.memo(
    ({
        priorityLevels,
        columnVisibilityName,
        placeHolder,
        inputTableName,
        filterColumnName,
        tableTitle,
        columnNames,
        excelConfig,
    }) => {
        // State hooks for sorting, filtering, and row selection
        const [sorting, setSorting] = useState<SortingState>([]);
        const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
        const [rowSelection, setRowSelection] = useState({});

        // Custom hook for managing column visibility with localStorage
        const [columnVisibility, setColumnVisibility] = useColumnVisibility(columnVisibilityName);

        /**
         * Memoized column definitions to prevent unnecessary re-renders.
         * Columns include 'Priority Level' and 'Actions'.
         */
        const columns: ColumnDef<Priority>[] = useMemo(
            () => [
                {
                    accessorKey: "priorityLevel",
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Priority level
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    ),
                    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
                },
                {
                    accessorKey: "actions", // Ensure this matches your data property
                    header: "Actions",
                    cell: (info) => (
                        <div className="flex items-center gap-2">
                            <EditPriorityModal priorityData={info.row.original} />
                            <DeleteValidationModal
                                tooltipTitle="Delete priority level"
                                alertDialogTitle="Are you sure you want to delete this priority level?"
                                whichCmp="priority"
                                usefulVariable={info.row.original.priorityLevelID}
                                queryOptionalVariable="employeeId"
                            />
                        </div>
                    ),
                },
            ],
            []
        );

        /**
         * Initialize the table instance using useReactTable hook.
         */
        const table = useReactTable({
            data: priorityLevels,
            columns,
            state: {
                sorting,
                columnFilters,
                columnVisibility,
                rowSelection,
            },
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            onColumnVisibilityChange: setColumnVisibility,
            onRowSelectionChange: setRowSelection,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
        });

        /**
         * Clears the filter applied on the specified column.
         */
        const clearFiltering = useCallback(() => {
            const column = table.getColumn(filterColumnName);
            if (column) {
                column.setFilterValue("");
            }
        }, [table, filterColumnName]);

        return (
            <div className="w-full p-10">
                {/* Modal for adding a new priority level */}
                <AddPriorityLevelModal />

                {/* Title showing the number of items and the table title */}
                <TableItemsNumberTitle
                    numberOfItems={table.getFilteredRowModel().rows.length}
                    title={tableTitle}
                />

                {/* Controls for filtering and managing columns */}
                <div className="flex items-center py-4 justify-between">
                    <div className="flex items-center gap-4">
                        <InputTable
                            table={table}
                            placeHolder={placeHolder}
                            filterColumnName={filterColumnName}
                            name={inputTableName}
                        />
                        <ClearFilterTable onClick={clearFiltering} />
                    </div>
                    <div className="flex items-center gap-4">
                        <TableColumnsDropDown table={table} columnNamesProps={columnNames} />
                        <DownloadToExcelBtnTable table={table} excelConfig={excelConfig} />
                    </div>
                </div>

                {/* Table content */}
                <TableContent table={table} />

                {/* Pagination and row number controls */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <NumberOfRowsTable table={table} />
                    <TablePagination table={table} />
                </div>
            </div>
        );
    }
);
