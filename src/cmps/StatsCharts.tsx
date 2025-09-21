import React, { useMemo } from 'react';
import {
    Card, CardContent, CardHeader, CardTitle,
} from '../components/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';


interface StatsChartsProps {
    readonly employeeStats: any
    readonly businessStats: any
}

export default function StatsCharts({ employeeStats, businessStats }: StatsChartsProps) {
    // ───────────────────────────────
    // 1.  Prepare data  (minutes ➔ hours)
    // ───────────────────────────────
    const employeeData = useMemo(
        () =>
            employeeStats.map((d) => ({
                ...d,
                hours: +(d.minutes / 60).toFixed(1), // keep one decimal
            })),
        [employeeStats],
    );

    const businessData = useMemo(
        () =>
            businessStats.map((d) => ({
                ...d,
                hours: +(d.minutes / 60).toFixed(1),
            })),
        [businessStats],
    );

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* ---------------- Employees ---------------- */}
            <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle>Employees (hrs)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={employeeData}>
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                                formatter={(value) => [`${value} hrs`, 'Total']}
                                cursor={{ fill: 'rgba(255,255,255,.15)' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(31,41,55,.9)',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    padding: '0.5rem 0.75rem',
                                }}
                                labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
                                itemStyle={{ color: '#e0f2fe' }}
                            />
                            <Bar dataKey="hours" fill="#fff" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* ---------------- Business ---------------- */}
            <Card className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle>Business (hrs)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={businessData}>
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                                formatter={(value) => [`${value} hrs`, 'Total']}
                                cursor={{ fill: 'rgba(255,255,255,.15)' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(31,41,55,.9)',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    padding: '0.5rem 0.75rem',
                                }}
                                labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
                                itemStyle={{ color: '#e0f2fe' }}
                            />
                            <Bar dataKey="hours" fill="#fff" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
