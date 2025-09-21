import { EmployeeRealTimeData } from '../../types/commonTypes/commonTypes';
import React from 'react';



interface WorkingCmpProps {
    readonly workingArr: EmployeeRealTimeData[];
}



export default function WorkingCmp({ workingArr }: WorkingCmpProps) {
    return (
        <>
            <h2 className="font-bold text-2xl mb-4 text-center text-green-600">Working</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {workingArr.map((employee) => (
                    <div key={employee.userID} className="relative border p-4 rounded-lg shadow-md bg-green-100 text-green-900">
                        <p className="mb-2 font-semibold text-xl">{employee.fullName} / {employee.workLog?.marketName}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
