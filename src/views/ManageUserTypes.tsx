import React from 'react';
import { useQuery } from '@tanstack/react-query';
import transition from '../transition';

// Components
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import { UserTypesTable } from '../cmps/tables/UserTypesTable';

// Types & Config
import { TaskType } from '../types/commonTypes/commonTypes';
import { columnNames, excelConfig } from '../cmps/tablesConfig/ManageUserTypesConfig';

// Services
import { userTypesService } from '../services/userTypes.service';
import { queryKeysService } from '../services/queryKeys.service';

/**
 * ManageUserTypes: Fetches and displays user types in a table.
 * Allows for filtering, exporting, and more.
 */
function ManageUserTypes() {
    /**
     * Destructure query properties:
     * - data: The fetched user types data
     * - isError, error: Indicators for error state
     * - isLoading: Indicator for loading state
     */
    const {
        data: userTypesData,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.USER_TYPES],
        queryFn: userTypesService.getUserTypes, // Simpler arrow function not necessary if it's just a direct call
    });

    // ------------------------------------------------------------------------
    // ERROR HANDLING
    // ------------------------------------------------------------------------
    if (isError) {
        console.error('Error fetching userTypes:', error);
        return (
            <ErrorPage
                errorText={`Error fetching user types. Please try again later. ${(error as Error)?.message || ''
                    }`}
            />
        );
    }

    // ------------------------------------------------------------------------
    // LOADING & DATA VALIDATION
    // ------------------------------------------------------------------------
    if (isLoading || !userTypesData || !Array.isArray(userTypesData.data)) {
        return <Loader />;
    }

    // ------------------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            {/* 
        Renders a table of user types. 
        The table includes column config, search placeholder, 
        and optional export to Excel.
      */}
            <UserTypesTable<TaskType>
                userTypes={userTypesData.data}
                columnVisibilityName="UserTypeTable"
                placeHolder="Filter user types ..."
                filterColumnName="userType"
                tableTitle="User types"
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="userType"
            />
        </section>
    );
}

export default transition(ManageUserTypes);
