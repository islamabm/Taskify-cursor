import React, { FC, useMemo } from 'react';
import { Chart } from 'react-google-charts';
import KPICard from './KPICard';

/* ——— Types (replace with your real domain models if you have them) ——— */
interface Task { customStatus?: { customStatusID: number }; }
interface UserLog { fullName: string; totalDurationInSeconds: number; }
interface BusinessLog { marketName: string; totalDurationInSeconds: number; }

interface TasksStatisticsChartProps {
    readonly tasksData: Task[];
    readonly userLogs: UserLog[];
    readonly businessLogs: BusinessLog[];
}

/* ——— Helper: seconds → whole hours ——— */
const secondsToHours = (sec: number) => Math.floor(sec / 3600);

/* ——— Component ——— */
const TasksStatisticsChart: FC<TasksStatisticsChartProps> = ({
    tasksData = [],
    userLogs = [],
    businessLogs = [],
}) => {
    /* 1️⃣  Count tasks by status ID */
    const counts = useMemo(() => {
        const id = { notStarted: 8, inProgress: 9, paused: 11, completed: 10 };
        return tasksData.reduce(
            (acc, t) => {
                const s = t.customStatus?.customStatusID;
                if (s === id.notStarted) acc.notStarted += 1;
                else if (s === id.inProgress) acc.inProgress += 1;
                else if (s === id.paused) acc.paused += 1;
                else if (s === id.completed) acc.completed += 1;
                return acc;
            },
            { notStarted: 0, inProgress: 0, paused: 0, completed: 0 }
        );
    }, [tasksData]);

    const { notStarted, inProgress, paused, completed } = counts;

    /* 2️⃣  Build data table with an annotation column
           ┌──────────────── label shown on axis
           │      ┌───────── numeric value for the bar
           │      │    ┌──── annotation (must be string/number & role:"annotation")
    */
    const chartData = useMemo(
        () => [
            ['Status', 'Number of Tasks', { role: 'annotation' }],
            ['Not Started', notStarted, String(notStarted)],
            ['In Progress', inProgress, String(inProgress)],
            ['Paused', paused, String(paused)],
            ['Completed', completed, String(completed)],
        ],
        [notStarted, inProgress, paused, completed]
    );

    /* 3️⃣  Decide whether we need a log scale (≥ 20× spread),
           and configure annotation styling.                             */
    const chartOptions = useMemo(() => {
        const vals = [notStarted, inProgress, paused, completed].filter((v) => v > 0);
        const max = Math.max(...vals, 0);
        const min = Math.min(...vals, 1);
        const useLog = max / min > 20;

        return {
            title: 'Tasks Statistics',
            legend: { position: 'none' },
            bar: { groupWidth: '70%' },
            chartArea: { bottom: 50, top: 40, left: 60, width: '80%' },
            vAxis: useLog
                ? { logScale: true, title: 'Number of Tasks (log scale)' }
                : { title: 'Number of Tasks' },

            /* ←–– this block makes the numbers show on the bars */
            annotations: {
                alwaysOutside: true,          // put the labels above the bars
                textStyle: {
                    fontSize: 12,
                    auraColor: 'none',
                    color: '#444',
                },
            },
        };
    }, [notStarted, inProgress, paused, completed]);

    /* 4️⃣  KPI helpers */
    const firstUser = userLogs[0];
    const topBusiness = businessLogs[0];
    const secondBusiness = businessLogs[1];

    return (
        <div className="flex justify-center items-center gap-5 w-full">
            {/* ░░ Chart ░░ */}
            <div className="w-1/2">
                <Chart
                    chartType="ColumnChart"          /* vertical bars */
                    data={chartData}
                    options={chartOptions}
                    width="100%"
                    height="400px"
                    loader={<div>Loading chart…</div>}
                />
            </div>

            {/* ░░ KPI cards ░░ */}
            <div className="w-1/2 flex flex-col gap-5">
                <KPICard
                    title={firstUser?.fullName ?? 'No one'}
                    subtitle={`Total ⏱ ${secondsToHours(
                        firstUser?.totalDurationInSeconds ?? 0
                    )} hrs`}
                    icon="clock"
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />

                <KPICard
                    title={topBusiness?.marketName ?? 'No one'}
                    subtitle={`Total ⏱ ${secondsToHours(
                        topBusiness?.totalDurationInSeconds ?? 0
                    )} hrs`}
                    icon="timer"
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                />

                <KPICard
                    title={secondBusiness?.marketName ?? 'No one'}
                    subtitle={`Total ⏱ ${secondsToHours(
                        secondBusiness?.totalDurationInSeconds ?? 0
                    )} hrs`}
                    icon="timer"
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>
        </div>
    );
};

export default TasksStatisticsChart;
