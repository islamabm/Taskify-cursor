import React from 'react'
import DynamicDivWithSpan from '../helpers/DynamicDivWithSpan'


interface TaskMetricsCmpProps {
    readonly data: { valueToRender: string | number, labelToRender: string }[]

}

export default function TaskMetricsCmp({ data }: TaskMetricsCmpProps) {
    return (
        <div className="p-4">
            <DynamicDivWithSpan data={data} />
        </div>
    )
}
