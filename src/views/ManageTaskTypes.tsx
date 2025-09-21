import React from 'react';
import { useQuery } from '@tanstack/react-query';
import transition from '../transition';

// Components
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import { TaskTypesTable } from '../cmps/tables/TaskTypesTable';

// Types & Config
import { TaskType } from '../types/commonTypes/commonTypes';
import { columnNames, excelConfig } from '../cmps/tablesConfig/ManageTaskTypesConfig';

// Services
import { taskTypesService } from '../services/taskTypes.service';
import { queryKeysService } from '../services/queryKeys.service';

/**
 * ManageTaskTypes: Fetches and displays a table of "Task Types"
 * that can be filtered, exported, etc.
 */
function ManageTaskTypes() {
    /**
     * The useQuery call to fetch task types from the server.
     * We rename `taskTypes` to `taskTypesData` to highlight
     * that it's the overall response (often includes .data).
     */
    const {
        data: taskTypesData,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.TASK_TYPES],
        queryFn: taskTypesService.getTasksTypes,
        // Simpler direct reference if there are no extra parameters needed
    });

    // ------------------------------------------------------------------------
    // ERROR HANDLING
    // ------------------------------------------------------------------------
    if (isError) {
        console.error('Error fetching taskTypes:', error);
        return (
            <ErrorPage
                errorText={`Error fetching task types. Please try again later. ${(error as Error)?.message || ''
                    }`}
            />
        );
    }

    // ------------------------------------------------------------------------
    // LOADING & DATA VALIDATION
    // ------------------------------------------------------------------------
    if (isLoading || !taskTypesData || !Array.isArray(taskTypesData.data)) {
        return <Loader />;
    }

    // ------------------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------------------


    console.log("taskTypesData", taskTypesData)

    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            {/*
        TaskTypesTable displays the list of task types with optional
        filtering, column visibility, and Excel export.
      */}
            <TaskTypesTable<TaskType>
                taskTypes={taskTypesData.data}
                columnVisibilityName="TaskTypeTable"
                placeHolder="Filter task types ..."
                filterColumnName="ticketType"
                tableTitle="Task types"
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="ticketType"
            />
        </section>
    );
}

export default transition(ManageTaskTypes);
