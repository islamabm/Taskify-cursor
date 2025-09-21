import React from "react";
import DivWithSpan from "./DivWithSpan";

interface DynamicDivWithSpanProps {
    readonly data: {
        valueToRender: string | number;
        labelToRender: string;
    }[];
}

export default function DynamicDivWithSpan({ data }: DynamicDivWithSpanProps) {
    return (
        <div>
            {data.map((item, index) => (
                <DivWithSpan
                    key={index}
                    valueToRender={item.valueToRender}
                    labelToRender={item.labelToRender}
                />
            ))}
        </div>
    );
}
