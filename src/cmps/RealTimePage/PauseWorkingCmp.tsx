import { EmployeeRealTimeData } from '../../types/commonTypes/commonTypes';
import React from 'react';

// Define the interface for employee data

interface NotWorkingCmpProps {
    readonly pausedWorkingArr: EmployeeRealTimeData[];
}

// export default function PauseWorkingCmp({ pausedWorkingArr }: NotWorkingCmpProps) {
//     return (
//         <>
//             <h2 className="font-bold text-2xl mb-4 text-center text-orange-500">Paused</h2>
//             <ul className="space-y-4">
//                 {pausedWorkingArr.map((employee) => (
//                     <li key={employee.employeeID} className="text-lg font-semibold text-center border p-3 rounded-lg bg-orange-500">
//                         {employee.employeeName} / {employee.boardName}
//                         {/* <span className="ml-2 text-sm bg-red-500 text-white py-1 px-3 rounded-full">Not Working</span> */}
//                     </li>
//                 ))}
//             </ul>
//         </>
//     );
// }


export default function PauseWorkingCmp({ pausedWorkingArr }: NotWorkingCmpProps) {
    return (
        <>
            <h2 className="font-bold text-2xl mb-4 text-center text-orange-600">Paused</h2>
            <ul className="space-y-4">
                {pausedWorkingArr.map((employee) => (
                    <li key={employee.employeeID} className="text-lg font-semibold text-center border p-3 rounded-lg bg-orange-100 text-orange-800 shadow-sm">
                        {employee.employeeName} / {employee.boardName}
                    </li>
                ))}
            </ul>
        </>
    );
}
