import React from 'react'
import { Table } from '@tanstack/react-table'

interface NumberOfRowsTableProps {
    readonly table: Table<any>,

}
export function NumberOfRowsTable({ table }: NumberOfRowsTableProps) {
    return (
        <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} rows.
        </div>
    )
}
