import React from 'react'
import DynamicDivWithSpan from '../helpers/DynamicDivWithSpan'


interface TaskDatesCmpProps {
    readonly data: { valueToRender: string | number, labelToRender: string }[]

}

export default function TaskDatesCmp({ data }: TaskDatesCmpProps) {
    return (
        <div className="p-4">
            <DynamicDivWithSpan data={data} />
        </div>
    )
}
