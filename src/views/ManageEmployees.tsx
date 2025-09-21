import React from 'react';
import { useQuery } from '@tanstack/react-query';
import transition from '../transition';

// Components
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';
import { EmployeesTable } from '../cmps/tables/EmployeesTable';

// Services & Types
import { employeesService } from '../services/employees.service';
import { User } from '../types/commonTypes/commonTypes';

// Table Config
import {
    columnNames,
    excelConfig as baseExcelConfig,
} from '../cmps/tablesConfig/ManageEmployeesConfig';
import { queryKeysService } from '../services/queryKeys.service';

/**
 * ManageEmployees:
 * Fetches a list of employees, transforms the data for exporting,
 * and renders it in a table with filtering and Excel export functionality.
 */
function ManageEmployees() {
    /**
     * React Query to fetch employees. 
     * Renamed `employees` to `employeesData` for clarity, indicating
     * it’s the entire result object (often with a .data field).
     */
    const {
        data: employeesData,
        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: [queryKeysService.USERS],
        queryFn: employeesService.getEmployees,
    });

    // -------------------------------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------------------------------
    if (isError) {
        console.error('Error fetching employees:', error);
        return (
            <ErrorPage
                errorText={`Error fetching employees. Please try again later. ${(error as Error)?.message || ''
                    }`}
            />
        );
    }

    // -------------------------------------------------------------------------
    // LOADING & DATA VALIDATION
    // -------------------------------------------------------------------------
    if (
        isLoading ||
        !employeesData ||
        !Array.isArray(employeesData.data)
    ) {
        return <Loader />;
    }

    // -------------------------------------------------------------------------
    // DATA TRANSFORMATION
    // -------------------------------------------------------------------------
    /**
     * We create a new array, transforming certain fields (like userType, userStatus)
     * to strings for easier export in Excel.
     */
    const transformedEmployees = employeesData.data.map((employee) => ({
        ...employee,
        userType: employee.userType?.userType || 'N/A',
        userStatus: employee.userStatus?.userStatus || 'N/A',
        userTypeID: employee.userType?.userTypeID || 'N/A',
        userStatusID: employee.userStatus?.userStatusID || 'N/A',
    }));

    /**
     * We clone the base Excel config and assign our transformed data to `data`,
     * ensuring that if you export to Excel, the user sees the cleaned fields
     * (strings) rather than objects or empty values.
     */
    const excelConfig = {
        ...baseExcelConfig,
        data: transformedEmployees,
    };

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <section className="sm:p-20 p-0 cursor-pointer">
            {/*
        EmployeesTable: Renders the employees in a table.
        - transformEmployees ensures we have consistent string fields.
        - excelConfig merges the transformed data with the existing base config.
      */}
            <EmployeesTable<User>
                employees={transformedEmployees}
                columnVisibilityName="UsersTable"
                placeHolder="Filter users ..."
                filterColumnName="fullName"
                tableTitle="Users"
                columnNames={columnNames}
                excelConfig={excelConfig}
                inputTableName="fullName"
            />
        </section>
    );
}

export default transition(ManageEmployees);
