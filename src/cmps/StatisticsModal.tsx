import React, { FC, useMemo } from 'react';
import { Chart } from 'react-google-charts'; // <-- import from react-google-charts

interface IStatisticsModalProps {
    readonly tasksData: any[]; // Replace any[] with your actual Task type
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

const StatisticsModal: FC<IStatisticsModalProps> = ({ tasksData, isOpen, onClose }) => {
    // 1) Derive the counts (memoized). We re-calc only if tasksData changes
    const { notStarted, inProgress, paused, completed } = useMemo(() => {
        return {
            notStarted: tasksData.filter((task) => task.customStatus?.customStatusID === 8).length,
            inProgress: tasksData.filter((task) => task.customStatus?.customStatusID === 9).length,
            paused: tasksData.filter((task) => task.customStatus?.customStatusID === 11).length,
            completed: tasksData.filter((task) => task.customStatus?.customStatusID === 10).length,
        };
    }, [tasksData]);

    // 2) Transform counts into Google Charts data array
    //    The first row is the "header" (labels for each column),
    //    then each row is [label, value].
    const chartData = useMemo(() => {
        return [
            ['Status', 'Number of Tasks'],
            ['Not Started', notStarted],
            ['In Progress', inProgress],
            ['Paused', paused],
            ['Completed', completed],
        ];
    }, [notStarted, inProgress, paused, completed]);

    // 3) Configure 3D Donut chart options
    const chartOptions = useMemo(() => {
        return {
            title: 'Tasks Statistics',
            // 3D effect
            is3D: true,
            // donut shape
            pieHole: 0.4,
            // how slices are labeled
            pieSliceText: 'percentage', // show percentage
            legend: { position: 'labeled' },
            // optional: you can add specific slice colors, fonts, etc.
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop/Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <button
                    onClick={onClose}
                    className="float-right text-black bg-transparent hover:text-red-600"
                >
                    ✕
                </button>

                {/* <h2 className="text-xl font-semibold mb-4" id="modal-title">
                    Tasks Statistics
                </h2> */}

                <div className="p-4 flex justify-center items-center">
                    <Chart
                        chartType="PieChart"
                        data={chartData}
                        options={chartOptions}
                        width={'100%'}
                        height={'400px'}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatisticsModal;
