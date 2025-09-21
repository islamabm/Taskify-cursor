import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ErrorPage from '../cmps/ErrorPage';
import { Loader } from '../cmps/helpers/Loader';
import { logsService } from '../services/logs.service';
import { toastService } from '../services/toast.service';

import ToastComponent from '../cmps/helpers/ToastComponent';
import { TasksCardList } from '../cmps/TasksCards/TasksCardList';
import { tasksService } from '../services/task.service';
import { productsService } from '../services/products.service';
import { ProductsTable } from '../cmps/tables/ProductsTable';

import { Product } from '../types/commonTypes/commonTypes';
import { columnNames, excelConfig } from '../cmps/tablesConfig/ProductsConfig';
import { queryKeysService } from '../services/queryKeys.service';
import ChartList from '../cmps/statisticsCharts/ChartList';
import transition from '../transition';
import TaskStickyHeader from '../cmps/task_details/TaskStickyHeader';
import { utilService } from '../services/util.service';
import { routeService } from '../services/route.service';
import { navigateService } from '../services/navigate.service';

const ProblemProductsPage: React.FC = () => {
    /**
     * We rename `searchParams` to `urlSearchParams` for clarity,
     * 
     * since it references the URL's query string parameters.
     */
    const [urlSearchParams] = useSearchParams();

    const navigate = useNavigate()
    /**
     * We rename `ticketID` to `selectedTicketID` to more clearly express
     * that this is a user-selected (or URL-derived) ticket ID.
     */
    const selectedTicketID = urlSearchParams.get('ticketID') ?? '';

    /**
     * We rename `toastProps` to `toastConfig` to make it clear
     * that it holds configuration data for the toast message.
     */
    const [toastConfig, setToastConfig] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    // React Query Client for invalidating or refetching queries
    const queryClient = useQueryClient();

    /**
     * Fetch product data for the selected ticket.
     * - `enabled: !!selectedTicketID` ensures we only run this query if a ticket ID is present in the URL.
     */
    const {
        data: productsData,
        isError: isProductsError,
        error: productsError,
        isLoading: isProductsLoading,
    } = useQuery({
        queryKey: [queryKeysService.MARKET_PRODUCTS, queryKeysService.PROBLEM_PRODUCTS, selectedTicketID],
        queryFn: () => productsService.getProductsByTicketID(Number(selectedTicketID)),
        enabled: !!selectedTicketID,
    });

    /**
     * Fetch ticket data for the selected ticket.
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

    // -------------------------------------------------------------------------
    // Error and Loading Handling
    // -------------------------------------------------------------------------
    if (isProductsError) {
        return (
            <ErrorPage
                errorText={`Error fetching products. Please try again later. ${(productsError as Error)?.message || ''
                    }`}
            />
        );
    }
    if (isTicketError) {
        return (
            <ErrorPage
                errorText={`Error fetching ticket info. Please try again later. ${(ticketError as Error)?.message || ''
                    }`}
            />
        );
    }
    if (
        isProductsLoading ||
        isTicketLoading ||
        !productsData ||
        !Array.isArray(productsData.data) ||
        !selectedTicket
    ) {
        // If still loading or data is missing, show a loader
        return <Loader />;
    }

    // -------------------------------------------------------------------------
    // Event Handlers
    // -------------------------------------------------------------------------
    /**
     * handleStartTask: Logs a "start" action for the given task, invalidates relevant queries,
     * and shows a toast to confirm success or error.
     */
    const handleStartTask = async (taskId: number, userID: number) => {
        try {
            const logData = {
                ticket: { ticketID: taskId },
                user: { userID: userID },
            };

            // Insert a log to mark the task as "started".
            await logsService.insertLog(logData);

            // Invalidate queries to ensure UI gets updated
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, selectedTicketID] });

            // Show success toast
            toastService.showToast(setToastConfig, 'Task started successfully!', 'success');
        } catch (err) {
            // In case of error, we log and notify the user
            toastService.showToast(
                setToastConfig,
                `Error occurred while starting the task. ${(err as Error).message
                }. Please pause or end the task and try again.`,
                'destructive'
            );
        }
    };

    /**
     * Filter out products with specific custom status ID (19).
     * We rename `productsToRender` to `filteredProducts` for clarity.
     */
    const filteredProducts = productsData.data.filter(
        (product) => product.customStatus?.customStatusID === 19
    );

    // -------------------------------------------------------------------------
    // Inline styles for container
    // -------------------------------------------------------------------------
    const containerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '98vw', // near full screen width
        marginTop: '20px', // some margin for aesthetics
    };





    // function goToHistoryPage() {
    //     const task = selectedTicket.data;
    //     const ticketID = task.ticketID?.toString() || '';
    //     const queryParams = new URLSearchParams({ ticketID }).toString();
    //     navigateService.handleNavigation(navigate, `${routeService.WORKLOGS_BY_TICKET_ID}?${queryParams}`);
    // }





    function goToHistoryPage() {
        const task = selectedTicket.data;
        const ticketID = task.ticketID?.toString() || '';
        const queryParams = new URLSearchParams({ ticketID }).toString();
        navigateService.handleNavigation(navigate, `${routeService.WORKLOGS_BY_TICKET_ID}?${queryParams}`);
    }





    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <>
            {/* 
        Renders the selected ticket in a card list format,
        along with the "Start Task" button in each card.
      */}
            {/* <div className="flex flex-col items-center gap-2">
            
                <TasksCardList tasks={[selectedTicket.data]} onStart={handleStartTask} />


            </div> */}
            <TaskStickyHeader
                task={selectedTicket.data}
                onStart={handleStartTask}
                onGoHistory={goToHistoryPage}

                userRoleId={localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || ''}
                formatDuration={utilService.formatDuration}

            />

            {/* 
        Renders products table for products with customStatusID === 19
      */}
            <div style={containerStyles}>
                <ProductsTable<Product>
                    products={filteredProducts}
                    columnVisibilityName="ProductsTable"
                    placeHolder="Filter products by name ..."
                    filterColumnName="prodName"
                    tableTitle="Products"
                    columnNames={columnNames}
                    ticketID={+selectedTicketID}
                    excelConfig={excelConfig}
                    inputTableName="prodName"
                />

                {/* If a toastConfig object exists, show it here */}
                {toastConfig && (
                    <ToastComponent
                        key={toastConfig.key}
                        variant={toastConfig.variant}
                        title={toastConfig.title}
                        description={toastConfig.description}
                    />
                )}
            </div>
        </>
    );
};

// export default ProblemProductsPage;
export default transition(ProblemProductsPage);
