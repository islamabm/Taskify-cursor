import React from 'react'
import DynamicDivWithSpan from '../helpers/DynamicDivWithSpan'


interface TaskDetailsCmpProps {
    readonly data: { valueToRender: string, labelToRender: string }[]

}

export default function TaskDetailsCmp({ data }: TaskDetailsCmpProps) {
    return (
        <div className="p-4">
            <DynamicDivWithSpan data={data} />
        </div>
    )
}
