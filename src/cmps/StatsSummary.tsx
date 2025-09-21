import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface StatsSummaryProps {
    readonly employeeStats: Array<{
        name: string;
        average: number;
        minutes: number;
    }>;
    readonly businessStats: Array<{
        name: string;
        minutes: number;
    }>;
}


export default function StatsSummary({ employeeStats, businessStats }: StatsSummaryProps) {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* <Card className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle>Employee Averages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {employeeStats.map(stat => (
                            <div key={stat.name} className="flex justify-between items-center">
                                <span>{stat.name}</span>
                                <Badge variant="secondary" className="bg-white/20">
                                    {Math.round(stat.average)} min/task
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card> */}

            <Card className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle>Business Totals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {businessStats.map(stat => (
                            <div key={stat.name} className="flex justify-between items-center">
                                <span>{stat.name}</span>
                                <Badge variant="secondary" className="bg-white/20">
                                    {stat.minutes} min
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle>Employee Totals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {employeeStats.map(stat => (
                            <div key={stat.name} className="flex justify-between items-center">
                                <span>{stat.name}</span>
                                <Badge variant="secondary" className="bg-white/20">
                                    {stat.minutes} min
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}