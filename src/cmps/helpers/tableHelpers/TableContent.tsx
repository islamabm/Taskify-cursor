import React from 'react'
import {
    Table as UITable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table"
import {
    flexRender,
    HeaderGroup,
    Row,
    Table as ReactTable,
} from "@tanstack/react-table"

interface TableContentProps<T> {
    readonly table: ReactTable<T>
}

export default function TableContent<T>({ table }: TableContentProps<T>) {
    // Function to determine background color based on `customStatusID`
    const getRowBackgroundColor = (
        customStatusID: number,
        duration: number,
        deadline: number
    ) => {
        // First, handle the duration/deadline condition.
        // if (duration > deadline) {
        //     return "bg-red-100";
        // }

        // Then switch on customStatusID for the rest of the conditions.
        switch (customStatusID) {
            case 8: // Not Started
                return "bg-blue-100";
            case 20: // Not Started
                return "bg-blue-100";
            case 9: // In Progress
                return "bg-orange-100";
            case 10: // Completed
            case 16: // Also Completed
                return "bg-green-200";
            case 11: // Paused
                return "bg-yellow-100";
            case 12: // Cancelled
            case 19: // Also Cancelled
                return "bg-red-100";
            default:
                return ""; // Default no background
        }
    };

    return (
        <div className="rounded-md border">
            <UITable>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row: Row<T>) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className={getRowBackgroundColor(row.original.customStatus?.customStatusID, row.original.duration, row.original.deadline)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={table.getAllColumns().length}
                                className="h-24 text-center"
                            >
                                No results found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </UITable>
        </div>
    )
}
