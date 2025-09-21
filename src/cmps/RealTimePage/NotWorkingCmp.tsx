import { EmployeeRealTimeData } from '../../types/commonTypes/commonTypes';
import React from 'react';

// Define the interface for employee data

interface NotWorkingCmpProps {
    readonly notWorkingArr: EmployeeRealTimeData[];
}




export default function NotWorkingCmp({ notWorkingArr }: NotWorkingCmpProps) {
    return (
        <>
            <h2 className="font-bold text-2xl mb-4 text-center text-red-600">Not Working</h2>
            <ul className="space-y-4">
                {notWorkingArr.map((employee) => (
                    <li key={employee.userID} className="text-lg font-semibold text-center border p-3 rounded-lg bg-red-100 text-red-800 shadow-sm">
                        {employee.fullName}
                    </li>
                ))}
            </ul>
        </>
    );
}
