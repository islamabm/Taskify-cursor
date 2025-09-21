import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';

import ErrorPage from '../cmps/ErrorPage';
import { Loader } from '../cmps/helpers/Loader';
import { logsService } from '../services/logs.service';
import { toastService } from '../services/toast.service';
import ToastComponent from '../cmps/helpers/ToastComponent';
import { tasksService } from '../services/task.service';
import { productsService } from '../services/products.service';
import { ProductsTable } from '../cmps/tables/ProductsTable';

import { Product } from '../types/commonTypes/commonTypes';
import { columnNames, excelConfig } from '../cmps/tablesConfig/ProductsConfig';
import { queryKeysService } from '../services/queryKeys.service';
import transition from '../transition';


import { navigateService } from '../services/navigate.service';
import { routeService } from '../services/route.service';
import { utilService } from '../services/util.service';
import TaskStickyHeader from '../cmps/task_details/TaskStickyHeader';
import SmartProgress from '../cmps/task_details/SmartProgress';
import ProductsChartModern from '../cmps/task_details/ProductsChartModern';
import CampaignDetailsModern from '../cmps/CampaignDetailsModern';

const MarkerProducts: React.FC = () => {
    const [urlSearchParams] = useSearchParams();
    const selectedTicketID = urlSearchParams.get('ticketID') ?? '';
    const [toastConfig, setToastConfig] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Fetch products
    const {
        data: marketProductsData,
        isError: isProductsError,
        error: productsError,
        isLoading: isProductsLoading,
    } = useQuery({
        queryKey: [queryKeysService.MARKET_PRODUCTS, selectedTicketID],
        queryFn: () => productsService.getProductsByTicketID(Number(selectedTicketID)),
        enabled: !!selectedTicketID,
    });

    // Fetch ticket
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

    if (isProductsError) {
        return (
            <ErrorPage
                errorText={`Error fetching products. Please try again later. ${(productsError as Error)?.message || ''}`}
            />
        );
    }
    if (isTicketError) {
        return (
            <ErrorPage
                errorText={`Error fetching ticket data. Please try again later. ${(ticketError as Error)?.message || ''}`}
            />
        );
    }
    if (
        isProductsLoading ||
        isTicketLoading ||
        !marketProductsData ||
        !selectedTicket ||
        !Array.isArray(marketProductsData.data)
    ) {
        return <Loader />;
    }

    // -------------------------
    // Actions / handlers
    // -------------------------
    const handleStartTask = async (taskId: number, userID: number) => {
        try {
            const logData = { ticket: { ticketID: taskId }, user: { userID: +userID } };
            await logsService.insertLog(logData);
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, selectedTicketID] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, +selectedTicketID] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, selectedTicketID + ""] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.WORK_LOGS_BY_TICKET_ID, selectedTicketID] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.WORK_LOGS_BY_TICKET_ID, selectedTicketID + ""] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.WORK_LOGS_BY_TICKET_ID, +selectedTicketID] });
            toastService.showToast(setToastConfig, 'Task started successfully!', 'success');
        } catch (err) {
            toastService.showToast(
                setToastConfig,
                `Error occurred while starting the task. ${(err as Error).message}. Please pause or end the task and try again.`,
                'destructive'
            );
        }
    };

    function goToProductsSheetView() {
        const task = selectedTicket.data;
        if (task.ticketType?.ticketTypeID !== 6 && task.ticketType?.ticketTypeID !== 49) {
            toastService.showToast(setToastConfig, "This task is not related to task type sheet.", "destructive");
            return;
        }
        const ticketID = task.ticketID?.toString() || '';
        const queryParams = new URLSearchParams({ ticketID }).toString();

        if (task.ticketType?.ticketTypeID === 6) {
            navigateService.handleNavigation(navigate, `${routeService.SHEET_PRODUCTS}?${queryParams}`);
        }
        if (task.ticketType?.ticketTypeID === 49) {
            navigateService.handleNavigation(navigate, `${routeService.CAMPAIGN_DETAILS}?${queryParams}`);
        }
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

    function goToHistoryPage() {
        const task = selectedTicket.data;
        const ticketID = task.ticketID?.toString() || '';
        const queryParams = new URLSearchParams({ ticketID }).toString();
        navigateService.handleNavigation(navigate, `${routeService.WORKLOGS_BY_TICKET_ID}?${queryParams}`);
    }

    // -------------------------
    // Derived values for UI
    // -------------------------
    const total = marketProductsData.data.length;
    const problemProducts = marketProductsData.data.filter((p: Product) => p.customStatus?.customStatusID === 19).length;
    const completedProducts = marketProductsData.data.filter((p: Product) => p.customStatus?.customStatusID === 16).length;
    const processedProducts = problemProducts + completedProducts;

    const labels = ['Stuck Products', 'Completed Products', 'Total Products'];
    const values = [problemProducts, completedProducts, total];

    // -------------------------
    // Render
    // -------------------------
    return (
        // The header and content share this scroll container
        <div className="min-h-screen flex flex-col">
            {/* Sticky Header */}
            <TaskStickyHeader
                task={selectedTicket.data}
                onStart={handleStartTask}
                onGoProducts={goToProductsSheetView}
                onGoProblems={goToProblemProductsPage}
                onGoHistory={goToHistoryPage}
                userRoleId={localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || ''}
                formatDuration={utilService.formatDuration}
                progress={{
                    current: processedProducts,
                    total,
                    showPercent: true,
                }}
                chart={{
                    title: 'Statistics Overview',
                    labels,
                    values,
                }}
            />

            {/* Page content */}
            {selectedTicket.data.ticketType?.ticketTypeID === 6 &&

                <main className="flex-1 px-3 sm:px-5 pb-8">
                    <div className="mx-auto w-full max-w-[1400px] mt-5">
                        <ProductsTable<Product>
                            products={marketProductsData.data || []}
                            columnVisibilityName="ProductsTable"
                            placeHolder="Filter products by name ..."
                            filterColumnName="prodName"
                            tableTitle="Products"
                            columnNames={columnNames}
                            ticketID={Number(selectedTicketID)}
                            excelConfig={excelConfig}
                            inputTableName="prodName"
                        />
                    </div>
                </main>
            }

            {selectedTicket.data.ticketType?.ticketTypeID === 49 &&


                <div className="col-span-1 lg:col-span-1">
                    <CampaignDetailsModern
                        content={selectedTicket.data.content}
                        designImageURL={selectedTicket.data.designImageURL}
                    />
                </div>
            }

            {toastConfig && (
                <ToastComponent
                    key={toastConfig.key}
                    variant={toastConfig.variant}
                    title={toastConfig.title}
                    description={toastConfig.description}
                />
            )}
        </div>
    );
};

export default transition(MarkerProducts);
