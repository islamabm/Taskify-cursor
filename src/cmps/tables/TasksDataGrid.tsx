import * as React from "react";
import {
    DataGrid,
    GridToolbar,
    GridColDef,
    GridRenderCellParams,
    GridActionsCellItem,
    GridValidRowModel,
    // GridRowClassNameParams,
    // GridColumnVisibilityModel,
} from "@mui/x-data-grid";


// import {
//     DataGrid,
//     GridToolbar,
//     GridColDef,
//     GridRenderCellParams,
//     GridValidRowModel,
//     GridActionsCellItem,
// } from "@mui/x-data-grid";
import {
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    Stack,
    Typography,
    Box,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import MessageIcon from "@mui/icons-material/Message";
import BugReportIcon from "@mui/icons-material/BugReport";
import HistoryIcon from "@mui/icons-material/History";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LaunchIcon from "@mui/icons-material/Launch";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { Task, ToastProps } from "../../types/commonTypes/commonTypes";
import { useNavigate } from "react-router-dom";
import { navigateService } from "../../services/navigate.service";
import { routeService } from "../../services/route.service";
import { toastService } from "../../services/toast.service";
import ToastComponent from "../helpers/ToastComponent";
import { logsService } from "../../services/logs.service";
import { utilService } from "../../services/util.service";
import { EditTaskModal } from "../modals/EditTaskModal";
import { DeleteValidationModal } from "../modals/DeleteValidationModal";
import { WriteNoteModalEndTask } from "../modals/WriteNoteModalEndTask";
import { WriteNoteModalPauseTask } from "../modals/WriteNoteModalPauseTask";
import WhatsappMessaging from "../WhatsappMessaging";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeysService } from "../../services/queryKeys.service";

/** Props */
interface TasksDataGridProps {
    tasks: Task[];
}

/** Row shape for the grid (derived from Task) */
interface TaskRow extends GridValidRowModel {
    id: number;
    ticketID: number;

    marketLogo: string;
    marketName: string;
    marketHaatID: string;

    userName: string;

    ticketTypeID: number;
    ticketTypeName: string;

    customStatusID: number;
    customStatusName: string;

    departmentID: number;
    departmentName: string;

    priorityName: string;

    productsCount: number;
    stuckProductsCount: number;

    quantity: number | null;
    deadlineFmt: string;
    durationFmt: string;
    totalDurationFmt: string;

    createdFmt: string;
    startFmt: string;
    finishFmt: string;

    content: string;
    employeeNotes: string;

    startDate?: string | null;
    workLogID?: number | null;

    isAppCheck: boolean;
    isMessage: boolean;
    isPublished: boolean;
    isCategorized: boolean;
    isTagged: boolean;

    isDeleted?: number; // if you have a deleted flag
    isRunning: boolean;
}




/** Map incoming tasks to grid rows */
function mapTasksToRows(tasks: Task[]): TaskRow[] {
    return tasks.map((t) => ({
        id: t.ticketID,
        ticketID: t.ticketID,

        marketLogo: t.market?.logoURL || "",
        marketName: t.market?.marketName || "N/A",
        marketHaatID: t.market?.HaatBussID || "N/A",

        userName: t.user?.fullName || "N/A",

        ticketTypeID: Number(t.ticketType?.ticketTypeID ?? 0),
        ticketTypeName: t.ticketType?.ticketType || "N/A",

        customStatusID: Number(t.customStatus?.customStatusID ?? 0),
        customStatusName: t.customStatus?.customStatus || "N/A",

        departmentID: Number(t.department?.departmentID ?? 0),
        departmentName: t.department?.departmentName || "N/A",

        priorityName: t.priorityLevel?.priorityLevel || "N/A",

        productsCount: Number(t.products?.length ?? 0),
        stuckProductsCount: Number(t.problemsProducts?.length ?? 0),

        quantity: t.quantity ?? null,
        deadlineFmt: utilService.formatDuration(t.deadline ?? 0) || "0",
        durationFmt: utilService.formatDuration(t.duration ?? 0) || "0",
        totalDurationFmt: utilService.formatDuration(t.totalDuration ?? 0) || "0",

        createdFmt: t.createdDateTime ?? "N/A",
        startFmt: t.startDateDisplay ?? "N/A",
        finishFmt: t.finishDateDisplay ?? "N/A",

        content: t.content ?? "",
        employeeNotes: t.employeeNotes ?? "",

        startDate: t.startDate,
        workLogID: t.workLogID,

        isAppCheck: Boolean(t.isAppCheck),
        isMessage: Boolean(t.isMessage),
        isPublished: Boolean(t.isPublished),
        isCategorized: Boolean(t.isCategorized),
        isTagged: Boolean(t.isTagged),

        isDeleted: (t as any).isDeleted ?? 0,
        isRunning: Number(t.customStatus?.customStatusID) === 9 && !!t.startDate,
    }));
}

const TasksDataGrid: React.FC<TasksDataGridProps> = ({
    tasks,
}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [toastProps, setToastProps] = React.useState<ToastProps | null>(null);
    console.log("tasks in datagrid", tasks);
    // Messaging modal state (kept as-is)
    const [showMessagingModal, setShowMessagingModal] = React.useState(false);
    const [bossNote, setBossNote] = React.useState("");
    const [employeeNote, setEmployeeNote] = React.useState("");

    const userIDStr = localStorage
        .getItem("USERTYPEID_TASKIFY")
        ?.replace(/^"|"$/g, "");
    const userID = Number(userIDStr || 0);

    const rows = React.useMemo(() => mapTasksToRows(tasks), [tasks]);



    /** Actions */
    const handleStart = async (taskId: number, userIDForLog: number) => {
        try {
            const logData = {
                ticket: { ticketID: taskId },
                user: { userID: Number(userIDForLog) },
            };
            await logsService.insertLog(logData);
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            toastService.showToast(setToastProps, "Task started successfully!", "success");
            window.scrollTo(0, 0);
        } catch (error: any) {
            const message =
                error instanceof Error ? error.message : "An unknown error occurred";
            toastService.showToast(
                setToastProps,
                `Error occurred while starting the task. ${message}. Please pause or end the task and try again.`,
                "destructive"
            );
        }
    };

    const handleShowMessagingModal = (content: string, employeeNotes: string) => {
        setBossNote(content || "");
        setEmployeeNote(employeeNotes || "");
        setShowMessagingModal(true);
    };
    const handleCloseMessagingModal = () => {
        setShowMessagingModal(false);
        setBossNote("");
        setEmployeeNote("");
    };

    const goToTaskProductsPage = (ticketID: number) => {
        const qp = new URLSearchParams({ ticketID: String(ticketID) }).toString();
        navigateService.handleNavigation(
            navigate,
            `${routeService.SHEET_PRODUCTS}?${qp}`
        );
    };


    /** Reusable tiny helper for boolean chips */
    const BoolChip: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
        <Chip
            size="small"
            icon={ok ? <CheckIcon /> : <CloseIcon />}
            label={label}
            color={ok ? "success" : "default"}
            variant={ok ? "filled" : "outlined"}
            sx={{ mr: 0.5 }}
        />
    );

    /** Columns */
    const columns = React.useMemo<GridColDef<TaskRow>[]>(
        () => [
            // ACTIONS: edit, history, delete, etc. (compact, left-most)
            {
                field: "actions",
                type: "actions",
                headerName: "",
                width: 70,
                getActions: (params) => {
                    const t = tasks.find((x) => x.ticketID === params.row.ticketID)!;
                    const canAdmin = userIDStr === "3" || userIDStr === "4" || userIDStr === "5";

                    const actions: React.ReactElement[] = [
                        // <GridActionsCellItem
                        //     key="open-details"
                        //     icon={
                        //         <Tooltip title="Open details">
                        //             <IconButton size="small">
                        //                 <LaunchIcon fontSize="inherit" />
                        //             </IconButton>
                        //         </Tooltip>
                        //     }
                        //     label="Open"
                        //     onClick={() => goToHistoryPage(params.row.ticketID)}
                        //     showInMenu={false}
                        // />,
                        // <GridActionsCellItem
                        //     key="edit"
                        //     icon={
                        //         <EditTaskModal taskData={t} />
                        //     }
                        //     label="Edit"
                        //     showInMenu={false}
                        // />,
                    ];

                    if (canAdmin) {
                        actions.push(
                            // <GridActionsCellItem
                            //     key="stuck"
                            //     icon={
                            //         <Tooltip title="Stuck products">
                            //             <IconButton size="small" onClick={() =>
                            //                 goToProblemProductsPage(params.row.ticketID, params.row.ticketTypeID)
                            //             }>
                            //                 <BugReportIcon fontSize="inherit" />
                            //             </IconButton>
                            //         </Tooltip>
                            //     }
                            //     label="Stuck products"
                            //     onClick={() => { }}
                            //     showInMenu={false}
                            // />,
                            // <GridActionsCellItem
                            //     key="history"
                            //     icon={
                            //         <Tooltip title="Ticket history">
                            //             <IconButton size="small" onClick={() =>
                            //                 goToHistoryPage(params.row.ticketID)
                            //             }>
                            //                 <HistoryIcon fontSize="inherit" />
                            //             </IconButton>
                            //         </Tooltip>
                            //     }
                            //     label="History"
                            //     onClick={() => { }}
                            //     showInMenu={false}
                            // />,
                            // <GridActionsCellItem
                            //     key="delete"
                            //     icon={
                            //         <DeleteValidationModal
                            //             tooltipTitle="Delete task"
                            //             alertDialogTitle="Are you sure you want to delete this task?"
                            //             whichCmp="task"
                            //             usefulVariable={params.row.ticketID}
                            //             queryOptionalVariable="employeeId"
                            //             usefulVariable2={params.row.customStatusID}
                            //         />
                            //     }
                            //     label="Delete"
                            //     showInMenu={false}
                            // />
                        );
                    }

                    // if (params.row.ticketTypeID === 6) {
                    actions.push(
                        <GridActionsCellItem
                            key="sheet"
                            icon={
                                <Tooltip title="See task details">
                                    <IconButton
                                        size="small"
                                        onClick={() => goToTaskProductsPage(params.row.ticketID)}
                                    >
                                        <ReceiptLongIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            }
                            label="See products"
                            onClick={() => { }}
                            showInMenu={false}
                        />
                    );
                    // }

                    return actions;
                },
            },

            // TIMER (only visible when running)
            {
                field: "timer",
                headerName: "Timer",
                width: 110,
                valueGetter: (_value, row) =>
                    row.isRunning
                        ? utilService.formatDuration(
                            (tasks.find((x) => x.ticketID === row.ticketID)?.duration) ?? 0
                        )
                        : "",
            },

            // START / PAUSE / END
            {
                field: "runControls",
                headerName: "Start",
                width: 130,
                sortable: false,
                filterable: false,
                renderCell: (params: GridRenderCellParams<TaskRow>) => {
                    const t = tasks.find((x) => x.ticketID === params.row.ticketID)!;
                    const isDone = [10, 12].includes(params.row.customStatusID);
                    if (isDone) return null;

                    // if (!params.row.isRunning) {
                    //     return (
                    //         <Tooltip title="Start task">
                    //             <IconButton
                    //                 size="small"
                    //                 onClick={() => handleStart(params.row.ticketID, userID)}
                    //             >
                    //                 <PlayArrowIcon />
                    //             </IconButton>
                    //         </Tooltip>
                    //     );
                    // }

                    // running: show pause + end (reuse your existing modals)
                    return (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                component="img"
                                src="https://haatdaas.lan-wan.net/partnerMsg/images/animation.gif"
                                alt="running"
                                sx={{ width: 20, height: 20 }}
                            />
                            {/* <WriteNoteModalPauseTask
                                ticketID={t.ticketID}
                                userID={t.user.userID}
                                workLogID={t.workLogID}
                                endType="pause"
                                trigger={
                                    <Tooltip title="Pause">
                                        <IconButton size="small">
                                            <PauseIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            /> */}
                            {/* <WriteNoteModalEndTask
                                ticketID={t.ticketID}
                                userID={t.user.userID}
                                workLogID={t.workLogID}
                                isPublished={t.isPublished}
                                isAppCheck={t.isAppCheck}
                                departmentID={t.department.departmentID}
                                isCategorized={t.isCategorized}
                                isTagged={t.isTagged}
                                products={t.products ?? []}
                                isMessage={t.isMessage}
                                ticketTypeID={Number(t.ticketType.ticketTypeID)}
                                endType="end"
                                trigger={
                                    <Tooltip title="End">
                                        <IconButton size="small" color="error">
                                            <StopIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            /> */}
                        </Stack>
                    );
                },
            },

            // IMAGE (logo)
            {
                field: "marketLogo",
                headerName: "",
                width: 60,
                sortable: false,
                filterable: false,
                renderCell: (p) => (
                    <Avatar
                        src={
                            p.value ||
                            "https://haatdaas.lan-wan.net/daas/images/drLogo.png"
                        }
                        sx={{ width: 40, height: 40, bgcolor: "grey.200" }}
                    />
                ),
            },

            // MAIN DETAILS
            {
                field: "marketCombined",
                headerName: "Main Details",
                flex: 1.2,
                minWidth: 220,
                renderCell: (p) => (
                    <Stack spacing={0.5}>
                        <Typography variant="body2">{p.row.marketName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {p.row.marketHaatID}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {p.row.userName}
                        </Typography>
                        <Typography variant="caption">Ticket ID: {p.row.ticketID}</Typography>
                    </Stack>
                ),
            },

            // MESSAGING
            {
                field: "messaging",
                headerName: "Messaging",
                flex: 1,
                minWidth: 220,
                sortable: false,
                renderCell: (p) => (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Stack>
                            <Typography variant="caption" color="text.secondary">
                                DM: {p.row.content ? `${p.row.content.slice(0, 15)}…` : "N/A"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Employee:{" "}
                                {p.row.employeeNotes
                                    ? `${p.row.employeeNotes.slice(0, 15)}…`
                                    : "N/A"}
                            </Typography>
                        </Stack>
                        <Tooltip title="Show messaging">
                            <IconButton
                                size="small"
                                onClick={() =>
                                    handleShowMessagingModal(p.row.content, p.row.employeeNotes)
                                }
                            >
                                <MessageIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ),
            },

            // TASK DETAILS
            {
                field: "taskDetails",
                headerName: "Task Details",
                flex: 1.1,
                minWidth: 260,
                sortable: false,
                renderCell: (p) => (
                    <Stack spacing={0.5}>
                        <Typography variant="caption">
                            <b>Type:</b> {p.row.ticketTypeName}
                        </Typography>
                        <Typography variant="caption">
                            <b>Status:</b> {p.row.customStatusName}
                        </Typography>
                        <Typography variant="caption">
                            <b>Department:</b> {p.row.departmentName}
                        </Typography>
                        <Typography variant="caption">
                            <b>Priority:</b> {p.row.priorityName}
                        </Typography>
                        {/* <Typography variant="caption">
                            <b>Products:</b> {p.row.productsCount}
                            {" · "}
                            <b>Stuck:</b> {p.row.stuckProductsCount}
                        </Typography> */}
                    </Stack>
                ),
            },

            // METRICS
            {
                field: "metrics",
                headerName: "Metrics",
                minWidth: 220,
                flex: 0.8,
                sortable: false,
                renderCell: (p) => (
                    <Stack spacing={0.5}>
                        <Typography variant="caption">
                            <b>Quantity:</b> {p.row.quantity ?? "N/A"}
                        </Typography>
                        <Typography variant="caption">
                            <b>Deadline:</b> {p.row.deadlineFmt}
                        </Typography>
                        <Typography variant="caption">
                            <b>Duration:</b> {p.row.durationFmt}
                        </Typography>
                    </Stack>
                ),
            },

            // DATES
            {
                field: "dates",
                headerName: "Task Dates",
                minWidth: 260,
                flex: 1,
                sortable: false,
                renderCell: (p) => (
                    <Stack spacing={0.5}>
                        <Typography variant="caption">
                            <b>Created:</b> {p.row.createdFmt ?? "N/A"}
                        </Typography>
                        <Typography variant="caption">
                            <b>Start:</b> {p.row.startFmt ?? "N/A"}
                        </Typography>
                        <Typography variant="caption">
                            <b>End:</b> {p.row.finishFmt ?? "N/A"}
                        </Typography>
                        <Typography variant="caption">
                            <b>Total:</b> {p.row.totalDurationFmt ?? "N/A"}
                        </Typography>
                    </Stack>
                ),
            },

            // TASK STATE (chips)
            {
                field: "state",
                headerName: "Task State",
                minWidth: 260,
                flex: 1,
                sortable: false,
                renderCell: (p) => {
                    const chips: React.ReactNode[] = [<BoolChip key="check" ok={p.row.isAppCheck} label="Checked" />];

                    if (p.row.departmentID === 7) {
                        chips.push(
                            <BoolChip key="msg" ok={p.row.isMessage} label="Msg sent" />,
                            <BoolChip key="pub" ok={p.row.isPublished} label="Published" />
                        );
                    }
                    if (p.row.departmentID === 6) {
                        chips.push(
                            <BoolChip key="cat" ok={p.row.isCategorized} label="Categorized" />,
                            <BoolChip key="tag" ok={p.row.isTagged} label="Tagged" />
                        );
                    }
                    return <Stack direction="row" flexWrap="wrap">{chips}</Stack>;
                },
            },
        ],
        [tasks, userID, userIDStr]
    );

    /** Optional row class for deleted rows */
    // const getRowClassName = React.useCallback(
    //     (params: GridRowClassNameParams<TaskRow>) =>
    //         params.row.isDeleted === 1 ? "deleted-row" : "",
    //     []
    // );

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <DataGrid<TaskRow>
                rows={rows}
                columns={columns}
                getRowId={(r) => r.ticketID}
                autoHeight
                pageSizeOptions={[10, 25, 50, 100]}
                density="compact"
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                initialState={{
                    pagination: { paginationModel: { pageSize: 50 } },
                    sorting: { sortModel: [{ field: "createdFmt", sort: "desc" }] },
                }}
                rowHeight={150}         // 🔑 Increase this to make cells taller
                headerHeight={60}      // (optional) make headers taller too
                sx={{
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "rgba(0,0,0,0.03)",
                        fontWeight: 700,
                    },
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                        backgroundColor: "rgba(0,0,0,0.015)",
                    },
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "rgba(0,128,255,0.08)",
                    },
                    "& .MuiDataGrid-cell:focus": { outline: "none" },
                    "& .deleted-row": {
                        opacity: 0.45,
                        textDecoration: "line-through",
                        pointerEvents: "none",
                    },
                }}
            />

            {/* Toasts */}
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}

            {/* Messaging Modal */}
            {showMessagingModal && (
                <WhatsappMessaging
                    messages={[
                        { text: bossNote, time: "10:15 AM", isBoss: true },
                        { text: employeeNote, time: "10:16 AM", isBoss: false },
                    ]}
                    onClose={handleCloseMessagingModal}
                />
            )}
        </Box>
    );
};

export default TasksDataGrid;
