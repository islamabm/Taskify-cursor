import React from 'react'

interface DivWithSpanProps {
    readonly valueToRender: string | number
    readonly labelToRender: string
}

export default function DivWithSpan({ valueToRender, labelToRender }: DivWithSpanProps) {
    return (
        <div>
            <span className="font-semibold">{labelToRender}:</span>{" "}
            {valueToRender || "N/A"}
        </div>
    )
}
