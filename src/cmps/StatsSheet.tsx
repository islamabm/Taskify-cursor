// src/cmps/StatsSheet.tsx
import React from "react";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { BarChart2 } from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";   // ⬅️  NEW
import TaskStatsHeader from "./TaskStatsHeader";

interface StatsSheetProps {
    stats: ReturnType<typeof TaskStatsHeader>["props"]["stats"];
    triggerLabel?: string;
}

export default function StatsSheet({
    stats,
    triggerLabel = "Statistics",
}: StatsSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                >
                    {/* icon */}
                    <BarChart2 className="h-4 w-4" />
                    {/* screen-reader label (keeps the UI clean but stays accessible) */}
                    {/* <span className="sr-only">Filters</span> */}
                </Button>
            </SheetTrigger>


            {/* Slide-in from the left */}
            <SheetContent side="left" className="w-[320px] sm:w-[420px] p-6 z-50">
                <SheetHeader>
                    <SheetTitle className="text-lg font-semibold">
                        Tasks statistics
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea
                    /* full height minus header padding; tweak if needed */
                    className="mt-6 h-[calc(100vh-8rem)]"  // 8rem ≈ header + padding
                >


                    {/* one card per row */}
                    <div className="mt-6 [&_.stats-grid]:grid [&_.stats-grid]:grid-cols-1 [&_.stats-grid]:gap-4">
                        <TaskStatsHeader stats={stats} />
                    </div>
                </ScrollArea>
            </SheetContent>

        </Sheet>
    );
}
