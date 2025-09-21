import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import ErrorPage from '../cmps/ErrorPage';
import { Loader } from '../cmps/helpers/Loader';
import { logsService } from '../services/logs.service';
import { toastService } from '../services/toast.service';
import ToastComponent from '../cmps/helpers/ToastComponent';

import { tasksService } from '../services/task.service';

import { queryKeysService } from '../services/queryKeys.service';


import { TasksCardPreview } from '../cmps/TasksCards/TasksCardPreview';

import transition from '../transition';
import CampaignDetailsModern from '../cmps/CampaignDetailsModern';


/**
 * MarkerProductsFromSheetPage
 * Fetches products for a specific "ticket" (task), renders them,
 * and displays an option to "start" the task if needed.
 */
const CampaignDetails: React.FC = () => {
    /**
     * We rename `searchParams` to `urlSearchParams` to emphasize its purpose
     * as the hook for reading URL query parameters.
     */
    const [urlSearchParams] = useSearchParams();


    /**
     * Renames `ticketID` to `selectedTicketID` to clarify that
     * it references the user's (or URL's) current ticket.
     */
    const selectedTicketID = urlSearchParams.get('ticketID') ?? '';

    /**
     * Using `toastConfig` instead of `toastProps` to make it clear
     * it's an object controlling how the toast will display.
     */
    const [toastConfig, setToastConfig] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    // Set up React Query's query client for invalidating/refetching queries later
    const queryClient = useQueryClient();

    // ---------------------------------------------------------------------------
    // FETCH PRODUCTS DATA
    // ---------------------------------------------------------------------------
    /**
     * Fetch market products data for the selected ticket.
     * `enabled: !!selectedTicketID` ensures this only runs when a valid ticket ID is present.
     */


    // ---------------------------------------------------------------------------
    // FETCH TICKET (TASK) DATA
    // ---------------------------------------------------------------------------
    /**
     * Fetch the ticket (task) details for the selected ticket ID.
     */
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

        // Invalidate and refetch the products and ticket data when the selected ticket ID changes

    }, []);



    // ---------------------------------------------------------------------------
    // ERROR / LOADING HANDLING
    // ---------------------------------------------------------------------------

    if (isTicketError) {
        return (
            <ErrorPage
                errorText={`Error fetching ticket data. Please try again later. ${(ticketError as Error)?.message || ''
                    }`}
            />
        );
    }
    if (
        isTicketLoading ||
        !selectedTicket
    ) {
        return <Loader />;
    }



    // ---------------------------------------------------------------------------
    // TASK START HANDLER
    // ---------------------------------------------------------------------------
    /**
     * handleStartTask: Logs a "start" action for a given task, invalidates queries,
     * and shows appropriate success/error toast messages.
     */
    const handleStartTask = async (taskId: number, userID: number) => {
        try {
            const logData = { ticket: { ticketID: taskId }, user: { userID: +userID } };
            await logsService.insertLog(logData);

            // Force React Query to refetch relevant queries so UI is up-to-date
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, selectedTicketID] });

            toastService.showToast(setToastConfig, 'Task started successfully!', 'success');
        } catch (err) {
            toastService.showToast(
                setToastConfig,
                `Error occurred while starting the task. ${(err as Error).message
                }. Please pause or end the task and try again.`,
                'destructive'
            );
        }
    };








    console.log("selectedTicket")


    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="p-4">
                    <TasksCardPreview task={selectedTicket.data} onStart={handleStartTask} />
                </div>

                <div className="col-span-1 lg:col-span-1">
                    <CampaignDetailsModern
                        content={selectedTicket.data.content}
                        designImageURL={selectedTicket.data.designImageURL}
                    // meta={{ id: selectedTicket.data.ticketID, title: selectedTicket.data.title }}
                    />
                </div>
            </div>





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


export default transition(CampaignDetails);
