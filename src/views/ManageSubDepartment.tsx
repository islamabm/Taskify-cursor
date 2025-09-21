import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import transition from '../transition';
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import { SubDepartment } from '../types/commonTypes/commonTypes';
import { departmentsService } from '../services/departments.service';
import { SubDepartmentsTable } from '../cmps/tables/SubDepartmentsTable';
import { columnNames, excelConfig } from '../cmps/tablesConfig/ManageSubDepartmentConfig';
import { queryKeysService } from '../services/queryKeys.service';

/**
 * ManageSubDepartment:
 * Fetches and displays sub-departments for a selected department.
 * The department ID and name are read from the URL's query parameters.
 */
function ManageSubDepartment() {
    /**
     * urlSearchParams: Hook for reading the query params from the URL.
     */
    const [urlSearchParams] = useSearchParams();

    /**
     * Renaming:
     * - `departmentID` → `selectedDepartmentID`
     * - `departmentName` → `selectedDepartmentName`
     * This clarifies they're the currently chosen/selected values from the URL.
     */
    const selectedDepartmentID = urlSearchParams.get('departmentID');
    const selectedDepartmentName = urlSearchParams.get('departmentName');

    /**
     * canFetch: We only run the query if both ID and name are present in the URL.
     * If either is missing, we show an error page with a user-friendly message.
     */
    const canFetch = Boolean(selectedDepartmentID && selectedDepartmentName);

    /**
     * React Query to fetch sub-departments for the chosen department ID.
     * - `enabled: canFetch` ensures we don't run the query if the URL params are invalid.
     */
    const {
        data: subDepartmentsData,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.SUB_DEPARTMENTS, selectedDepartmentID],
        queryFn: () => departmentsService.getSubDepartments(Number(selectedDepartmentID)),
        enabled: canFetch,
    });

    // -------------------------------------------------------------------------
    // ERROR CHECKS
    // -------------------------------------------------------------------------
    /**
     * If the departmentID or departmentName is missing, display an error page immediately.
     */
    if (!canFetch) {
        return (
            <ErrorPage errorText="Invalid URL. Please check the URL and try again." />
        );
    }

    /**
     * If there was a server error or network issue, log it and show a friendly message.
     */
    if (isError) {
        console.error('Error fetching Sub-Departments:', error);
        return (
            <ErrorPage
                errorText={`Error fetching Sub-Departments. Please try again later. ${(error as Error)?.message || ''
                    }`}
            />
        );
    }

    /**
     * If data is still loading or if data is malformed (not an array),
     * show a loader until we have valid data.
     */
    if (
        isLoading ||
        !subDepartmentsData ||
        !Array.isArray(subDepartmentsData.data)
    ) {
        return <Loader />;
    }

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            {/*
        SubDepartmentsTable:
        Renders a table of sub-departments with filtering and optional Excel export.
      */}
            <SubDepartmentsTable<SubDepartment>
                subDepartments={subDepartmentsData.data}
                columnVisibilityName="subDepartmentsTable"
                placeHolder="Filter sub-departments ..."
                filterColumnName="departmentName"
                tableTitle={`Sub-departments in ${selectedDepartmentName}`}
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="departmentName"
            />
        </section>
    );
}

export default transition(ManageSubDepartment);
