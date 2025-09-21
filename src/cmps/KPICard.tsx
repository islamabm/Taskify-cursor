import React from 'react';
import { Card, CardContent } from "../components/ui/card";
import { Trophy, Clock, ListTodo, Timer } from "lucide-react";

const icons = {
    trophy: Trophy,
    clock: Clock,
    list: ListTodo,
    timer: Timer
};

export default function KPICard({ title, subtitle, icon, gradient }) {
    const Icon = icons[icon];

    return (
        <Card className={`relative overflow-hidden ${gradient}`}>
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10 bg-white" />
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white line-clamp-2">{title}</h3>
                        <p className="text-white/80">{subtitle}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}