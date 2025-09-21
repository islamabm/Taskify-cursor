import React from "react";
import SpecialStatisticsPreview from "./SpecialStatisticsPreview";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface SpecialStatisticsData {
    headerData: string;
    pOneData: string;
    pTwoData?: string;
    specialStyle?: string;
    icon?: "trophy" | "clock" | "list" | "timer";
    gradient?: string;
}

interface SpecialStatisticsListProps {
    data: SpecialStatisticsData[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function SpecialStatisticsList({
    data,
}: SpecialStatisticsListProps) {
    return (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
            {data.map((item) => (
                <SpecialStatisticsPreview
                    key={item.headerData}          /* unique key */
                    headerData={item.headerData}
                    pOneData={item.pOneData}
                    pTwoData={item.pTwoData}
                    specialStyle={item.specialStyle}
                    icon={item.icon}
                    gradient={item.gradient}
                />
            ))}
        </div>
    );
}
