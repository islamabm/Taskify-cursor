import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

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
import { ProgressBar } from '../cmps/ProgressBar';
import ChartList from '../cmps/statisticsCharts/ChartList';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TasksCardPreview } from '../cmps/TasksCards/TasksCardPreview';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ScrollToTopCmp from '../cmps/helpers/ScrollToTopCmp';
import transition from '../transition';
ChartJS.register(ChartDataLabels);

// Register the necessary components for Bar chart
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend
);

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Statistics Overview' },
        datalabels: {
            color: '#555',
            display: true,
            font: {
                weight: 'bold'
            },
            formatter: (value, context) => {
                return value; // Displays the actual value
            }
        }
    },
};

/**
 * MarkerProductsFromSheetPage
 * Fetches products for a specific "ticket" (task), renders them,
 * and displays an option to "start" the task if needed.
 */
const MarkerProducts: React.FC = () => {
    /**
     * We rename `searchParams` to `urlSearchParams` to emphasize its purpose
     * as the hook for reading URL query parameters.
     */
    const [urlSearchParams] = useSearchParams();
    const [selectedChartType, setSelectedChartType] = useState<string>('Bar');


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
                errorText={`Error fetching ticket data. Please try again later. ${(ticketError as Error)?.message || ''
                    }`}
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

    // ---------------------------------------------------------------------------
    // STYLES
    // ---------------------------------------------------------------------------
    /**
     * containerStyles: Used to center the table horizontally,
     * taking most of the screen width.
     */
    const containerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '98vw',
        marginTop: '20px',
    };



    const processedProducts = marketProductsData.data.filter((product) => product.customStatus?.customStatusID === 19 || product.customStatus?.customStatusID === 16).length;
    const problemProducts = marketProductsData.data.filter((product) => product.customStatus?.customStatusID === 19).length;
    const comnpletedProducts = marketProductsData.data.filter((product) => product.customStatus?.customStatusID === 16).length;



    const chartData = {
        labels: ['Stuck Products', 'Completed Products', 'Total Products'],
        datasets: [
            {
                label: 'Product Count',
                data: [problemProducts, comnpletedProducts, marketProductsData.data.length],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)', // Color for problemProducts
                    'rgba(75, 192, 192, 0.2)', // Light green with transparency
                    'rgba(54, 162, 235, 0.2)' // Color for total products
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',  // Solid green
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    // Updating chartDataArray to include the new chartData
    const chartDataArray = [
        { data: chartData }
    ];


    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------
    return (
        <>
            <div className="grid grid-cols-2 w-full h-full">
                {/* Card Section */}
                <div className="p-4 w-[500px]">
                    <TasksCardPreview task={selectedTicket.data} onStart={handleStartTask} />
                </div>
                {/* Chart Section */}
                <div className="p-4 flex justify-center items-center ">
                    <ChartList
                        specialStyle={true}
                        chartType={selectedChartType}
                        chartDataArray={chartDataArray}
                        options={chartOptions}
                    />
                </div>
            </div>


            <ProgressBar current={processedProducts} total={marketProductsData.data?.length} isPercentages={true} />

            <div style={containerStyles}>

                <ProductsTable<Product>
                    products={marketProductsData.data || []}
                    columnVisibilityName="ProductsTable"
                    placeHolder="Filter products by name ..."
                    filterColumnName="prodName"
                    tableTitle="Products"
                    columnNames={columnNames}
                    // You might keep ticketID as a string, but if the table requires a number, 
                    // converting to a number is valid:
                    ticketID={Number(selectedTicketID)}
                    excelConfig={excelConfig}
                    inputTableName="prodName"
                />
                {/* <ScrollToTopCmp /> */}

                {/* Show a toast if configured */}
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


export default transition(MarkerProducts);
