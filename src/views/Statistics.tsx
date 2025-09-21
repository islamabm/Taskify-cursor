




import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import transition from '../transition';
import { statisticsService } from '../services/statistics.service';
import ChartList from '../cmps/statisticsCharts/ChartList';
import SpecialStatisticsList from '../cmps/statistics/SpecialStatisticsList';
import { DatePicker } from '../cmps/helpers/DatePicker';
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import ToastComponent from '../cmps/helpers/ToastComponent';
import { toastService } from '../services/toast.service';
import { Label } from '../components/ui/label';
import { ButtonComponent } from '../cmps/helpers/ButtonComponent';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { utilService } from '../services/util.service';
import { TaskCountBussItem, TaskCountEmployeeItem, TimeInMinutesBussItem } from '../types/commonTypes/commonTypes';
import LineComponent from '../cmps/LineComponent';
import KPICard from '../cmps/KPICard';

const dateSearchSchema = z.object({
    fromDate: z.string().min(1, { message: 'From date is required' }),
    toDate: z.string().min(1, { message: 'To date is required' }),
});

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'Statistics Overview' },
        datalabels: {
            align: 'end' as const,
            anchor: 'end' as const,
            color: '#555',
            font: { weight: 'bold' as const },
        },
    },
};

function Statistics() {
    // ---------------------------------------------------------------------
    // LOCAL STATE
    // ---------------------------------------------------------------------
    const [selectedChartType, setSelectedChartType] = useState<string>('Bar');
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSearchingStatistics, setIsSearchingStatistics] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(searchParams.get('fromDate') ?? '');
    const [endDate, setEndDate] = useState(searchParams.get('toDate') ?? '');
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    // New state to store fetched statistics data
    const [statisticsData, setStatisticsData] = useState<{
        averageTaskTimeInMinutes: Array<{ fullName: string; freeNumberData: number }>;
        taskCountBuss: Array<TaskCountBussItem>;
        ticketTypesCount: Array<any>;
        taskCountEmployee: Array<TaskCountEmployeeItem>;
        timeInMinutesBuss: Array<TimeInMinutesBussItem>;
        timeInMinutesEmployee: Array<{ fullName: string; freeNumberData: number }>;
        topBusinessTasksAdded: { marketName: string; freeTextData: string };
        topBusinessTimeWorked: { marketName: string; freeTextData: string };
        topEmployeeAvgTaskTime: { fullName: string; freeTextData: string };
        topEmployeeTotalTaskTime: { fullName: string; freeTextData: string };
    } | null>(null);
    const fetchStatistics = useMutation({
        mutationFn: () => {
            // Convert dd/MM/yyyy → YYYY-MM-dd HH:mm:ss
            const [fromDay, fromMonth, fromYear] = startDate.split('/');
            const [toDay, toMonth, toYear] = endDate.split('/');
            const formattedFromDate = `${fromYear}-${fromMonth}-${fromDay} 00:00:00`;
            const formattedToDate = `${toYear}-${toMonth}-${toDay} 23:59:59`;

            const searchStatisticsData = {
                fromDate: formattedFromDate,
                toDate: formattedToDate,
            };

            return statisticsService.getStatisticsData(searchStatisticsData);
        },
        onSuccess: (data) => {
            setStatisticsData(data);
        },
        onError: () => {
            toastService.showToast(
                setToastProps,
                'Error searching statistics. Please try again.',
                'destructive'
            );
        },
        onSettled: () => {
            setIsSearchingStatistics(false);
        },
    });

    useEffect(() => {
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');
        if (fromDate && toDate) {
            setStartDate(fromDate);
            setEndDate(toDate);
            setIsSearchingStatistics(true);

            fetchStatistics.mutate();
        }
    }, []);

    const handleSearchStatistics = () => {
        const validation = dateSearchSchema.safeParse({
            fromDate: startDate,
            toDate: endDate,
        });

        if (!validation.success) {
            toastService.showToast(
                setToastProps,
                'From date and To date are required',
                'destructive'
            );
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toastService.showToast(
                setToastProps,
                'From date cannot be later than To date',
                'destructive'
            );
            return;
        }

        // Update the URL
        setIsSearchingStatistics(true);
        setSearchParams({ fromDate: startDate, toDate: endDate });
        fetchStatistics.mutate();
    };

    const handleCancelSearch = () => {
        setIsCanceling(true);
        setStartDate('');
        setEndDate('');
        setSearchParams({});
        navigate('?');
        setIsCanceling(false);
        setStatisticsData(null);
    };

    // ---------------------------------------------------------------------
    // CHART DATA CREATION
    // ---------------------------------------------------------------------
    /**
     * Helper function to create a Chart.js-compatible dataset.
     * label is the dataset label, while data is an array of objects
     * containing { label, value } pairs.
     */


    const createChartDataset = (
        datasetLabel: string,
        data: Array<{ label: string; value: number }>
    ) => ({
        labels: data.map((item) => item.label),
        datasets: [
            {
                label: datasetLabel,
                data: data.map((item) => item.value),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    // ---------------------------------------------------------------------
    // SPECIAL STATISTICS DISPLAY
    // ---------------------------------------------------------------------
    /**
     * Data structure for highlighting top employees/businesses in various categories.
     */
    // Moved inside the component to access statisticsData
    const specialStatsArray = statisticsData ? utilService.createSpecialStatsArray(statisticsData) : [];

    /**
     * Consolidate different chart datasets into an array for easy rendering
     * by ChartList (e.g. { data: employeesTasksCountData, options: chartOptions }, etc.).
     */


    const chartDataArray = [];

    if (statisticsData) {
        const employeesTasksCountData = createChartDataset(
            'Tasks count (employee)',
            statisticsData.taskCountEmployee.map(
                (item: TaskCountEmployeeItem) => ({
                    label: item.fullName,
                    value: item.freeNumberData, // Ensure correct field name
                })
            )
        );
        const averageTaskTimeInMinutesData = createChartDataset(
            'Average task time in minutes',
            statisticsData.averageTaskTimeInMinutes.map((item: any) => ({
                label: item.fullName,
                value: item.freeNumberData, // Assuming freeTextData contains numeric strings
            }))
        );

        const businessesTasksCountData = createChartDataset(
            'Tasks count (business)',
            statisticsData.taskCountBuss.map((item: TaskCountBussItem) => ({
                label: item.marketName,
                value: item.freeNumberData, // Assuming freeTextData contains numeric strings
            }))
        );

        const businessesTimeData = createChartDataset(
            'Time in minutes (business)',
            statisticsData.timeInMinutesBuss.map((item: TimeInMinutesBussItem) => ({
                label: item.marketName,
                value: item.freeNumberData, // Assuming freeTextData contains numeric strings
            }))
        );

        const employeeTimeMinutesData = createChartDataset(
            'Time in minutes (employee)',
            statisticsData.timeInMinutesEmployee.map((item: any) => ({
                label: item.fullName,
                value: item.freeNumberData, // Assuming freeTextData contains numeric strings
            }))
        );
        const ticketTypesCount = createChartDataset(
            'Ticket types count',
            statisticsData.ticketTypesCount.map((item: any) => ({
                label: item.ticketType,
                value: item.freeNumberData, // Assuming freeTextData contains numeric strings
            }))
        );



        chartDataArray.push(
            { data: employeesTasksCountData },
            { data: employeeTimeMinutesData },
            { data: averageTaskTimeInMinutesData },
            { data: businessesTasksCountData },
            { data: businessesTimeData },
            { data: ticketTypesCount },
        );
    }

    if (fetchStatistics.isLoading) return <Loader />;

    if (fetchStatistics.isError) return <ErrorPage />;
    {/* Error State */ }

    // ---------------------------------------------------------------------
    // RENDERING
    // ---------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            <div className="flex justify-center items-center mb-4 gap-10">
                <div className="flex flex-col min-w-[200px]">
                    <Label className="text-gray-600 mb-1">From date</Label>
                    <DatePicker
                        onDateChange={setStartDate}
                        whichComponent="from"
                        selectedDate={startDate}
                    />
                </div>
                <div className="flex flex-col min-w-[200px]">
                    <Label className="text-gray-600 mb-1">To date</Label>
                    <DatePicker
                        onDateChange={setEndDate}
                        whichComponent="to"
                        selectedDate={endDate}
                    />
                </div>

                <ButtonComponent
                    buttonText="Search"
                    buttonTextWhenLoading="Searching..."
                    isLoading={isSearchingStatistics}
                    showButtonTextWhenLoading={true}
                    onClick={handleSearchStatistics}
                />
                <ButtonComponent
                    buttonText="Cancel search"
                    buttonTextWhenLoading="Cancelling..."
                    isLoading={isCanceling}
                    onClick={handleCancelSearch}
                // className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                />
            </div>
            <LineComponent />



            <SpecialStatisticsList
                data={specialStatsArray}
            />

            <ChartList
                chartType={selectedChartType}
                chartDataArray={chartDataArray}
                options={chartOptions}
            />



            {/* Toast for success/error messages */}
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}
        </section>
    );
}

export default transition(Statistics);
