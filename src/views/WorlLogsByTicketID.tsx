import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ErrorPage from '../cmps/ErrorPage';
import { Loader } from '../cmps/helpers/Loader';
import { logsService } from '../services/logs.service';
import { toastService } from '../services/toast.service';
import ToastComponent from '../cmps/helpers/ToastComponent';
import { tasksService } from '../services/task.service';
import { LogByTicketID } from '../types/commonTypes/commonTypes';
import { columnNames, excelConfig } from '../cmps/tablesConfig/ProductsConfig';
import { queryKeysService } from '../services/queryKeys.service';
import { WorkLogsByTicketIDTable } from '../cmps/tables/WorkLogsByTicketIDTable';
import { utilService } from '../services/util.service';
import transition from '../transition';
import NoLogsFoundForTicket from '../cmps/NoLogsFoundForTicket';
import TaskStickyHeader from '../cmps/task_details/TaskStickyHeader';
import StatsBalloons from '../cmps/task_details/StatsBalloons';
import { navigateService } from '../services/navigate.service';
import { routeService } from '../services/route.service';

const WorlLogsByTicketID: React.FC = () => {
    const [urlSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const selectedTicketID = urlSearchParams.get('ticketID') ?? '';
    const [toastConfig, setToastConfig] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const queryClient = useQueryClient();

    // ---------------------------------------------------------------------------
    // FETCH WORK LOGS (by ticket ID)
    // ---------------------------------------------------------------------------
    const {
        data: workLogsByTicketIDData,
        isError: isWorkLogsError,
        error: workLogsError,
        isLoading: isWorkLogsLoading,
    } = useQuery({
        queryKey: [queryKeysService.WORK_LOGS_BY_TICKET_ID, selectedTicketID],
        queryFn: () => logsService.getWorkLogsByTicketID(Number(selectedTicketID)),
        enabled: !!selectedTicketID,
    });

    // ---------------------------------------------------------------------------
    // FETCH TICKET DATA (the task itself)
    // ---------------------------------------------------------------------------
    const {
        data: selectedTicket,
        isError: isTicketError,
        error: ticketError,
        isLoading: isTicketLoading,
    } = useQuery({
        queryKey: [queryKeysService.TICKET, selectedTicketID],
        queryFn: () => tasksService.getTaskByID(Number(selectedTicketID)),
        enabled: !!selectedTicketID,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ---------------------------------------------------------------------------
    // ERROR / LOADING HANDLING
    // ---------------------------------------------------------------------------
    if (isWorkLogsError) {
        return (
            <ErrorPage
                errorText={`Error fetching logs. Please try again later. ${(workLogsError as Error)?.message || ''
                    }`}
            />
        );
    }
    if (isTicketError) {
        return (
            <ErrorPage
                errorText={`Error fetching ticket data. Please try again later. ${(ticketError as Error)?.message || ''
                    }`}
            />
        );
    }

    // If still loading or data missing, show loader
    if (
        isWorkLogsLoading ||
        isTicketLoading ||
        !workLogsByTicketIDData ||
        !selectedTicket ||
        !Array.isArray(workLogsByTicketIDData.data)
    ) {
        return <Loader />;
    }

    // ---------------------------------------------------------------------------
    // TASK START HANDLER
    // ---------------------------------------------------------------------------
    const handleStartTask = async (taskId: number, userID: number) => {
        try {
            const logData = {
                ticket: { ticketID: taskId },
                user: { userID: +userID },
            };
            await logsService.insertLog(logData);

            // Refetch queries to refresh the UI
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            queryClient.invalidateQueries({
                queryKey: [queryKeysService.TICKET, selectedTicketID],
            });

            toastService.showToast(
                setToastConfig,
                'Task started successfully!',
                'success'
            );
        } catch (err) {
            toastService.showToast(
                setToastConfig,
                `Error occurred while starting the task. ${(err as Error).message
                }. Please pause or end the task and try again.`,
                'destructive'
            );
        }
    };

    // ---------------------------------------------------------------------------
    // STYLES
    // ---------------------------------------------------------------------------
    const containerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '98vw',
        marginTop: '20px',
    };

    // ---------------------------------------------------------------------------
    // SAFE HANDLING OF ZERO OR MANY LOGS
    // ---------------------------------------------------------------------------
    const logsData = workLogsByTicketIDData.data;
    const hasLogs = logsData.length > 0;

    // If there *are* logs, define statsData safely:
    let statsData: Array<{ title: string; number: string | number; titleBackgroundColor: string }> =
        [];
    if (hasLogs) {
        const firstLog = logsData[0];
        // Safely handle if there's no ticket or user object:
        const duration = firstLog?.ticket?.duration || 0;
        const fullName = firstLog?.user?.fullName || 'No user name';
        statsData = [
            {
                title: 'Work duration',
                number: utilService.formatDuration(duration),
                titleBackgroundColor: '#e06666',
            },
            {
                title: 'User',
                number: fullName,
                titleBackgroundColor: '#9fc5e8',
            },
            {
                title: 'Total logs',
                number: logsData.length,
                titleBackgroundColor: '#ffe599',
            },
        ];
    }


    function goToProblemProductsPage() {
        const task = selectedTicket.data;
        if (task.ticketType?.ticketTypeID !== 6) {
            toastService.showToast(setToastConfig, "This task is not related to task type sheet.", "destructive");
            return;
        }
        const ticketID = task.ticketID?.toString() || '';
        const queryParams = new URLSearchParams({ ticketID }).toString();
        navigateService.handleNavigation(navigate, `${routeService.PROBLEM_PRODUCTS}?${queryParams}`);
    }


    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------
    return (
        <>

            <TaskStickyHeader
                task={selectedTicket.data}
                onStart={handleStartTask}
                onGoProblems={goToProblemProductsPage}

                userRoleId={localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || ''}
                formatDuration={utilService.formatDuration}

            />
            {/* If we do have logs, render stats cards; else show a fallback */}
            {hasLogs ? (
                // <StatsCardList cards={statsData} />
                <StatsBalloons
                    items={statsData.map(s => ({
                        title: s.title,
                        number: s.number,
                        color: s.titleBackgroundColor, // reusing your existing colors for the glow
                    }))}
                    countUp
                />
            ) : (

                <NoLogsFoundForTicket selectedTicketID={selectedTicketID} />
            )}
            {/* </div> */}

            {/* If we have logs, render the WorkLogs table */}
            {hasLogs && (
                <div className='max-w-full' style={containerStyles}>
                    <WorkLogsByTicketIDTable<LogByTicketID>
                        logs={logsData}
                        columnVisibilityName="workLogsTableByTicketID"
                        placeHolder="Filter logs by name ..."
                        filterColumnName="prodName"
                        tableTitle="Products"
                        columnNames={columnNames}
                        excelConfig={excelConfig}
                        inputTableName="prodName"
                    />
                </div>
            )}

            {/* Show a toast if configured */}
            {toastConfig && (
                <ToastComponent
                    key={toastConfig.key}
                    variant={toastConfig.variant}
                    title={toastConfig.title}
                    description={toastConfig.description}
                />
            )}
        </>
    );
};

export default transition(WorlLogsByTicketID);
