import React from 'react';
import { useQuery } from '@tanstack/react-query';
import transition from '../transition';

// Components
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import { EmployeeStatusesTable } from '../cmps/tables/EmployeeStatusesTable';

// Services & Types
import { userStatusesService } from '../services/userStatuses.service';
import { UserStatus } from '../types/commonTypes/commonTypes';

// Table Config
import { columnNames, excelConfig } from '../cmps/tablesConfig/ManageEmployeeStatusesConfig';
import { queryKeysService } from '../services/queryKeys.service';

/**
 * ManageEmployeeStatuses:
 * Fetches and displays a table of employee user statuses (e.g., active, inactive).
 */
function ManageEmployeeStatuses() {
    /**
     * Destructure values from the React Query hook:
     * data: the entire response object (with .data)
     * isError, error: flags for error states
     * isLoading: indicates loading state
     *
     * Renaming `employeeStatuses` -> `employeeStatusesData` for clarity.
     */
    const {
        data: employeeStatusesData,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.USER_STATUSES],
        queryFn: userStatusesService.getUsersStatus,
    });

    // -------------------------------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------------------------------
    if (isError) {
        console.error('Error fetching employee statuses:', error);
        return (
            <ErrorPage
                errorText={`Error fetching employee statuses. Please try again later. ${(error as Error)?.message || ''
                    }`}
            />
        );
    }

    // -------------------------------------------------------------------------
    // LOADING & DATA VALIDATION
    // -------------------------------------------------------------------------
    if (
        isLoading ||
        !employeeStatusesData ||
        !Array.isArray(employeeStatusesData.data)
    ) {
        return <Loader />;
    }

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            {/*
        EmployeeStatusesTable: 
        Displays the statuses with filtering, export, etc.
      */}
            <EmployeeStatusesTable<UserStatus>
                employeeStatuses={employeeStatusesData.data}
                columnVisibilityName="EmployeeStatuses"
                placeHolder="Filter statuses ..."
                filterColumnName="userStatus"
                tableTitle="Statuses"
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="userStatus"
            />
        </section>
    );
}

export default transition(ManageEmployeeStatuses);
