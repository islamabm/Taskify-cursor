import React from 'react'


interface NoLogsFoundForTicketProps {
    readonly selectedTicketID: string | undefined
}
export default function NoLogsFoundForTicket({ selectedTicketID }: NoLogsFoundForTicketProps) {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto my-8 p-6 bg-white border border-gray-200 rounded-lg shadow">
            <svg
                className="w-16 h-16 mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75 14.25 14.25m0-4.5-4.5 4.5M21 12c0 4.9706-4.0294 9-9 9s-9-4.0294-9-9 4.0294-9 9-9 9 4.0294 9 9z" />
            </svg>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No logs found for ticket {selectedTicketID}.
            </h2>
            <p className="text-gray-600 text-center">
                There are currently no work logs associated with this ticket.
                Once work begins, you’ll see updates here.
            </p>
        </div>
    )
}
