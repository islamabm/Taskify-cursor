import React from 'react';
import { useQuery } from '@tanstack/react-query';
import transition from '../transition';

// Components
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import { TaskStatusesTable } from '../cmps/tables/TaskStatusesTable';

// Services & Types
import { taskStatusesService } from '../services/taskStatuses.service';
import { TaskStatus } from '../types/commonTypes/commonTypes';

// Config
import { columnNames, excelConfig } from '../cmps/tablesConfig/TaskStatusesTableConfig';
import { queryKeysService } from '../services/queryKeys.service';

/**
 * ManageTaskStatuses:
 * Fetches and displays a list of task statuses in a table format
 * with filtering, column visibility, and Excel export.
 */
function ManageTaskStatuses() {
    /**
     * Use React Query to fetch task statuses from the backend.
     * Destructure the key states: data, isError, error, isLoading.
     * 
     * Renamed `taskStatuses` → `taskStatusesData` to clarify
     * that it's the overall response object (which includes .data).
     */
    const {
        data: taskStatusesData,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.TASK_STATUSES],
        queryFn: taskStatusesService.getTaskStatuses,
        // If your service function doesn't need arguments, direct reference is fine.
    });

    // -------------------------------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------------------------------
    if (isError) {
        console.error('Error fetching task statuses:', error);
        return (
            <ErrorPage
                errorText={`Error fetching task statuses. Please try again later. ${(error as Error)?.message || ''
                    }`}
            />
        );
    }

    // -------------------------------------------------------------------------
    // LOADING & DATA VALIDATION
    // -------------------------------------------------------------------------
    if (
        isLoading ||
        !taskStatusesData ||
        !Array.isArray(taskStatusesData.data)
    ) {
        return <Loader />;
    }

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            {/*
        TaskStatusesTable: Renders the statuses in a table with custom filtering and export to Excel.
      */}
            <TaskStatusesTable<TaskStatus>
                taskStatuses={taskStatusesData.data || []}
                columnVisibilityName="TaskStatuses"
                placeHolder="Filter statuses ..."
                filterColumnName="customStatus"
                tableTitle="Statuses"
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="customStatus"
            />
        </section>
    );
}

export default transition(ManageTaskStatuses);
