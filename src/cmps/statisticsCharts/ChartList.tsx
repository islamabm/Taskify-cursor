// ChartList.tsx
import React from 'react';
import ChartPreview from './ChartPreview';

interface ChartDataItem {
    readonly data: any;
}

interface ChartListProps {
    readonly chartType: string;
    readonly chartDataArray: ChartDataItem[];
    readonly options: any;
    readonly specialStyle: boolean;
}

export default function ChartList({ chartType, chartDataArray, options, specialStyle }: ChartListProps) {
    return (
        <>
            {chartDataArray.map((chartDataItem, index) => (
                <ChartPreview key={index} chartType={chartType} data={chartDataItem.data} options={options} specialStyle={specialStyle} />
            ))}
        </>
    );
}
