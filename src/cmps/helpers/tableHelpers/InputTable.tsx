import { Table } from '@tanstack/react-table'
import React from 'react'
import BasicInput from '../BasicInput'

interface InputTableProps {
    readonly table: Table<any>,
    readonly placeHolder: string,
    readonly filterColumnName: string
    readonly name: string
}

export function InputTable({ table, placeHolder, filterColumnName, name }: InputTableProps) {
    return (
        <BasicInput
            inputPlaceHolder={placeHolder}
            inputValue={(table.getColumn(filterColumnName)?.getFilterValue() as string) ?? ""}
            inputType="text"
            onChange={(event) =>
                table.getColumn(filterColumnName)?.setFilterValue(event.target.value)}
            name={name}
            inputClassName="max-w-sm" />
    )
}
