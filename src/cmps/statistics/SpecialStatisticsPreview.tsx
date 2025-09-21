import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Trophy, Clock, ListTodo, Timer } from "lucide-react";

const icons = {
    trophy: Trophy,
    clock: Clock,
    list: ListTodo,
    timer: Timer,
} as const;

type IconName = keyof typeof icons; // "trophy" | "clock" | "list" | "timer"


interface SpecialStatisticsPreviewProps {
    headerData: string;
    pOneData: string;
    pTwoData?: string;
    specialStyle?: string;
    icon?: IconName;
    gradient?: string;
}


export default function SpecialStatisticsPreview({
    headerData,
    pOneData,
    pTwoData = "",
    specialStyle = "",
    icon,
    gradient = "",
}: SpecialStatisticsPreviewProps) {
    // Choose the requested icon or fall back to Trophy
    const Icon = icon ? icons[icon] : Trophy;

    return (
        <Card className={`relative overflow-hidden ${gradient}`}>
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10 bg-white" />

            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    {/* Left block: header + two lines of text */}
                    <div className="space-y-2 text-left">
                        {/* <h4 className="text-sm font-semibold uppercase tracking-wide text-white/70">
                            {headerData}
                        </h4> */}

                        <h3 className="text-2xl font-bold text-white line-clamp-2">
                            {pOneData}
                        </h3>

                        {pTwoData && (
                            <p className="text-white/80 leading-snug">{pTwoData}</p>
                        )}
                    </div>

                    {/* Right block: icon */}
                    <div className="p-3 bg-white/20 rounded-xl shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
