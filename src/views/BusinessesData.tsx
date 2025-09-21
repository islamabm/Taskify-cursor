import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import transition from '../transition';
import { DatePicker } from '../cmps/helpers/DatePicker';
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import ToastComponent from '../cmps/helpers/ToastComponent';
import { toastService } from '../services/toast.service';
import { Label } from '../components/ui/label';
import { ButtonComponent } from '../cmps/helpers/ButtonComponent';
import LineComponent from '../cmps/LineComponent';
import { logsService } from '../services/logs.service';

// 1) Import XLSX and FileSaver:
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { voiceCenterService } from '../services/voice-center.service';

const dateSearchSchema = z.object({
    fromDate: z.string().min(1, { message: 'From date is required' }),
    toDate: z.string().min(1, { message: 'To date is required' }),
});

function BusinessesData() {
    // ---------------------------------------------------------------------
    // LOCAL STATE
    // ---------------------------------------------------------------------
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

    // State can hold the entire object returned by your API
    const [statisticsData, setStatisticsData] = useState<any>(null);

    // ---------------------------------------------------------------------
    // MUTATION
    // ---------------------------------------------------------------------
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

            return logsService.getBusinessesData(searchStatisticsData);
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

    // ---------------------------------------------------------------------
    // LIFECYCLE
    // ---------------------------------------------------------------------
    useEffect(() => {
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');

        if (fromDate && toDate) {
            setStartDate(fromDate);
            setEndDate(toDate);
            setIsSearchingStatistics(true);
            fetchStatistics.mutate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------------------------------------------------------------------
    // HANDLERS
    // ---------------------------------------------------------------------
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

    // 2) Download Excel button handler
    const handleDownloadExcel = () => {
        if (!statisticsData?.data || !Array.isArray(statisticsData.data)) {
            toastService.showToast(
                setToastProps,
                'No data to export',
                'destructive'
            );
            console.log("No data to export");
            return;
        }

        console.log("Preparing to download Excel. month blocks:", statisticsData.data);

        try {
            const workbook = XLSX.utils.book_new();

            statisticsData.data.forEach((monthBlock: any) => {
                if (!monthBlock.data || monthBlock.data.length === 0) {
                    // If there's no data, skip creating a sheet
                    return;
                }
                console.log("monthBlock:", monthBlock); // Is monthBlock.data empty?

                const sheetData = [
                    ["Market Name", "Minutes"],
                    ...monthBlock.data.map((item: any) => [item.marketName, item.freeNumberData]),
                ];

                console.log("sheetData:", sheetData);

                const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
                const rawSheetName = `From ${monthBlock.month.start} to ${monthBlock.month.end}`;
                const safeSheetName = rawSheetName.slice(0, 30);
                XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
            });

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const fileData = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(fileData, "businesses_data.xlsx");
        } catch (err) {
            console.error("Excel download error:", err);
        }
    };


    async function handleFetchBusinessesData() {
        try {
            const response = await voiceCenterService.getBusinessesData();
            console.log("businessesData response:", response);
        } catch (error) {
            console.error("Error fetching businessesData:", error);
        }
    }

    // ---------------------------------------------------------------------
    // CONDITIONAL RENDERS
    // ---------------------------------------------------------------------
    if (fetchStatistics.isLoading) return <Loader />;
    if (fetchStatistics.isError) return <ErrorPage />;

    console.log('statisticsData', statisticsData);

    // ---------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0">
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
                <button onClick={handleFetchBusinessesData}>Onclick</button>

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
                />

                {/* 3) Our new “Download Excel” button */}
                <ButtonComponent
                    buttonText="Download Excel"
                    onClick={handleDownloadExcel}
                />
            </div>

            <LineComponent />

            {/* Render each month's data in a table */}
            {statisticsData?.data &&
                Array.isArray(statisticsData.data) &&
                statisticsData.data.map((monthBlock: any, blockIdx: number) => (
                    <div key={blockIdx} className="my-8">
                        <h2 className="text-lg font-bold mb-2">
                            Data from {monthBlock?.month?.start} to {monthBlock?.month?.end}
                        </h2>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2">
                                        Business Name
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">Minutes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthBlock.data.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.marketName}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.freeNumberData}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}

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

export default transition(BusinessesData);
