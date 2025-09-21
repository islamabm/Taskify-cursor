import React from 'react';
import { useQuery } from '@tanstack/react-query';

import transition from '../transition';
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';

import { Department } from '../types/commonTypes/commonTypes';
import { departmentsService } from '../services/departments.service';
import { DepartmentsTable } from '../cmps/tables/DepartmentsTable';

// Table configuration
import { columnNames, excelConfig } from '../cmps/tablesConfig/ManageDepartmentsConfig';
import { queryKeysService } from '../services/queryKeys.service';

/**
 * ManageDepartments: Displays a table of top-level departments (parentID = 0).
 */
function ManageDepartments() {
    /**
     * Using React Query to fetch department data.
     * Renaming `departments` → `departmentsData` clarifies
     * that it's the full response object (often with a `.data` field).
     */
    const {
        data: departmentsData,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.DEPARTMENTS],
        queryFn: departmentsService.getDepartments,
    });

    // -------------------------------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------------------------------
    if (isError) {
        console.error('Error fetching departments:', error);
        return (
            <ErrorPage
                errorText={`Error fetching departments. Please try again later. ${(error as Error)?.message || ''
                    }`}
            />
        );
    }

    // -------------------------------------------------------------------------
    // LOADING & DATA VALIDATION
    // -------------------------------------------------------------------------
    if (
        isLoading ||
        !departmentsData ||
        !Array.isArray(departmentsData.data)
    ) {
        return <Loader />;
    }

    // -------------------------------------------------------------------------
    // DATA FILTERING
    // -------------------------------------------------------------------------
    /**
     * We filter departments so only top-level ones (parentID = 0) are displayed.
     * If you need nested departments, you could expand logic here or create a tree view.
     */
    const topLevelDepartments = departmentsData.data.filter(
        (department) => department.parentID === 0
    );

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            {/*
        DepartmentsTable: Renders the filtered top-level departments.
        Additional logic can be added to handle sub-departments if needed.
      */}
            <DepartmentsTable<Department>
                departments={topLevelDepartments}
                columnVisibilityName="DepartmentsTable"
                placeHolder="Filter departments ..."
                filterColumnName="departmentName"
                tableTitle="Departments"
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="departmentName"
            />
        </section>
    );
}

export default transition(ManageDepartments);
