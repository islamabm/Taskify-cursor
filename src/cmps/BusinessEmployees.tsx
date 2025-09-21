import React from "react";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import KPICard from "./KPICard";

export type EmployeeBusiness = {
    fullName: string;
    marketName: string;
};

interface WorkforcePairsProps {
    data: EmployeeBusiness[];
    logoSrc?: string;
}

export const BusinessEmployees: React.FC<WorkforcePairsProps> = ({
    data,
    logoSrc = "https://haatdaas.lan-wan.net/daas/images/drLogo.png",
}) => {
    return (
        <div className="flex flex-wrap gap-4">
            {data.map(({ fullName, logoURL, marketName }) => {
                const initial = fullName.charAt(0).toUpperCase();

                return (
                    <div
                        key={fullName}
                        className="w-1/4 flex-none flex items-center gap-3 rounded-2xl
                       bg-white/60 px-3 py-2 shadow-sm backdrop-blur-sm
                       dark:bg-black/40"
                    >
                        {/* Employee */}
                        <div className="flex flex-col items-center text-center w-20 shrink-0">
                            <span className="max-w-[4.5rem] truncate  text-gray-800 dark:text-gray-100 text-2xl font-bold  line-clamp-2">
                                {fullName}
                            </span>
                            <Avatar className="mt-0.5 h-8 w-8 border border-muted/40 bg-muted">
                                <AvatarFallback className="text-sm font-semibold text-primary/80">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />

                        {/* Logo */}
                        <span className="max-w-[4.5rem] truncate text-xs font-medium text-gray-800 dark:text-gray-100">
                            {marketName}
                        </span>
                        <img
                            src={logoURL}
                            alt="Business logo"
                            className="h-[100px] w-[100px]  select-none object-contain rounded-full"
                        />
                    </div>
                );

            })}
        </div>
    );
};
