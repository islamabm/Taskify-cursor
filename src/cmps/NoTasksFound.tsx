// src/cmps/NoTasksFound.tsx
import React from 'react';
import { LuBox } from 'react-icons/lu'; // Example icon from react-icons (Feather box icon)

interface NoTasksFoundProps {
    readonly partnerName?: string;
}
export function NoTasksFound({ partnerName }: NoTasksFoundProps) {
    return (
        <div className="flex flex-col items-center justify-center mx-auto p-6 max-w-sm bg-white dark:bg-gray-800 rounded-md shadow-md mt-10">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-gray-700 rounded-full mb-4">
                <LuBox className="text-3xl text-blue-500 dark:text-blue-300" />
            </div>

            {/* Heading */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No Tasks Found
            </h2>

            {/* Sub-Heading or Description */}
            <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {partnerName
                    ? `We couldn't find any tasks for partner "${partnerName}".`
                    : 'There are no tasks available at this time.'}
            </p>

            {/* Extra CTA or Instruction (Optional) */}
            {/* <div className="mt-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600"
                    onClick={() => {
                        // Add logic here, e.g., redirect user to create a task
                    }}
                >
                    Create a New Task
                </button>
            </div> */}
        </div>
    );
}
