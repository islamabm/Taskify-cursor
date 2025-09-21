import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from "../../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Badge } from "../../components/ui/badge";
import {
    Play, Bug, History, MoreHorizontal, User, Calendar, Tag, MonitorUp,
    Clock, Info as InfoIcon, Wrench
} from 'lucide-react';

// Your existing components
import { WriteNoteModalPauseTask } from '../modals/WriteNoteModalPauseTask';
import { WriteNoteModalEndTask } from '../modals/WriteNoteModalEndTask';
import { TaskDescription } from '../TasksCards/TaskDescription';
import { EditTaskModal } from '../modals/EditTaskModal';
import { DeleteValidationModal } from '../modals/DeleteValidationModal';
import TicketIndicator from './TicketIndicator';

import SmartProgress from '../task_details/SmartProgress';
import ProductsPieMini from '../task_details/ProductsPieMini'; // NEW

// --- Types (extended with optional endDate/finishDate) ---
type Product = {
    customStatus?: { customStatusID?: number; customStatus?: string };
};

type Ticket = {
    ticketID: number;
    market: { marketName: string; HaatBussID?: string; logoURL?: string };
    user?: { userID: number; fullName: string };
    createdDateTime?: string;
    startDate?: string | null;
    endDate?: string | null;
    finishDate?: string | null;
    products?: Product[];
    problemsProducts?: Product[];
    ticketType?: { ticketTypeID?: number; ticketType?: string };
    customStatus?: { customStatusID?: number; customStatus?: string };
    duration?: number;
    department?: { departmentID: number };
    isPublished?: boolean;
    isAppCheck?: boolean;
    isCategorized?: boolean;
    isTagged?: boolean;
    workLogID?: number;
    isMessage?: boolean;
};

export type TaskStickyHeaderProps = {
    task: Ticket;
    onStart: (taskId: number, userId: number) => void;
    onGoProducts?: () => void;
    onGoProblems?: () => void;
    onGoHistory?: () => void;
    userRoleId: string;
    formatDuration?: (seconds?: number) => string;
    /** Slim footer progress bar */
    progress?: {
        current: number;
        total: number;
        showPercent?: boolean;
        label?: string;
    };
    /** NEW: Mini pie chart inside header */
    chart?: {
        title?: string;
        labels: string[];
        values: number[];
    };
};

// ---------- Date helpers ----------
function parseMixedDate(input?: string | null): Date | null {
    if (!input) return null;
    if (/\d{4}-\d{2}-\d{2}T/.test(input)) {
        const d = new Date(input);
        return isNaN(d.getTime()) ? null : d;
    }
    const match = input.match(
        /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
    );
    if (!match) return null;
    const [, ddStr, mmStr, yyyyStr, hhStr, minStr, ssStr] = match;
    const dd = Number(ddStr), mm = Number(mmStr), yyyy = Number(yyyyStr);
    const hh = hhStr ? Number(hhStr) : 0;
    const min = minStr ? Number(minStr) : 0;
    const ss = ssStr ? Number(ssStr) : 0;
    const d = new Date(yyyy, mm - 1, dd, hh, min, ss);
    return isNaN(d.getTime()) ? null : d;
}
function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function formatFullLocal(dateLike?: string | null): string {
    const d = parseMixedDate(dateLike);
    if (!d) return '';
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ---------- Style helpers ----------
const statusBadge = (statusId?: number) => {
    switch (statusId) {
        case 10: return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Completed' };
        case 12: return { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Cancelled' };
        case 9: return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', label: 'In Progress' };
        default: return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300', label: 'Pending' };
    }
};

// ---------- Subcomponents ----------
const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value?: React.ReactNode }> = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2 min-w-0">
            <div className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-normal break-words">
                    {value}
                </div>
            </div>
        </div>
    );
};

// ---------- Main ----------
const TaskStickyHeader: React.FC<TaskStickyHeaderProps> = ({
    task,
    onStart,
    onGoProducts,
    onGoProblems,
    onGoHistory,
    userRoleId,
    formatDuration = (seconds) => (seconds ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : '0s'),
    progress,
    chart, // NEW
}) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const isCompleted = task.customStatus?.customStatusID === 10;
    const isCancelled = task.customStatus?.customStatusID === 12;
    const isInProgress = task.customStatus?.customStatusID === 9;
    const hasStarted = !!task.startDate;
    const canShowActions = !isCompleted && !isCancelled;
    const showRoleActions = ['3', '4', '5'].includes(userRoleId);

    const safeLogo =
        task.market?.logoURL && task.market.logoURL.startsWith('https:')
            ? task.market.logoURL
            : 'https://haatdaas.lan-wan.net/daas/images/drLogo.png';

    const status = statusBadge(task.customStatus?.customStatusID);
    const endDate = task.finishDate ?? task.endDate ?? null;

    const ActionButtons = () => (
        <div className="flex items-center gap-2">
            {canShowActions && (
                <>
                    {!isInProgress || !hasStarted ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        onClick={() => task.user?.userID && onStart(task.ticketID, task.user.userID)}
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                        aria-label="Start task"
                                    >
                                        <Play className="w-4 h-4 mr-1" /> Start
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Start working on this task</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <div className="flex items-center gap-3">
                            <motion.div aria-hidden animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Running</span>
                            <WriteNoteModalPauseTask ticketID={task.ticketID} userID={task.user?.userID || 0} workLogID={task.workLogID} endType="pause" />
                            <WriteNoteModalEndTask
                                ticketID={task.ticketID}
                                userID={task.user?.userID || 0}
                                workLogID={task.workLogID}
                                isPublished={task.isPublished}
                                isAppCheck={task.isAppCheck}
                                isCategorized={task.isCategorized}
                                departmentID={task.department?.departmentID || 0}
                                isTagged={task.isTagged}
                                isMessage={task.isMessage}
                                products={task.products || []}
                                endType="end"
                                ticketTypeID={task.ticketType?.ticketTypeID || 0}
                            />
                        </div>
                    )}
                </>
            )}


            {showRoleActions && (
                <>
                    {task.ticketType?.ticketTypeID === 6 &&


                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={onGoProblems} aria-label="Open stuck products">
                                        <Bug className="w-4 h-4 mr-1" /> Issues
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>View stuck products</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    }

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={onGoHistory} aria-label="Open history">
                                    <History className="w-4 h-4 mr-1" /> History
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>View task history</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>


                    <DeleteValidationModal
                        tooltipTitle="Delete task"
                        alertDialogTitle="Are you sure you want to delete this task?"
                        whichCmp="task"
                        usefulVariable={task.ticketID}
                        queryOptionalVariable="employeeId"
                        usefulVariable2={task.customStatus?.customStatusID}
                    />
                </>
            )}
            <TaskDescription task={task} />
            <EditTaskModal taskData={task} />
        </div>
    );

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 z-40 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 shadow-lg mb-6 relative"
        >
            {/* bottom padding so the absolute progress footer has room */}
            <div className="px-5 py-6 pb-12">
                {/* Row 1: Identity + status + actions */}
                <div className="flex items-start justify-between gap-4">
                    {/* Left cluster */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <button
                            onClick={onGoProducts}
                            className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
                            aria-label="Open products"
                        >
                            <img
                                src={safeLogo}
                                alt={task.market?.marketName || 'Market'}
                                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                            />
                        </button>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">
                                    {task.market?.marketName}
                                </h1>
                                <Badge className={status.color}>{status.label}</Badge>
                                {task.customStatus?.customStatus && (
                                    <span className="text-sm text-gray-600 dark:text-gray-300 inline-flex items-center gap-1">
                                        <InfoIcon className="w-4 h-4" />
                                        {task.customStatus.customStatus}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <span className="inline-flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> #{task.ticketID}
                                </span>
                                {task.market?.HaatBussID && <span>ID: {task.market.HaatBussID}</span>}
                                {task.ticketType?.ticketType && (
                                    <Badge variant="outline" className="text-xs">{task.ticketType.ticketType}</Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right cluster – desktop actions */}
                    <div className="hidden md:block pt-1">
                        <ActionButtons />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowMobileMenu((v) => !v)}
                            aria-label="Open actions menu"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Row 2: Details + (NEW) Pie chart */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Block A: Dates & people */}
                    <div className="bg-white/60 dark:bg-gray-800/40 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InfoItem icon={<Calendar className="w-3.5 h-3.5" />} label="Created" value={formatFullLocal(task.createdDateTime)} />
                            <InfoItem icon={<Clock className="w-3.5 h-3.5" />} label="Start" value={formatFullLocal(task.startDate)} />
                            <InfoItem icon={<Clock className="w-3.5 h-3.5" />} label="End" value={formatFullLocal(endDate)} />
                            <InfoItem icon={<User className="w-3.5 h-3.5" />} label="Assignee" value={task.user?.fullName} />
                            <InfoItem icon={<Clock className="w-3.5 h-3.5" />} label="Duration" value={typeof task.duration !== 'undefined' ? (typeof formatDuration === 'function' ? formatDuration(task.duration) : '') : undefined} />
                        </div>
                    </div>

                    {/* Block B: (NEW) Pie chart */}
                    {chart && task.ticketType?.ticketTypeID === 6 && (
                        <div className="md:col-span-2">
                            <ProductsPieMini
                                title={chart.title ?? 'Statistics Overview'}
                                labels={chart.labels}
                                values={chart.values}
                            />
                        </div>
                    )}
                </div>

                {/* Indicators */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Wrench className="h-5 w-5 shrink-0 text-gray-500" />
                    <TicketIndicator label="App Check" exists={!!task.isAppCheck} />
                    <TicketIndicator label="Message" exists={!!task.isMessage} />
                    <TicketIndicator label="Published" exists={!!task.isPublished} />
                    <TicketIndicator label="Categorized" exists={!!task.isCategorized} />
                    <TicketIndicator label="Tagged" exists={!!task.isTagged} />
                </div>

                {/* Mobile actions */}
                {showMobileMenu && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 md:hidden"
                    >
                        <ActionButtons />
                    </motion.div>
                )}
            </div>

            {/* Progress Footer (inside the header, docked to bottom) */}
            {progress && task.ticketType?.ticketTypeID === 6 && (
                <div className="absolute inset-x-5 bottom-3">
                    <SmartProgress
                        current={progress.current}
                        total={progress.total}
                        showPercent={progress.showPercent ?? true}
                        label={progress.label}
                        barHeightClass="h-2"
                        className="drop-shadow-sm"
                    />
                </div>
            )}
        </motion.header>
    );
};

export default memo(TaskStickyHeader);
