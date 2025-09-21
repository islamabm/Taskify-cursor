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
import { DownloadToExcelBtnTable } from "../helpers/tableHelpers/DownloadToExcelBtnTable";
import { Log } from "../../types/commonTypes/commonTypes";

import ToastComponent from "../helpers/ToastComponent";

import { IconWithTooltip } from "../helpers/IconWithTooltip";
import WhatsappMessaging from "../WhatsappMessaging";
import TaskDetailsCmp from "../taskTableCmps/TaskDetailsCmp";
import { utilService } from "../../services/util.service";

interface LogsTableProps<T> {
    readonly logs: Log[];
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

export function LogsTable<T>({
    logs,
    columnVisibilityName,
    placeHolder,
    inputTableName,
    filterColumnName,
    tableTitle,
    columnNames,
    excelConfig,
}: LogsTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
        const savedColumnVisibility = localStorage.getItem(`columnVisibility${columnVisibilityName}`);
        return savedColumnVisibility ? JSON.parse(savedColumnVisibility) : {};
    });

    const [bossNote, setBossNote] = React.useState("");
    const [employeeNote, setEmployeeNote] = React.useState("");
    const [showMessagingModal, setShowMessagingModal] = React.useState(false);

    const [toastProps, setToastProps] = React.useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    React.useEffect(() => {
        localStorage.setItem(`columnVisibility${columnVisibilityName}`, JSON.stringify(columnVisibility));
    }, [columnVisibility]);





    function handleShowMessagingModal(content: string, employeeNotes: string) {
        setBossNote(content);
        setEmployeeNote(employeeNotes);
        setShowMessagingModal(true);
    }
    function handleCloseMessagingModal() {
        setShowMessagingModal(false);
        setBossNote("");
        setEmployeeNote("");
    }



    const TableTasksColumns: ColumnDef<Log>[] = [

        {
            accessorKey: "userDetails",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    User details
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div><strong>Full name:</strong> {row.original.fullName || "N/A"}</div>
                    <div><strong>Department:</strong> {row.original.departmentName || "N/A"}</div>

                </div>
            ),
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
            accessorKey: "messaging", // New combined column
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Messaging                    <ArrowUpDown className="ml-2 h-4 w-4" />
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div className="text-sm text-muted-foreground">
                        DM: {row.original.content
                            ? `${row.original.content.slice(0, 15)}...`
                            : "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Employee: {row.original.workLogNote

                            ? `${row.original.workLogNote
                                .slice(0, 15)}...`
                            : "N/A"}
                    </div>

                    <IconWithTooltip
                        iconName="MessageCircle"
                        tooltipTitle="Show messaging" onClick={() => handleShowMessagingModal(row.original.content, row.original.workLogNote)} />
                </div>
            ),
        },
        {
            accessorKey: "timeDetails",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Time Details
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div><strong>Start Date:</strong> {row.original.startDateTime || "N/A"}</div>
                    <div><strong>End Date:</strong> {row.original.endDateTime || "N/A"}</div>
                    <div><strong>Duration:</strong> {utilService.formatDuration(row.original.workLogDuration || 0)}</div>
                </div>
            ),
        },
        {
            accessorKey: "taskTimeDetails",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Task Time Details
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div><strong>Created Date:</strong> {row.original.createdDateTime || "N/A"}</div>
                    <div><strong>Start Date:</strong> {row.original.startDate || "N/A"}</div>
                    <div><strong>End Date:</strong> {row.original.finishDate || "N/A"}</div>
                    <div><strong>Duration:</strong> {utilService.formatDuration(row.original.duration || 0)}</div>
                    <div> <strong>Deadline:</strong> {utilService.formatDuration(row.original.deadline || 0)}</div>
                    <div><strong>Quantity:</strong> {row.original.quantity || "N/A"}</div>
                </div>
            ),
        },

        {
            accessorKey: "taskDetails", // New combined column
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Task Details
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                // Transform the data
                const taskDetailsData = [
                    { valueToRender: row.original.ticketType || "N/A", labelToRender: "Type" },
                    { valueToRender: row.original.customStatus || "N/A", labelToRender: "Status" },
                    { valueToRender: row.original.priorityLevel || "N/A", labelToRender: "Priority" },
                ];

                return <TaskDetailsCmp data={taskDetailsData} />;
            }
        },
        {
            accessorKey: "marketDetails",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Market Details
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div><strong>Business Name:</strong> {row.original.marketName || "N/A"}</div>
                    <div><strong>Haat Buss ID:</strong> {row.original.HaatBussID || "N/A"}</div>
                </div>
            ),
        },

        {
            accessorKey: "type",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Log type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.original.workLogType || "N/A"}</div>,
        },

    ]


    const table = useReactTable({
        data: logs,
        columns: TableTasksColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
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
            {/* <div className="flex items-center py-4 justify-between">
                <div className="flex items-center gap-4">
                    <InputTable table={table} placeHolder={placeHolder} filterColumnName={filterColumnName} name={inputTableName} />
                    <ClearFilterTable onClick={clearFiltering} />
                </div>
                <div className="flex items-center gap-4">
                    <TableColumnsDropDown table={table} columnNamesProps={columnNames} />
                    <DownloadToExcelBtnTable table={table} excelConfig={excelConfig} />
                </div>
            </div> */}
            <TableContent table={table} />
            <div className="flex items-center justify-end space-x-2 py-4">
                <NumberOfRowsTable table={table} />
                <TablePagination table={table} />
            </div>
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}
            {
                showMessagingModal &&
                <WhatsappMessaging messages={[
                    { text: bossNote, time: "10:15 AM", isBoss: true },
                    { text: employeeNote, time: "10:16 AM", isBoss: false },
                ]} onClose={handleCloseMessagingModal} />
            }
        </div>
    );
}