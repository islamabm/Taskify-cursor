import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface ChartPreviewProps {
    readonly chartType: string;
    readonly data: any;
    readonly specialStyle: boolean;
    readonly options: any;
}

export default function ChartPreview({ chartType, data, options, specialStyle }: ChartPreviewProps) {
    return (
        <div className="chart-container" style={{ width: `${specialStyle ? "45%" : "65%"}`, margin: `${specialStyle ? "100" : "0 auto"}`, marginTop: '20px' }}>
            {chartType === 'Bar' && <Bar data={data} options={options} />}
            {chartType === 'Pie' && <Pie data={data} options={options} />}
            {chartType === 'Doughnut' && <Doughnut data={data} options={options} />}
        </div>
    );
}
