import React from 'react'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Table } from '@tanstack/react-table'

interface TableColumnsDropDownProps {
    readonly table: Table<any>,
    readonly columnNamesProps: { [key: string]: string };
}

export default function TableColumnsDropDown({ table, columnNamesProps }: TableColumnsDropDownProps) {
    const columnNames = columnNamesProps
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                    Columns<ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                        const columnName = columnNames[column.id] || column.id;
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                }
                            >
                                {columnName}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>

        </DropdownMenu>
    )
}
