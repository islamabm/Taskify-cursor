import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { queryKeysService } from '../services/queryKeys.service';
import { realTimeDataService } from '../services/realTimeData.service';
import { tasksService } from '../services/task.service';

import KPICard from '../cmps/KPICard';
import WorkforceCard from '../cmps/WorkforceCard';
import StatsCharts from '../cmps/StatsCharts';
import TasksStatisticsChart from '../cmps/TasksStatisticsChart';
import { Loader } from '../cmps/helpers/Loader';
import ErrorPage from '../cmps/ErrorPage';

/* ------------------------------------------------------------------ */
/* ✨  Local helpers                                                   */
/* ------------------------------------------------------------------ */

/** Convert seconds → whole minutes (rounded) for friendlier display. */
const secondsToMinutes = (seconds: number) => Math.round(seconds / 60);

/* ------------------------------------------------------------------ */
/* 🔥  Component                                                      */
/* ------------------------------------------------------------------ */

export default function LiveWorkforceStatus() {
    /* 📡  Live “who’s-working” dashboard   ––––––––––––––––––––––––––– */
    const {
        data: dashboardData,
        isLoading: isLoadingDashboard,
        isError: isErrorDashboard,
        error: dashboardError,
    } = useQuery({
        queryKey: [queryKeysService.DASHBOARD],
        queryFn: realTimeDataService.getDashboardData,
        //   ^ returns  { data: /* payload */ }
        select: (res) => res.data,          // 👈 strip the wrapper here
        retry: 1,
    });

    /* 📡  Tasks list – used by Stats chart   ––––––––––––––––––––––––– */
    /* 📡  Tasks list – used by Stats chart   ––––––––––––––––––––––––– */
    const {
        data: tasksData = [],                      //  ← give it a safe default
        isLoading: isLoadingTasks,
        isError: isErrorTasks,
        error: tasksError,
    } = useQuery({
        queryKey: [queryKeysService.TASKS],
        queryFn: tasksService.getTasks,
        select: (res) => Array.isArray(res.data) ? res.data : [],  //  ← ensure it's always an array
        retry: 1,
    });


    /* ⏳  Global loading / error guards ––––––––––––––––––––––––––––––– */
    if (isLoadingDashboard || isLoadingTasks || !dashboardData || !tasksData) {
        return <Loader />;
    }

    if (isErrorDashboard || isErrorTasks) {
        const err = (dashboardError ?? tasksError) as Error | undefined;
        return (
            <ErrorPage
                errorText={`Error fetching real-time data. Please try again later.
${err?.message ?? ''}`}
            />
        );
    }

    /* ---------------------------------------------------------------- */
    /* 🗂️  De-structure the payload (all fields optional on the API) */
    /* ---------------------------------------------------------------- */
    const {
        workingUsersArr = [],
        notWorkingUsersArr = [],
        uncompletedTicketsNum = 0,
        notAssignedTicketsNum = 0,
        tasksInProgress = [],
        employeesAndBusinesses = [],
        activeBusinesses = [],
        userLogs = [],
        businessLogs = [],
    } = dashboardData;

    /* ---------------------------------------------------------------- */
    /* ✨  Runtime transformations                                      */
    /* ---------------------------------------------------------------- */

    // Build employee-level stats for <StatsCharts />
    const employeeStats = userLogs.map((log) => {
        const minutes = secondsToMinutes(Number(log.totalDurationInSeconds));
        const avgPerLog =
            Number(log.logCount) > 0
                ? Number((minutes / Number(log.logCount)).toFixed(1))
                : 0;

        return {
            name: log.fullName,
            average: avgPerLog, // avg minutes per log-entry (1 decimal)
            minutes,            // total minutes on shift
        };
    });

    // Build business-level stats for <StatsCharts />
    const businessStats = businessLogs.map((log) => ({
        name: log.marketName,
        minutes: secondsToMinutes(Number(log.totalDurationInSeconds)),
    }));

    // Filter “off duty” list to specific departments
    const filterNotWorkingArr = notWorkingUsersArr.filter(
        (user) => user.departmentID === 6 || user.departmentID === 7
    );

    /* ---------------------------------------------------------------- */
    /* 🖼️  Render                                                       */
    /* ---------------------------------------------------------------- */
    return (
        <div className="h-screen bg-gray-50 p-[30px] flex flex-col">
            {/* ── Main grid (1/3 – 2/3) ────────────────────────────── */}
            <div className="flex-1 grid grid-cols-3 gap-4">
                {/* ░░ Left column ░░ */}
                <div className="col-span-1 flex flex-col gap-4 overflow-hidden">
                    {/* <div className="flex gap-4">
                        <KPICard
                            title={userLogs[0]?.fullName ?? 'No one'}
                            subtitle={`Total ⏱ ${Math.floor(
                                Number(userLogs[0]?.totalDurationInSeconds ?? 0) / 3600
                            )} hrs`}
                            icon="clock"
                            gradient="bg-gradient-to-br from-green-500 to-green-600"
                        />

                        <KPICard
                            title={businessLogs[0]?.marketName ?? 'No one'}
                            subtitle={`Total ⏱ ${Math.floor(
                                Number(businessLogs[0]?.totalDurationInSeconds ?? 0) / 3600
                            )} hrs`}
                            icon="timer"
                            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                        />
                    </div> */}


                    {/* Make the cards flex so they split leftover height */}
                    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                        <WorkforceCard
                            title="Working Now"
                            employees={workingUsersArr}
                            type="working"
                            emptyMessage="No one is on the clock right now."
                        />
                    </div>
                </div>

                {/* ░░ Right column ░░ */}
                <div className="col-span-2 flex flex-col gap-4 min-h-0 overflow-y-auto">
                    <TasksStatisticsChart tasksData={tasksData} businessLogs={businessLogs} userLogs={userLogs} />

                    <StatsCharts
                        employeeStats={employeeStats}
                        businessStats={businessStats}
                    />

                    <WorkforceCard
                        title="Off Duty"
                        employees={filterNotWorkingArr}
                        type="off"
                        emptyMessage="Everyone's on the clock – nice!"
                    />
                </div>
            </div>
        </div>
    );
}
