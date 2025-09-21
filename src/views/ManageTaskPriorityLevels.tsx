import React from 'react';
import { useQuery } from '@tanstack/react-query';
import transition from '../transition';

// Components
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import { PriorityLevelsTable } from '../cmps/tables/PriorityLevelsTable';

// Services & Types
import { priorityService } from '../services/priority.service';
import { Priority } from '../types/commonTypes/commonTypes';
import { queryKeysService } from '../services/queryKeys.service';

// Config
import { columnNames, excelConfig } from '../cmps/tablesConfig/ManageTaskPriorityLevelsConfig';

/**
 * ManageTaskPriorityLevels:
 * Displays a table of priority levels, allowing the user to filter, export, etc.
 */
function ManageTaskPriorityLevels() {
    /**
     * useQuery to fetch priority levels from the server.
     * Renaming `priorityLevels` → `priorityLevelsData` clarifies
     * that it's the overall query result (often with .data).
     */
    const {
        data: priorityLevelsData,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.PRIORITY_LEVELS],
        queryFn: priorityService.getPriorityLevels,
    });

    // -------------------------------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------------------------------
    if (isError) {
        console.error('Error fetching priority levels:', error);
        return (
            <ErrorPage
                errorText={`Error fetching priority levels. Please try again later. ${(error as Error)?.message || ''
                    }`}
            />
        );
    }

    // -------------------------------------------------------------------------
    // LOADING & DATA VALIDATION
    // -------------------------------------------------------------------------
    if (
        isLoading ||
        !priorityLevelsData ||
        !Array.isArray(priorityLevelsData.data)
    ) {
        return <Loader />;
    }

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            {/*
        PriorityLevelsTable: Renders the priority levels with filtering, Excel export, etc.
      */}
            <PriorityLevelsTable<Priority>
                priorityLevels={priorityLevelsData.data}
                columnVisibilityName="priorityLevelsTable"
                placeHolder="Filter priority levels ..."
                filterColumnName="priorityLevel"
                tableTitle="Priority levels"
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="priorityLevel"
            />
        </section>
    );
}

export default transition(ManageTaskPriorityLevels);
