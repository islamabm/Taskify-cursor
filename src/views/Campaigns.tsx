import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import transition from '../transition';
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import { ToastProps } from '../types/commonTypes/commonTypes';
import { tasksService } from '../services/task.service';
import { logsService } from '../services/logs.service';
import { toastService } from '../services/toast.service';
import ToastComponent from '../cmps/helpers/ToastComponent';
import AutoCompleteBusinesses from '../cmps/AutoCompleteBusinesses';
import { NoTasksFound } from '../cmps/NoTasksFound';
import { queryKeysService } from '../services/queryKeys.service';
import StatisticsModal from '../cmps/StatisticsModal';
import StatsSheet from '../cmps/StatsSheet';
import TasksBoard, { buildTaskRows } from '../cmps/TasksBoard';

import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TabletSmartphone } from 'lucide-react';

/**
 * Tasks component fetches and displays a list of tasks.
 * It supports toggling between table and card views, searching tasks by partner,
 * and starting tasks (which logs user actions).
 */
function Campaigns() {
    // Toast messaging state
    const [toastConfig, setToastConfig] = useState<ToastProps | null>(null);


    // Controls whether tasks are displayed in table or card mode
    const [taskViewMode, setTaskViewMode] = useState<'table' | 'cards'>('cards');
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);

    const handleOpenChartModal = () => {
        setIsChartModalOpen(true);
    };

    const handleCloseChartModal = () => {
        setIsChartModalOpen(false);
    };

    // Hooks to manage route-based state
    const location = useLocation();
    const navigate = useNavigate();

    // Extract partner info from URL search params (if provided)
    const searchParams = new URLSearchParams(location.search);
    const urlSearchPartnerID = searchParams.get('partnerID') ?? '';
    const urlSearchPartnerName = searchParams.get('partnerName') ?? '';

    // Local state for partner selection; these should sync with URL
    const [selectedPartnerID, setSelectedPartnerID] = useState<string>(urlSearchPartnerID);
    const [selectedPartnerName, setSelectedPartnerName] = useState<string>(urlSearchPartnerName);

    // React Query Client for invalidating queries (forcing refetch)
    const queryClient = useQueryClient();

    // For demonstration, we read the user's type from localStorage (typical authentication store)
    const userTypeID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '');

    /**
     * Load saved view mode from local storage on mount.
     */
    useEffect(() => {
        const savedViewMode = localStorage.getItem('TASKS_VIEW_MODE');
        if (savedViewMode === 'table' || savedViewMode === 'cards') {
            setTaskViewMode(savedViewMode as 'table' | 'cards');
        }
    }, []);

    /**
     * Whenever the task view mode changes, persist that choice in local storage.
     */
    useEffect(() => {
        localStorage.setItem('TASKS_VIEW_MODE', taskViewMode);
    }, [taskViewMode]);

    /**
     * Keep local states `selectedPartnerID` & `selectedPartnerName`
     * in sync with the URL whenever search params change.
     */
    useEffect(() => {
        setSelectedPartnerID(urlSearchPartnerID);
        setSelectedPartnerName(urlSearchPartnerName);
    }, [urlSearchPartnerID, urlSearchPartnerName]);

    /**
     * React Query to fetch tasks or search by partner if a partner ID is present.
     */
    const {
        data: tasksResponse,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.TASKS, selectedPartnerID],
        queryFn: async () => {
            if (selectedPartnerID) {
                return tasksService.searchTasks(Number(selectedPartnerID));
            } else {
                return tasksService.searchTasksByType(49);
            }
        },
        // Optional: You can add a `retry` prop to handle certain error scenarios gracefully
        retry: 1,
    });

    /**
     * Handle toggling between 'table' and 'cards' view.
     * We name it `handleViewModeChange` for clarity.
     */
    const handleViewModeChange = useCallback(
        (event: React.MouseEvent<HTMLElement>, nextView: string) => {
            setTaskViewMode(nextView === 'list' ? 'table' : 'cards');
        },
        []
    );

    /**
     * Start a task: Insert a log via the logsService
     * and refetch tasks to ensure UI is updated.
     */
    const handleTaskStart = useCallback(
        async (taskId: number, userID: number) => {
            try {
                const logData = {
                    ticket: { ticketID: taskId },
                    user: { userID: userID },
                };
                await logsService.insertLog(logData);

                // After a successful start, invalidate tasks to refetch
                queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });

                // Scroll the page to top for user feedback
                window.scrollTo(0, 0);

                // Show success toast
                toastService.showToast(
                    setToastConfig,
                    'Task started successfully!',
                    'success'
                );
            } catch (error) {
                // Show error toast if something goes wrong
                toastService.showToast(
                    setToastConfig,
                    `Error starting task: ${(error as Error)?.message}. Please try again.`,
                    'destructive'
                );
            }
        },
        [queryClient]
    );

    /**
     * Called when a partner is selected from the autocomplete.
     * We update the URL with new partner info so that it persists across reloads.
     */
    function handleSelectPartner(partnerID: string, partnerName: string) {
        const params = new URLSearchParams(location.search);
        params.set('partnerID', partnerID);
        params.set('partnerName', partnerName);

        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });
    }

    /**
     * Called when search is canceled.
     * We remove partner filters from the URL to reset the search.
     */
    function handleClearPartnerSearch() {
        const params = new URLSearchParams(location.search);
        params.delete('partnerID');
        params.delete('partnerName');

        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });

        window.location.reload();
    }

    // --- Error and loading states ---
    /**
     * Show a generic error page if an error is encountered
     * (e.g., network issue, server error).
     */
    if (isError) {
        return (
            <ErrorPage
                errorText={`Error fetching tasks. Please try again later. ${(error as Error)?.message || 'Unknown error'
                    }`}
            />
        );
    }

    // If userTypeID is missing, the user is not logged in properly
    if (!userTypeID) {
        return <ErrorPage errorText="User type not found. Please log in again." />;
    }

    // Show loader if we are fetching tasks or if the data hasn't arrived yet
    if (isLoading || !tasksResponse || !Array.isArray(tasksResponse.data)) {
        return <Loader />;
    }

    console.log("tasksResponse.data", tasksResponse.data)
    const flattenedTasks = tasksResponse.data
        .filter((task) => task.market !== null)
        .map((task) => ({
            ...task,
            marketName: task.market?.marketName || '',
        }));

    // --- Data processing ---
    /**
     * Calculate stats for the tasks (e.g., total tasks, completed tasks, etc.).
     * This data is displayed in `StatsCardList`.
     */
    const statsData = tasksService.calculateCampaignsStats(flattenedTasks);

    const handleToggleView = (_e: React.MouseEvent<HTMLElement>, next: "status" | "cards" | "table" | null) => {
        if (next) setTaskViewMode(next);
    };
    /**
     * Flatten out the tasks array so we can store related
     * market data on each task (like `marketName`).
     */


    /**
     * UX Suggestion: 
     * - If we wanted to highlight newly started tasks, we could keep
     *   a local state that tracks which tasks have been started and show
     *   a special badge or background color.
     * - Consider adding confirmation modals before major actions, like “Start Task,”
     *   if that action has serious side effects (just a design consideration).
     */
    const rows = buildTaskRows(flattenedTasks);

    return (
        <section className="p-6 mt-[120px] sm:mt-0">
            <div className='flex mb-3 items-center gap-4'>
                <StatsSheet stats={statsData} />
                <ToggleButtonGroup
                    value={taskViewMode}
                    exclusive
                    onChange={handleToggleView}
                    aria-label="view mode"
                    size="small"
                    color="primary"
                >
                    <ToggleButton value="status" aria-label="Grouped by Status">
                        <ViewListIcon />
                    </ToggleButton>
                    <ToggleButton value="cards" aria-label="Cards">
                        <ViewModuleIcon />
                    </ToggleButton>
                    <ToggleButton value="table" aria-label="Table">
                        <TabletSmartphone />
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            {/* <div className="flex items-center justify-center gap-3">
                    <AutoCompleteBusinesses
                        onSelectPartner={handleSelectPartner}
                        initialHaatBussID={+selectedPartnerID}
                        initialMarketName={selectedPartnerName}
                    />
                    <Button onClick={handleClearPartnerSearch}>Cancel Search</Button>
                </div> */}


            {flattenedTasks.length === 0 ? (
                <NoTasksFound partnerName={selectedPartnerName} />
            ) : (
                <TasksBoard
                    tasks={flattenedTasks}
                    rows={rows}
                    viewMode={taskViewMode}
                    onStart={handleTaskStart}
                />
            )}

            {toastConfig && (
                <ToastComponent
                    key={toastConfig.key}
                    variant={toastConfig.variant}
                    title={toastConfig.title}
                    description={toastConfig.description}
                />
            )}
            <StatisticsModal isOpen={isChartModalOpen} onClose={handleCloseChartModal} tasksData={tasksResponse.data} />
        </section>
    );
}

export default transition(Campaigns);
