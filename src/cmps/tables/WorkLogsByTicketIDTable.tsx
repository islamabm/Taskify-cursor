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
import { NumberOfRowsTable } from "../helpers/tableHelpers/NumberOfRowsTable";
import TablePagination from "../helpers/tableHelpers/TablePagination";
import { Button } from "../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DownloadToExcelBtnTable } from "../helpers/tableHelpers/DownloadToExcelBtnTable";
import { LogByTicketID } from "../../types/commonTypes/commonTypes";
import ToastComponent from "../helpers/ToastComponent";
import { useQueryClient } from "@tanstack/react-query";
import ImageModal from "../modals/ImageModal";
import { EditWorkLogModal } from "../modals/EditWorkLogModal";
import { DeleteValidationModal } from "../modals/DeleteValidationModal";


interface WorkLogsByTicketIDTableProps<T> {
    readonly logs: LogByTicketID[];
    readonly columnVisibilityName: string;
    readonly placeHolder: string;
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

export function WorkLogsByTicketIDTable<T>({
    logs,
    columnVisibilityName,
    placeHolder,
    inputTableName,
    filterColumnName,
    tableTitle,
    columnNames,
    excelConfig,
}: WorkLogsByTicketIDTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
        const savedColumnVisibility = localStorage.getItem(`columnVisibility${columnVisibilityName}`);
        return savedColumnVisibility ? JSON.parse(savedColumnVisibility) : {};
    });




    React.useEffect(() => {
        localStorage.setItem(`columnVisibility${columnVisibilityName}`, JSON.stringify(columnVisibility));
    }, [columnVisibility]);


    const userTypeID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || '';





    const TableWorkLogsByTicketIDColumns: ColumnDef<LogByTicketID>[] = [

        {
            accessorKey: "startDateTime",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Start date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{row.original.startDateTime || "N/A"}</div>
            ),
        },
        {
            accessorKey: "endDateTime",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    End date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{row.original.endDateTime || "N/A"}</div>
            ),
        },

        {
            accessorKey: "type",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{row.original.type || "N/A"}</div>
            ),
        },

        {
            accessorKey: "notes",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Notes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{row.original.notes || "N/A"}</div>
            ),
        },
        {
            accessorKey: "duration",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Duration
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{row.original.duration || "N/A"}</div>
            ),
        },
        {
            accessorKey: "user",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    User
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{row.original.user.fullName || "N/A"}</div>
            ),
        },
        {
            accessorKey: "Actions",
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center  gap-2">
                    {(userTypeID === "3" || userTypeID === "4" || userTypeID === "5") &&
                        <>
                            <EditWorkLogModal workLogData={info.row.original} />
                            <DeleteValidationModal tooltipTitle='Delete log' alertDialogTitle='Are you sure you want to delete this log?' whichCmp='log' usefulVariable={info.row.original.workLogID} queryOptionalVariable='workLogID' usefulVariable2={info.row.original.ticket.ticketID} />
                        </>

                    }
                </div>)
        },









    ]


    const table = useReactTable({
        data: logs,
        columns: TableWorkLogsByTicketIDColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        initialState: {
            pagination: {
                pageSize: 50,
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

            {/* <TableItemsNumberTitle numberOfItems={table.getFilteredRowModel().rows.length} title={tableTitle} /> */}
            <div className="flex items-center py-4 justify-between">
                {/* <div className="flex items-center gap-4">
                    <InputTable table={table} placeHolder={placeHolder} filterColumnName={filterColumnName} name={inputTableName} />
                    <ClearFilterTable onClick={clearFiltering} />
                </div> */}
                {/* <div className="flex items-center gap-4">
                    <TableColumnsDropDown table={table} columnNamesProps={columnNames} />
                    <DownloadToExcelBtnTable table={table} excelConfig={excelConfig} />
                </div> */}
            </div>
            <TableContent table={table} />
            <div className="flex items-center justify-end space-x-2 py-4">
                <NumberOfRowsTable table={table} />
                <TablePagination table={table} />
            </div>


        </div>
    );
}