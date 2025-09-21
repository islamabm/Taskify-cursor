import React from 'react';
import { useQuery } from '@tanstack/react-query';

import transition from '../transition';
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';

import { Business } from '../types/commonTypes/commonTypes';
import { businessService } from '../services/businesses.service';
import { BusinessTable } from '../cmps/tables/BusinessTable';

// Table Configuration
import { columnNames, excelConfig } from '../cmps/tablesConfig/ManageBusinessesConfig';
import { queryKeysService } from '../services/queryKeys.service';

/**
 * ManageBusinesses:
 * Fetches the list of businesses and renders them in a table with filtering and Excel export.
 */
function ManageBusinesses() {
    /**
     * React Query hook to fetch businesses data.
     * Renaming `businesses` → `businessesData` clarifies it’s
     * the full response object from the query (often with .data).
     */
    const {
        data: businessesData,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.BUSINESSES],
        queryFn: businessService.getBusinesses,
    });

    // -------------------------------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------------------------------
    if (isError) {
        console.error('Error fetching businesses:', error);
        return (
            <ErrorPage
                errorText={`Error fetching businesses. Please try again later. ${(error as Error)?.message || ''
                    }`}
            />
        );
    }

    // -------------------------------------------------------------------------
    // LOADING & DATA VALIDATION
    // -------------------------------------------------------------------------
    if (
        isLoading ||
        !businessesData ||
        !Array.isArray(businessesData.data)
    ) {
        return <Loader />;
    }

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            {/*
        BusinessTable: Displays the list of businesses with a filter, export, etc.
      */}
            <BusinessTable<Business>
                businesses={businessesData.data}
                columnVisibilityName="BusinessesTable"
                placeHolder="Filter businesses ..."
                filterColumnName="marketName"
                tableTitle="Businesses"
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="marketName"
            />
        </section>
    );
}

export default transition(ManageBusinesses);
