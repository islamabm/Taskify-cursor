// import React, { useState } from 'react';
// import { useTheme } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import Timer from '../Timer';
// import { WriteNoteModalPauseTask } from '../modals/WriteNoteModalPauseTask';
// import { WriteNoteModalEndTask } from '../modals/WriteNoteModalEndTask';
// import { TaskDescription } from './TaskDescription';
// import { EditTaskModal } from '../modals/EditTaskModal';
// import { DeleteValidationModal } from '../modals/DeleteValidationModal';
// import { navigateService } from '../../services/navigate.service';
// import { useNavigate } from 'react-router-dom';
// import { routeService } from '../../services/route.service';
// import ToastComponent from '../helpers/ToastComponent';
// import { toastService } from '../../services/toast.service';

// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
// import { IconWithTooltip } from '../helpers/IconWithTooltip';

// import { utilService } from '../../services/util.service';

// interface TasksCardPreviewProps {
//     readonly task: any;
//     readonly onStart: (taskId: number, userId: number) => void;
// }

// export const TasksCardPreview: React.FC<TasksCardPreviewProps> = ({ task, onStart }) => {
//     const theme = useTheme();
//     const [toastProps, setToastProps] = useState<{
//         key: number;
//         variant: 'success' | 'destructive';
//         title: string;
//         description: string;
//     } | null>(null);
//     const userID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || '';
//     const navigate = useNavigate()
//     // Function to map customStatusID to specific colors
//     const getStatusColor = (customStatusID: number | undefined): string => {
//         switch (customStatusID) {
//             case 8: // Not Started
//                 return theme.palette.info.main; // Blue
//             case 9: // In Progress
//                 return theme.palette.warning.main; // Orange
//             case 10: // Completed
//                 return theme.palette.success.main; // Green
//             case 11: // Paused
//                 return theme.palette.warning.light; // Yellow
//             case 12: // Cancelled
//                 return theme.palette.error.main; // Red
//             default:
//                 return theme.palette.text.secondary; // Default color
//         }
//     };

//     function goToProductsSheetView() {
//         console.log("task.ticketType?.ticketTypeID", task.ticketType?.ticketTypeID)
//         if (task.ticketType?.ticketTypeID !== 6 && task.ticketType?.ticketTypeID !== 49) {

//             toastService.showToast(setToastProps, "This task is not related to  task type sheet .", "destructive");
//             return
//         }

//         const ticketID = task.ticketID || '';
//         if (task.ticketType?.ticketTypeID === 6) {



//             const queryParams = new URLSearchParams({

//                 ticketID: ticketID.toString(),
//             }).toString();

//             navigateService.handleNavigation(navigate, `${routeService.SHEET_PRODUCTS}?${queryParams}`);
//         }

//         if (task.ticketType?.ticketTypeID === 49) {



//             const queryParams = new URLSearchParams({

//                 ticketID: ticketID.toString(),
//             }).toString();

//             navigateService.handleNavigation(navigate, `${routeService.CAMPAIGN_DETAILS}?${queryParams}`);
//         }
//     }





//     function goToProblemProductsPage() {
//         if (task.ticketType?.ticketTypeID !== 6) {

//             toastService.showToast(setToastProps, "This task is not related to  task type sheet .", "destructive");
//             return
//         }

//         const ticketID = task.ticketID || '';

//         const queryParams = new URLSearchParams({

//             ticketID: ticketID.toString(),
//         }).toString();

//         navigateService.handleNavigation(navigate, `${routeService.PROBLEM_PRODUCTS}?${queryParams}`);
//     }
//     function goToHistoryPage() {

//         const ticketID = task.ticketID || '';

//         const queryParams = new URLSearchParams({

//             ticketID: ticketID.toString(),
//         }).toString();

//         navigateService.handleNavigation(navigate, `${routeService.WORKLOGS_BY_TICKET_ID}?${queryParams}`);
//     }

//     // const productsNumber = task?.products?.length || 0;
//     // const problemProductsNumber = task?.problemsProducts?.length || 0;
//     return (
//         <Card sx={{ display: 'flex', margin: 0, position: 'relative', cursor: 'default' }}
//         >
//             <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
//                 <CardContent sx={{ flex: '1 0 auto' }}>


//                     <Typography component="div" variant="h5">
//                         {task.market.marketName} / {task.ticketID}
//                     </Typography>



//                     <Typography
//                         variant="subtitle1"
//                         component="div"
//                         sx={{ color: 'text.secondary' }}
//                     >
//                         {task.user?.fullName.slice(0, 11) || 'Unknown Employee'}
//                     </Typography>
//                     <Typography
//                         variant="subtitle1"


//                         component="div"
//                         sx={{ color: 'text.secondary' }}
//                     >
//                         {task.createdDateTime}
//                     </Typography>
//                     {/* <Typography
//                         variant="subtitle1"


//                         component="div"
//                         sx={{ color: 'text.secondary' }}
//                     >
//                         ({problemProductsNumber}/{productsNumber})
//                     </Typography> */}
//                     <Typography
//                         variant="subtitle1"
//                         component="div"
//                         sx={{ color: 'text.secondary' }}
//                     >
//                         {task.ticketType?.ticketType || 'Unknown type'}
//                     </Typography>
//                     <Typography
//                         variant="subtitle1"
//                         component="div"
//                         sx={{ color: 'text.secondary' }}
//                     >
//                         {task.market?.HaatBussID || 'Unknown Employee'}
//                     </Typography>
//                     <Typography
//                         variant="subtitle1"
//                         component="div"
//                         sx={{ color: getStatusColor(task.customStatus?.customStatusID) }}
//                     >
//                         {task.customStatus?.customStatus || 'Unknown Status'}
//                     </Typography>
//                     <Typography
//                         variant="subtitle1"
//                         component="div"
//                         sx={{ color: 'text.secondary' }}
//                     >
//                         {utilService.formatDuration(task.duration) || 'Unknown Employee'}
//                     </Typography>
//                 </CardContent>
//                 {/* <LineComponent /> */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, gap: 1 }}>
//                     {task.customStatus.customStatusID !== 10 &&
//                         task.customStatus.customStatusID !== 12 && (
//                             <>
//                                 {task.customStatus.customStatusID !== 9 || !task.startDate ? (

//                                     <IconWithTooltip
//                                         iconName="Play"
//                                         tooltipTitle="Start task"
//                                         onClick={() => onStart(task.ticketID, task.user.userID)}
//                                     />
//                                 ) : (
//                                     <>

//                                         <div
//                                             className="w-5 h-5"

//                                         >
//                                             <img
//                                                 src="https://haatdaas.lan-wan.net/partnerMsg/images/animation.gif"
//                                                 alt="Animated"
//                                             />
//                                         </div>
//                                         <WriteNoteModalPauseTask
//                                             ticketID={task.ticketID}
//                                             userID={task.user.userID}
//                                             workLogID={task.workLogID}
//                                             endType="pause"
//                                         />

//                                         <WriteNoteModalEndTask
//                                             ticketID={task.ticketID}
//                                             userID={task.user.userID}
//                                             workLogID={task.workLogID}
//                                             isPublished={task.isPublished}
//                                             isAppCheck={task.isAppCheck}
//                                             isCategorized={task.isCategorized}
//                                             departmentID={task.department.departmentID}
//                                             isTagged={task.isTagged}

//                                             isMessage={task.isMessage}
//                                             products={task.products}
//                                             endType="end"
//                                             ticketTypeID={task.ticketType.ticketTypeID}
//                                         />
//                                     </>

//                                 )}
//                             </>
//                         )}
//                     <TaskDescription task={task} />

//                     <div className="flex items-center gap-2">
//                         {(
//                             (userID === "3" || userID === "4" || userID === "5") ||
//                             (task.customStatus.customStatusID !== 10 && task.customStatus.customStatusID !== 12)
//                         ) && (
//                                 <EditTaskModal taskData={task} />
//                             )}

//                         {(userID === "3" || userID === "4" || userID === "5") &&
//                             <>
//                                 <IconWithTooltip iconName="Bug" tooltipTitle="Stuck products" onClick={goToProblemProductsPage} />
//                                 <IconWithTooltip iconName="History" tooltipTitle="Ticket history" onClick={goToHistoryPage} />

//                                 <DeleteValidationModal tooltipTitle='Delete task' alertDialogTitle='Are you sure you want to delete this task?' whichCmp='task' usefulVariable={task.ticketID} queryOptionalVariable='employeeId' usefulVariable2={task.customStatus.customStatusID} />
//                             </>
//                         }

//                     </div>
//                 </Box>
//             </Box>

//             <TooltipProvider >
//                 <Tooltip>
//                     <TooltipTrigger >
//                         <CardMedia
//                             onClick={goToProductsSheetView}
//                             component="img"
//                             sx={{
//                                 width: 100,
//                                 height: 100,
//                                 borderRadius: 100,
//                                 objectFit: 'cover',
//                                 cursor: 'pointer',
//                                 position: 'absolute',
//                                 right: 0,
//                                 top: 0
//                             }}
//                             image={
//                                 task.market?.logoURL?.startsWith('https:')
//                                     ? task.market.logoURL
//                                     : "https://haatdaas.lan-wan.net/daas/images/drLogo.png"
//                             }
//                             alt="Market-logo"
//                         />

//                     </TooltipTrigger>
//                     <TooltipContent>
//                         <p >View products </p>
//                     </TooltipContent>
//                 </Tooltip>
//             </TooltipProvider>



//             {toastProps && (
//                 <ToastComponent
//                     key={toastProps.key}
//                     variant={toastProps.variant}
//                     title={toastProps.title}
//                     description={toastProps.description}
//                 />
//             )}

//         </Card>
//     );
// };


import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import {
    ImageOff,
    UserCircle,
    Calendar as CalendarDays,
    Play,
    PauseCircle,
    CheckCircle2,
    Package,
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { WriteNoteModalPauseTask } from "../modals/WriteNoteModalPauseTask";
import { WriteNoteModalEndTask } from "../modals/WriteNoteModalEndTask";
import { routeService } from "../../services/route.service";

interface TasksCardPreviewProps {
    readonly task: any;
    readonly onStart: (taskId: number, userId: number) => void;
}

const truncate = (text: string, max = 24) => (text?.length > max ? `${text.slice(0, max)}…` : text || "");

const statusStyles: Record<
    number,
    { bg: string; text: string }
> = {
    8: { bg: "bg-sky-100", text: "text-sky-700" },      // Not Started
    9: { bg: "bg-amber-100", text: "text-amber-700" },  // In Progress
    10: { bg: "bg-emerald-100", text: "text-emerald-700" }, // Completed
    11: { bg: "bg-yellow-100", text: "text-yellow-700" },   // Paused
    12: { bg: "bg-rose-100", text: "text-rose-700" },       // Cancelled
};

function StatusBadge({ id, label }: { id?: number; label?: string }) {
    const s = id ? statusStyles[id] : null;
    const bg = s?.bg ?? "bg-slate-100";
    const tx = s?.text ?? "text-slate-700";
    return (
        <span className={`${bg} ${tx} text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {label || "Unknown Status"}
        </span>
    );
}

export const TasksCardPreview: React.FC<TasksCardPreviewProps> = ({ task, onStart }) => {
    const userID = Number(
        localStorage.getItem("USERTYPEID_TASKIFY")?.replace(/^"|"$/g, "") || 0
    );

    const navigate = useNavigate();

    const goToTaskProductsPage = (ticketID: number) => {
        if (!ticketID) return;
        const qp = new URLSearchParams({ ticketID: String(ticketID) }).toString();
        navigate(`${routeService.SHEET_PRODUCTS}?${qp}`); // or use your routeService.SHEET_PRODUCTS
    };

    const canShowActions = task?.customStatus?.customStatusID !== 10 && task?.customStatus?.customStatusID !== 12;

    const isInProgress = task?.customStatus?.customStatusID === 9 && !!task?.startDate;

    // const created = task?.createdDateTime
    //     ? format(new Date(task.createdDateTime), "dd/MM/yyyy HH:mm")
    //     : "N/A";

    const marketName = task?.market?.marketName || task?.market?.marketNameAr || "Unknown Market";
    const marketDisplayName = truncate(marketName, 14); // <= enforce 14-char cap + ellipsis
    const haatId = task?.market?.HaatBussID ?? "—";
    const logo = task?.market?.logoURL?.startsWith("https:")
        ? task.market.logoURL
        : "";

    const ticketId = task?.ticketID ?? "—";
    const ticketType = task?.ticketType?.ticketType || "Unknown type";
    const ticketQuantity = task?.quantity || "Unknown quantity";
    const employeeName = truncate(task?.user?.fullName || "Unknown Employee", 22);

    const cardVariants = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    };

    return (
        <TooltipProvider>
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
                className="bg-white h-[250px] rounded-xl p-4 shadow-sm hover:shadow-xl border border-gray-200/70 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer w-full" // 🔑 remove hardcoded width
                onClick={() => goToTaskProductsPage(task?.ticketID)}
            >
                {/* Header: Market avatar + name + Haat ID */}
                <div className="flex items-start gap-3 mb-2 shrink-0">
                    {logo ? (
                        <img
                            src={logo}
                            alt={marketName}
                            className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                            <ImageOff size={22} />
                        </div>
                    )}


                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] leading-tight text-slate-500" dir="rtl">
                            Haat ID: {haatId}
                        </p>
                        <h3
                            className="text-base leading-tight font-bold text-slate-800 truncate"
                            dir="rtl"
                            title={marketName}
                        >
                            {marketDisplayName}
                        </h3>
                    </div>
                </div>


                {/* Body */}
                <div className="space-y-2 mb-2 flex-1 min-h-0">
                    {/* Task ID + Type */}
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="rounded-full bg-slate-700 text-white text-[10px] px-2 py-0.5 font-medium shrink-0">
                            Task #{ticketId}
                        </span>
                        <span className="text-xs text-sky-600 font-semibold truncate" title={ticketType}>
                            {ticketType}
                        </span>

                    </div>


                    {/* Employee name */}
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate" title={task?.user?.fullName}>
                        <UserCircle size={14} /> {employeeName}
                    </p>
                    {/* <Tooltip>
                        <TooltipTrigger asChild> */}
                    <span
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700"
                        aria-label={`Quantity: ${ticketQuantity}`}
                    >
                        <Package size={14} className="opacity-70" />
                        <span className="tabular-nums">{ticketQuantity}</span>
                    </span>
                    {/* </TooltipTrigger>
                        <TooltipContent side="top">Products quantity</TooltipContent>
                    </Tooltip> */}




                    {/* Status + Created date */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="ml-auto">
                            <StatusBadge id={task?.customStatus?.customStatusID} label={task?.customStatus?.customStatus} />
                        </div>
                    </div>


                    <p className="text-[11px] text-slate-400 flex items-center justify-end gap-1 truncate">
                        <CalendarDays size={12} /> {task?.createdDateTime || "N/A"}
                    </p>
                </div>



                {isInProgress &&
                    (<div className="flex items-center gap-2 text-amber-700 text-xs">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span> In progress </div>)

                }

                {/* (Optional) Footer actions could sit here if you re-enable them; keep it compact for fixed height */}
            </motion.div>
        </TooltipProvider>
    );
};
