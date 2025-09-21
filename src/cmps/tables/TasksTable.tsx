import * as React from "react";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    useReactTable,
    ColumnDef
} from "@tanstack/react-table";
import TableColumnsDropDown from "../helpers/tableHelpers/TableColumnsDropDown";
import TableContent from "../helpers/tableHelpers/TableContent";
import { NumberOfRowsTable } from "../helpers/tableHelpers/NumberOfRowsTable";
import TablePagination from "../helpers/tableHelpers/TablePagination";
import { Button } from "../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { IconWithTooltip } from "../helpers/IconWithTooltip";
import { Task, ToastProps } from "../../types/commonTypes/commonTypes";
import { EditTaskModal } from "../modals/EditTaskModal";
import { DeleteValidationModal } from "../modals/DeleteValidationModal";
import { toastService } from "../../services/toast.service";
import ToastComponent from "../helpers/ToastComponent";
import { logsService } from "../../services/logs.service";
import { useQueryClient } from "@tanstack/react-query";
import { WriteNoteModalEndTask } from "../modals/WriteNoteModalEndTask";
import { WriteNoteModalPauseTask } from "../modals/WriteNoteModalPauseTask";
import { navigateService } from "../../services/navigate.service";
import { useNavigate } from "react-router-dom";
import { routeService } from "../../services/route.service";
import WhatsappMessaging from "../WhatsappMessaging";
import TaskDetailsCmp from "../taskTableCmps/TaskDetailsCmp";
import TaskMetricsCmp from "../taskTableCmps/TaskMetricsCmp";
import TaskDatesCmp from "../taskTableCmps/TaskDatesCmp";
import { utilService } from "../../services/util.service";
import { queryKeysService } from "../../services/queryKeys.service";

interface EmployeesTableProps<T> {
    readonly tasks: Task[];
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

export function TasksTable<T>({
    tasks,
    columnVisibilityName,
    placeHolder,
    inputTableName,
    filterColumnName,
    tableTitle,
    columnNames,
    excelConfig,
}: EmployeesTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
        const savedColumnVisibility = localStorage.getItem(`columnVisibility${columnVisibilityName}`);
        return savedColumnVisibility ? JSON.parse(savedColumnVisibility) : {};
    });
    const [showMessagingModal, setShowMessagingModal] = React.useState(false);
    const [bossNote, setBossNote] = React.useState("");
    const [employeeNote, setEmployeeNote] = React.useState("");
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const userID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || '';
    const queryClient = useQueryClient()

    const [toastProps, setToastProps] = React.useState<ToastProps | null>(null);

    React.useEffect(() => {
        localStorage.setItem(`columnVisibility${columnVisibilityName}`, JSON.stringify(columnVisibility));
    }, [columnVisibility]);


    const navigate = useNavigate()
    function goToTaskProductsPage(ticketID: number) {



        const queryParams = new URLSearchParams({
            ticketID: ticketID.toString(),
        }).toString();

        navigateService.handleNavigation(navigate, `${routeService.SHEETPRODUCTS}?${queryParams}`);
    }



    const handleStart = async (taskId: number, userID: number) => {
        try {
            const logData = {
                ticket: {
                    ticketID: taskId,
                },
                user: {
                    userID: +userID,
                },
            };

            await logsService.insertLog(logData);
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            toastService.showToast(
                setToastProps,
                'Task started successfully!',
                'success'
            );
            window.scrollTo(0, 0);

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
        }
    };





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


    function goToProblemProductsPage(ticketID: number, ticketTypeID: number) {

        if (ticketTypeID !== 6) {
            toastService.showToast(setToastProps, "This task is not related to  task type sheet .", "destructive");
            return
        }


        const queryParams = new URLSearchParams({

            ticketID: ticketID.toString(),
        }).toString();

        navigateService.handleNavigation(navigate, `${routeService.PROBLEMPRODUCTS}?${queryParams}`);
    }
    function goToHistoryPage(ticketID: number) {


        const queryParams = new URLSearchParams({

            ticketID: ticketID.toString(),
        }).toString();

        navigateService.handleNavigation(navigate, `${routeService.WORKLOGSBYTICKETID}?${queryParams}`);
    }


    console.log("tasks", tasks)


    const TableTasksColumns: ColumnDef<Task>[] = [
        {
            accessorKey: "Timer",
            cell: ({ row }) => (
                <div className={`flex items-center gap-2 `}>
                    {Number(row.original.customStatus.customStatusID) === 9 && row.original.startDate
                        &&
                        <div>{utilService.formatDuration(row.original.duration ?? 0)}</div>
                    }
                </div>
            ),
        },
        {
            accessorKey: "Start",

            cell: ({ row }) => {
                return (
                    Number(row.original.customStatus.customStatusID) !== 10 &&
                    Number(row.original.customStatus.customStatusID) !== 12 && (
                        <div
                            className="flex items-center gap-2"

                        >
                            {Number(row.original.customStatus.customStatusID) !== 9 || !row.original.startDate ? (
                                <IconWithTooltip
                                    iconName="Play"
                                    tooltipTitle="Start task"
                                    onClick={() => handleStart(row.original.ticketID, row.original.user.userID)}
                                />
                            ) : (
                                <>
                                    <div
                                        className="w-5 h-5"

                                    >
                                        <img
                                            src="https://haatdaas.lan-wan.net/partnerMsg/images/animation.gif"
                                            alt="Animated"
                                        />
                                    </div>

                                    <WriteNoteModalPauseTask
                                        ticketID={row.original.ticketID}
                                        userID={row.original.user.userID}
                                        workLogID={row.original.workLogID}

                                        endType="pause"
                                    />
                                    <WriteNoteModalEndTask
                                        ticketID={row.original.ticketID}
                                        userID={row.original.user.userID}
                                        workLogID={row.original.workLogID}
                                        isPublished={row.original.isPublished}
                                        isAppCheck={row.original.isAppCheck}
                                        departmentID={row.original.department.departmentID}
                                        isCategorized={row.original.isCategorized}
                                        isTagged={row.original.isTagged}
                                        products={row.original.products ? row.original.products : []}
                                        isMessage={row.original.isMessage}
                                        ticketTypeID={+row.original.ticketType.ticketTypeID}
                                        endType="end"

                                    />
                                </>
                            )}
                        </div>
                    )
                );
            },
        },

        {
            accessorKey: "marketDetails", // New combined column
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Main Details
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    <div>{row.original.market?.marketName || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">{row.original.market?.HaatBussID || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">{row.original.user?.fullName || "N/A"}</div>
                    <div>Ticket ID: {row.original.ticketID || "N/A"}</div>

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
                        className="w-16 h-16">
                        <img
                            src={row.original.market.logoURL ? row.original.market.logoURL : "https://haatdaas.lan-wan.net/daas/images/drLogo.png"}
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
                        Employee: {row.original.employeeNotes
                            ? `${row.original.employeeNotes.slice(0, 15)}...`
                            : "N/A"}
                    </div>



                    <IconWithTooltip
                        iconName="MessageCircle"
                        tooltipTitle="Show messaging" onClick={() => handleShowMessagingModal(row.original.content, row.original.employeeNotes)} />
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
                    { valueToRender: row.original.ticketType?.ticketType || "N/A", labelToRender: "Type" },
                    { valueToRender: row.original.customStatus?.customStatus || "N/A", labelToRender: "Status" },
                    { valueToRender: row.original.department?.departmentName || "N/A", labelToRender: "Department" },
                    { valueToRender: row.original.priorityLevel?.priorityLevel || "N/A", labelToRender: "Priority" },
                    { valueToRender: row.original.products?.length || "N/A", labelToRender: "Products" },
                    { valueToRender: row.original.problemsProducts?.length || "N/A", labelToRender: "Stuck products" },
                ];

                // Use TaskDetailsCmp
                return <TaskDetailsCmp data={taskDetailsData} />;
            }
        },
        {
            accessorKey: "taskMetrics", // New combined column
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Metrics
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),

            cell: ({ row }) => {
                // Transform the data
                const taskMetricsData = [
                    { valueToRender: row.original.quantity || "N/A", labelToRender: "Quantity" },
                    { valueToRender: utilService.formatDuration(row.original.deadline) || 0, labelToRender: "Deadline" },
                    { valueToRender: utilService.formatDuration(row.original.duration ?? 0) || 0, labelToRender: "Duration" },
                ];

                // Use TaskDetailsCmp
                return <TaskMetricsCmp data={taskMetricsData} />;
            }
        },



        {
            accessorKey: "dateDetails", // New combined column
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Task Dates
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),

            cell: ({ row }) => {
                // Transform the data
                const taskDatesData = [
                    { valueToRender: row.original.createdDateTime ?? "N/A", labelToRender: "Created" },
                    { valueToRender: row.original.startDateDisplay ?? "N/A", labelToRender: "Start" },
                    { valueToRender: row.original.finishDateDisplay ?? "N/A", labelToRender: "End" },
                    { valueToRender: utilService.formatDuration(row.original.totalDuration) ?? "N/A", labelToRender: "Total duration" },
                ];

                // Use TaskDatesCmp
                return <TaskDatesCmp data={taskDatesData} />;
            }
        },
        {
            accessorKey: "taskState", // New combined column
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Task State
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <IconWithTooltip
                            iconName={row.original.isAppCheck ? "Check" : "X"}
                            tooltipTitle={row.original.isAppCheck ? "Task is checked" : "Task is not checked"}
                        />
                        <span>{row.original.isAppCheck ? "Checked" : "Not checked"}</span>
                    </div>
                    {row.original.department.departmentID === 7 &&
                        <>
                            <div className="flex items-center gap-2">
                                <IconWithTooltip
                                    iconName={row.original.isMessage ? "Check" : "X"}
                                    tooltipTitle={row.original.isMessage ? "Message sent" : "Message is not sent"}
                                />
                                <span>{row.original.isMessage ? "Message sent" : "Message not sent"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconWithTooltip
                                    iconName={row.original.isPublished ? "Check" : "X"}
                                    tooltipTitle={row.original.isPublished ? "Task is published" : "Task is not published"}
                                />
                                <span>{row.original.isPublished ? "Published" : "Not published"}</span>
                            </div>
                        </>
                    }

                    {row.original.department.departmentID === 6 &&
                        <>
                            <div className="flex items-center gap-2">
                                <IconWithTooltip
                                    iconName={row.original.isCategorized ? "Check" : "X"}
                                    tooltipTitle={row.original.isCategorized ? "Task is categorized" : "Task is not categorized"}
                                />
                                <span>{row.original.isCategorized ? "Categorized" : "Not categorized"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconWithTooltip
                                    iconName={row.original.isTagged ? "Check" : "X"}
                                    tooltipTitle={row.original.isTagged ? "Task is tagged" : "Task is not tagged"}
                                />
                                <span>{row.original.isTagged ? "Tagged" : "Not tagged"}</span>
                            </div>
                        </>
                    }
                </div>
            ),
        },
        {
            accessorKey: "Actions",
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <EditTaskModal taskData={info.row.original} />
                    {(userID === "3" || userID === "4" || userID === "5") &&
                        <>
                            <IconWithTooltip iconName="Bug" tooltipTitle="Stuck products" onClick={() => goToProblemProductsPage(info.row.original.ticketID, info.row.original.ticketType.ticketTypeID)} />
                            <IconWithTooltip iconName="History" tooltipTitle="Ticket history" onClick={() => goToHistoryPage(info.row.original.ticketID)} />

                            <DeleteValidationModal tooltipTitle='Delete task' alertDialogTitle='Are you sure you want to delete this task?' whichCmp='task' usefulVariable={info.row.original.ticketID} queryOptionalVariable='employeeId' usefulVariable2={info.row.original.customStatus.customStatusID} />
                        </>
                    }
                    {+info.row.original.ticketType.ticketTypeID === 6 &&

                        <IconWithTooltip iconName="Sheet" tooltipTitle="See task products" onClick={() => goToTaskProductsPage(info.row.original.ticketID)} />
                    }
                </div>

            )
        },





    ]


    const table = useReactTable({
        data: tasks,
        columns: TableTasksColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: 50,
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    // function clearFiltering() {
    //     table.getColumn(filterColumnName)?.setFilterValue("");
    // }

    return (
        <div className="w-full p-10">

            {/* <TableItemsNumberTitle numberOfItems={table.getFilteredRowModel().rows.length} title={tableTitle} /> */}
            <div className="flex items-center py-4 justify-between">
                <div className="flex items-center gap-4">
                    {/* <InputTable table={table} placeHolder={placeHolder} filterColumnName={filterColumnName} name={inputTableName} />
                    <ClearFilterTable onClick={clearFiltering} /> */}
                </div>
                <div className="flex items-center gap-4">
                    <TableColumnsDropDown table={table} columnNamesProps={columnNames} />
                    {/* <DownloadToExcelBtnTable table={table} excelConfig={excelConfig} /> */}
                </div>
            </div>
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