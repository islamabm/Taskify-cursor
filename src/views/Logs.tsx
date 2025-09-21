import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Label } from '../components/ui/label';
import SelectEmployeeName from '../cmps/Selects/SelectEmployeeName';
import SelectTaskType from '../cmps/Selects/SelectTaskType';
import SelectTaskStatus from '../cmps/Selects/SelectTaskStatus';
import SelectPriorityType from '../cmps/Selects/SelectPriorityType';

import ErrorPage from '../cmps/ErrorPage';
import { Loader } from '../cmps/helpers/Loader';
import ToastComponent from '../cmps/helpers/ToastComponent';
import { DatePicker } from '../cmps/helpers/DatePicker';
import AutoCompleteBusinesses from '../cmps/AutoCompleteBusinesses';
import { ButtonComponent } from '../cmps/helpers/ButtonComponent';

import { employeesService } from '../services/employees.service';
import { priorityService } from '../services/priority.service';
import { logsService } from '../services/logs.service';
import { taskTypesService } from '../services/taskTypes.service';
import { taskStatusesService } from '../services/taskStatuses.service';
import { toastService } from '../services/toast.service';

import { LogsTable } from '../cmps/tables/LogsTable';
import { columnNames, excelConfig } from '../cmps/tablesConfig/ManageDepartmentsConfig';

import {
    Log,
    LogsOptions,
    Priority,
    TaskStatus,
    TaskType,
    User,
} from '../types/commonTypes/commonTypes';
import { queryKeysService } from '../services/queryKeys.service';
import ScrollToTopCmp from '../cmps/helpers/ScrollToTopCmp';
import transition from '../transition';

// Zod schema for date validation
const searchSchema = z.object({
    fromDate: z.string().min(1, { message: 'From date is required' }),
    toDate: z.string().min(1, { message: 'To date is required' }),
});

function Logs() {
    // -------------------------------------------------------------------------
    // REACT ROUTER HOOKS
    // -------------------------------------------------------------------------
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // -------------------------------------------------------------------------
    // COMPONENT STATE
    // -------------------------------------------------------------------------
    const [toastConfig, setToastConfig] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    /**
     * - isSearching: for the "Search" button's loading state
     * - isCanceling: for the "Cancel Search" button's loading state
     */
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isCanceling, setIsCanceling] = useState<boolean>(false);

    /**
     * fromDate, toDate come from the URL if available, otherwise empty.
     * partnerID is the business ID from autocomplete.
     */
    const [fromDate, setFromDate] = useState(searchParams.get('fromDate') ?? '');
    const [toDate, setToDate] = useState(searchParams.get('toDate') ?? '');
    const [partnerID, setPartnerID] = useState<string>('');
    const [partnerName, setPartnerName] = useState<string>('');

    /**
     * formState: Holds IDs for employee, task status, priority, type.
     */
    const [formState, setFormState] = useState<LogsOptions>({
        employeeID: '',
        statusID: '',
        priorityID: '',
        typeID: '',
    });

    /**
     * fetchedLogs: The logs displayed in LogsTable.
     * On initial load, set to all logs from the server.
     * On search, update with filtered logs.
     */
    const [fetchedLogs, setFetchedLogs] = useState<Log[]>([]);

    /**
     * hasAutoSearched: Prevent repeated auto-search from the useEffect
     * if the URL changes again. We'll only auto-search once per mount if
     * fromDateParam and toDateParam exist.
     */

    // -------------------------------------------------------------------------
    // QUERIES: FETCH REQUIRED DATA
    // -------------------------------------------------------------------------
    const {
        data: logsData,
        isError: isLogsError,
        error: logsError,
        isLoading: isLoadingLogs,
    } = useQuery({
        queryKey: [queryKeysService.LOGS],
        queryFn: logsService.getLogs,
        onSuccess: (data) => {
            setFetchedLogs(data.data);
        },
    });

    const {
        data: priorityData,
        isError: isPriorityError,
        error: priorityError,
        isLoading: isLoadingPriority,
    } = useQuery({
        queryKey: [queryKeysService.PRIORITY_LEVELS],
        queryFn: priorityService.getPriorityLevels,
    });

    const {
        data: taskStatusesData,
        isError: isTaskStatusesError,
        error: taskStatusesError,
        isLoading: isLoadingTaskStatuses,
    } = useQuery({
        queryKey: [queryKeysService.TASK_STATUSES],
        queryFn: taskStatusesService.getTaskStatuses,
    });

    const {
        data: taskTypesData,
        isError: isTaskTypesError,
        error: taskTypesError,
        isLoading: isLoadingTaskTypes,
    } = useQuery({
        queryKey: [queryKeysService.TASK_TYPES],
        queryFn: taskTypesService.getTasksTypes,
    });

    const {
        data: employeesData,
        isError: isEmployeesError,
        error: employeesError,
        isLoading: isLoadingEmployees,
    } = useQuery({
        queryKey: [queryKeysService.USERS],
        queryFn: employeesService.getEmployees,
    });

    // -------------------------------------------------------------------------
    // MUTATION: SEARCH LOGS
    // -------------------------------------------------------------------------
    const searchLogsMutation = useMutation({
        mutationFn: () => {
            // Convert dd/MM/yyyy → YYYY-MM-dd HH:mm:ss
            const [fromDay, fromMonth, fromYear] = fromDate.split('/');
            const [toDay, toMonth, toYear] = toDate.split('/');
            const formattedFromDate = `${fromYear}-${fromMonth}-${fromDay} 00:00:00`;
            const formattedToDate = `${toYear}-${toMonth}-${toDay} 23:59:59`;
            console.log("formattedFromDate", formattedFromDate)
            console.log("formattedToDate", formattedToDate)
            const searchLogData = {
                fromDate: formattedFromDate,
                toDate: formattedToDate,
                userID: formState.employeeID,
                customStatusID: formState.statusID,
                priorityLevelID: formState.priorityID,
                ticketTypeID: formState.typeID,
                marketID: +partnerID, // convert string to number
            };
            return logsService.searchLogs(searchLogData);
        },
        onSuccess: (data) => {
            setFetchedLogs(data.data);
        },
        onError: () => {

            toastService.showToast(
                setToastConfig,
                'Error searching logs. Please try again.',
                'destructive'
            );
        },
        onSettled: () => {
            setIsSearching(false);
        },
    });

    // -------------------------------------------------------------------------
    // useEffect: RUN AUTO-SEARCH ONLY ONCE (if valid URL params)
    // -------------------------------------------------------------------------
    useEffect(() => {
        // If the user had previously set from/to dates in the URL, read them
        const fromDateParam = searchParams.get('fromDate');
        const toDateParam = searchParams.get('toDate');
        const employeeIDParam = searchParams.get('employeeID');
        const statusIDParam = searchParams.get('statusID');
        const priorityIDParam = searchParams.get('priorityID');
        const typeIDParam = searchParams.get('typeID');
        const businessIDParam = searchParams.get('partnerID');
        const businessNameParam = searchParams.get('partnerName');


        // Convert from "YYYY-MM-DD 00:00:00" to dd/MM/yyyy if needed
        // Here we do a naive parse that might break if the date is in a different format

        if (fromDateParam) {
            const [fromDateOnly] = fromDateParam.split(' '); // "2024-12-01"
            // const [yyyy, mm, dd] = fromDateOnly.split('/');
            setFromDate(`${fromDateOnly}`); // "01/12/2024"
        }

        if (toDateParam) {
            const [toDateOnly] = toDateParam.split(' '); // "2024-12-26"

            // const [yyyy, mm, dd] = toDateOnly.split('/');
            setToDate(`${toDateOnly}`); // "26/12/2024"
        }

        if (employeeIDParam) {
            setFormState((prev) => {
                const newState = { ...prev, employeeID: +employeeIDParam };
                return newState;
            });
        } else {
            setFormState((prev) => ({ ...prev, employeeID: "" }));
        }
        if (statusIDParam) {
            setFormState((prev) => ({ ...prev, statusID: +statusIDParam }));
        } else {
            setFormState((prev) => ({ ...prev, statusID: "" }));

        }
        if (priorityIDParam) {
            setFormState((prev) => ({ ...prev, priorityID: +priorityIDParam }));
        } else {
            setFormState((prev) => ({ ...prev, priorityID: "" }));

        }
        if (typeIDParam) {
            setFormState((prev) => ({ ...prev, typeID: +typeIDParam }));
        } else {
            setFormState((prev) => ({ ...prev, typeID: "" }));

        }
        if (businessIDParam) {
            setPartnerID(businessIDParam);
        } else {
            setPartnerID('');
        }
        if (businessNameParam) {
            setPartnerName(businessNameParam);
        } else {
            setPartnerName('');
        }

        // If we have required fields, auto-search once (if not done yet)
        if (fromDateParam && toDateParam) {
            setIsSearching(true);
            setTimeout(() => {
                searchLogsMutation.mutate();
            }, 100); // Delay of 2000 milliseconds (2 seconds)




        }



    }, [

    ]);



    // -------------------------------------------------------------------------
    // LOADING / ERROR STATES
    // -------------------------------------------------------------------------
    if (
        isLoadingPriority ||
        isLoadingTaskStatuses ||
        isLoadingTaskTypes ||
        isLoadingEmployees ||
        !employeesData ||
        !priorityData ||
        !taskStatusesData ||
        !taskTypesData ||
        !Array.isArray(employeesData.data) ||
        !Array.isArray(priorityData.data) ||
        !Array.isArray(taskStatusesData.data) ||
        !Array.isArray(taskTypesData.data)
    ) {
        return <Loader />;
    }

    if (isPriorityError) {
        console.error('Error fetching priority types:', priorityError);
        return (
            <ErrorPage
                errorText={`Error fetching priority types data. Please try again later. ${(priorityError as Error)?.message || ''
                    }`}
            />
        );
    }
    if (isTaskStatusesError) {
        console.error('Error fetching task statuses:', taskStatusesError);
        return (
            <ErrorPage
                errorText={`Error fetching task statuses data. Please try again later. ${(taskStatusesError as Error)?.message || ''
                    }`}
            />
        );
    }
    if (isTaskTypesError) {
        console.error('Error fetching task types:', taskTypesError);
        return (
            <ErrorPage
                errorText={`Error fetching task types data. Please try again later. ${(taskTypesError as Error)?.message || ''
                    }`}
            />
        );
    }
    if (isEmployeesError) {
        console.error('Error fetching employees:', employeesError);
        return (
            <ErrorPage
                errorText={`Error fetching employees data. Please try again later. ${(employeesError as Error)?.message || ''
                    }`}
            />
        );
    }
    if (isLogsError) {
        console.error('Error fetching logs:', logsError);
        return (
            <ErrorPage
                errorText={`Error fetching logs. Please try again later. ${(logsError as Error)?.message || ''
                    }`}
            />
        );
    }
    if (isLoadingLogs || !logsData || !Array.isArray(logsData.data)) {
        return <Loader />;
    }

    // -------------------------------------------------------------------------
    // BUILD OPTIONS FOR SELECTS
    // -------------------------------------------------------------------------
    const priorityTypesToRender = priorityData.data.map((priorityType: Priority) => ({
        itemValue: priorityType.priorityLevelID,
        itemText: priorityType.priorityLevel,
    }));

    const taskStatusesToRender = taskStatusesData.data
        .filter((status: TaskStatus) => status.type === 'ticket')
        .map((status: TaskStatus) => ({
            itemValue: status.customStatusID,
            itemText: status.customStatus,
        }));

    const taskTypesToRender = taskTypesData.data.map((t: TaskType) => ({
        itemValue: t.ticketTypeID,
        itemText: t.ticketType,
    }));

    const employeesToRender = employeesData.data.map((e: User) => ({
        itemValue: e.userID,
        itemText: e.fullName,
    }));

    // -------------------------------------------------------------------------
    // EVENT HANDLERS
    // -------------------------------------------------------------------------
    function handleFromDateChange(newDate: string) {
        setFromDate(newDate);
    }

    function handleToDateChange(newDate: string) {
        setToDate(newDate);
    }

    function handleSelectPartner(id: string, name: string) {
        setPartnerID(id);
        setPartnerName(name);
    }

    /**
     * handleSearchReports:
     * 1. Validate date fields (non-empty, fromDate <= toDate).
     * 2. Update URL with query params (for refresh persistence).
     * 3. Trigger the search mutation to filter logs.
     */
    function handleSearchReports() {
        const validation = searchSchema.safeParse({ fromDate, toDate });

        if (!validation.success) {
            toastService.showToast(
                setToastConfig,
                'From date and To date are required',
                'destructive'
            );
            console.error('Validation error:', validation.error.errors);
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
            toastService.showToast(
                setToastConfig,
                'From date cannot be later than To date',
                'destructive'
            );
            console.error('Validation error: From date is later than To date');
            return;
        }

        // Convert from dd/MM/YYYY → "YYYY-MM-DD HH:mm:ss"
        // const [fromDay, fromMonth, fromYear] = fromDate.split('/');
        // const [toDay, toMonth, toYear] = toDate.split('/');

        // const formattedFromDate = `${fromYear}-${fromMonth}-${fromDay} 00:00:00`;
        // const formattedToDate = `${toYear}-${toMonth}-${toDay} 23:59:59`;

        // Update the URL so user can refresh or share the link
        const params = new URLSearchParams();

        if (fromDate) {
            params.append('fromDate', fromDate);
        }

        if (toDate) {
            params.append('toDate', toDate);
        }

        if (formState.employeeID) {
            params.append('employeeID', formState.employeeID);
        }

        if (formState.statusID) {
            params.append('statusID', formState.statusID);
        }

        if (formState.priorityID) {
            params.append('priorityID', formState.priorityID);
        }

        if (formState.typeID) {
            params.append('typeID', formState.typeID);
        }

        if (partnerID) {
            params.append('partnerID', partnerID);
        }
        if (partnerName) {
            params.append('partnerName', partnerName);
        }

        navigate(`?${params.toString()}`);
        setIsSearching(true);

        searchLogsMutation.mutate();
    }

    /**
     * handleCancelSearch: Reset all fields, revert logs, and clear URL.
     */
    function handleCancelSearch() {
        setIsCanceling(true);

        // Reset states
        setFormState({ employeeID: '', statusID: '', priorityID: '', typeID: '' });
        setPartnerID('');
        setPartnerName('');
        setFromDate('');
        setToDate('');

        // Clear the URL
        navigate('?');

        // Restore initial logs
        if (logsData && Array.isArray(logsData.data)) {
            setFetchedLogs(logsData.data);
        }
        window.location.reload();

        setIsCanceling(false);
    }


    // console.log("fetchedLogs", fetchedLogs)

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <div className="min-h-screen p-6">
            <div className="flex justify-center mb-4 gap-5">
                <ButtonComponent
                    buttonText="Search"
                    buttonTextWhenLoading="Searching..."
                    isLoading={isSearching}
                    showButtonTextWhenLoading
                    onClick={handleSearchReports}
                // className="bg-blue-600 text-white hover:bg-blue-700"
                />
                <ButtonComponent
                    buttonText="Cancel"
                    buttonTextWhenLoading="Cancelling..."
                    isLoading={isCanceling}
                    showButtonTextWhenLoading
                    onClick={handleCancelSearch}
                // className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                />

            </div>
            {/* <div className=" bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8 flex items-center justify-center gap-3"> */}


            {/* Filters Section */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            {/* Date Range */}
            {/* <div className="flex flex-col space-y-4"> */}
            <div className='flex justify-around  space-x-4'>
                <div className='flex flex-col  space-y-4'>
                    <div className="flex flex-col space-y-4">
                        <Label htmlFor="from-date" className="mb-1">
                            From Date
                        </Label>
                        <DatePicker
                            // id="from-date"
                            onDateChange={handleFromDateChange}
                            whichComponent="from"
                            selectedDate={fromDate}
                        />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <Label htmlFor="to-date" className="mb-1">
                            To Date
                        </Label>
                        <DatePicker
                            // id="to-date"
                            onDateChange={handleToDateChange}
                            whichComponent="to"
                            selectedDate={toDate}
                        />
                    </div>
                </div>
                {/* </div> */}

                {/* Business Autocomplete */}

                <div className='flex flex-col space-y-4'>

                    <div>
                        <Label htmlFor="employee-name" className="mb-1">
                            Employee Name
                        </Label>
                        <SelectEmployeeName
                            // id="employee-name"
                            dataToRender={employeesToRender}
                            handleEmployeeSelect={(employeeID) =>
                                setFormState((prev) => ({ ...prev, employeeID }))
                            }
                            selectedValue={formState.employeeID}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <Label htmlFor="status" className="mb-1">
                            Status
                        </Label>
                        <SelectTaskStatus
                            // id="status"
                            dataToRender={taskStatusesToRender}
                            handleStatusSelect={(taskStatusID) =>
                                setFormState((prev) => ({ ...prev, statusID: taskStatusID }))
                            }
                            selectedValue={formState.statusID}
                        />
                    </div>
                </div>
                <div className='flex flex-col space-y-4'>

                    {/* </div> */}

                    {/* Priority and Type */}
                    {/* <div className="flex flex-col space-y-4"> */}
                    {/* Priority */}
                    <div>
                        <Label htmlFor="priority" className="mb-1">
                            Priority
                        </Label>
                        <SelectPriorityType
                            // id="priority"
                            dataToRender={priorityTypesToRender}
                            handlePriorityTypeSelect={(priorityID) =>
                                setFormState((prev) => ({ ...prev, priorityID }))
                            }
                            selectedValue={formState.priorityID}
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <Label htmlFor="type" className="mb-1">
                            Type
                        </Label>
                        <SelectTaskType
                            id="type"
                            dataToRender={taskTypesToRender}
                            handleTaskTypeSelect={(taskTypeID) =>
                                setFormState((prev) => ({ ...prev, typeID: taskTypeID }))
                            }
                            selectedValue={formState.typeID}
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <Label htmlFor="business" className="mb-1">
                        Business
                    </Label>
                    <AutoCompleteBusinesses
                        // id="business"
                        onSelectPartner={handleSelectPartner}
                        initialHaatBussID={+partnerID}
                        initialMarketName={partnerName}
                    />
                </div>

            </div>


            {/* Logs Table */}
            <LogsTable<Log>
                logs={fetchedLogs}
                columnVisibilityName="LogsTable"
                placeHolder="Filter logs by name ..."
                filterColumnName="workLogID"
                tableTitle="Logs"
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="workLogID"
            />
            {/* <ScrollToTopCmp /> */}

            {/* Toast Notification */}
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
}


export default transition(Logs);