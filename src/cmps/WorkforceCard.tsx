import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { ArrowBigRight } from "lucide-react";

export interface Employee {
    userID: number;
    fullName: string;
    workLog: any
}

interface WorkforceCardProps {
    /** Card heading (“Working Now”, “Off Duty”, …) */
    title: string;
    /** Array of employees to render */
    employees: Employee[];
    /** Gradient variant selector */
    type: "working" | "off";
    /** Fallback message if `employees` is empty */
    emptyMessage: string;
    /**
     * Optional list of logo URLs to render on the right under “Active businesses”.
     * If omitted or empty, the right‑hand column is hidden.
     */
}

/**
 * A gradient card that shows a list of employees on the left and – when provided –
 * a column of business logos on the right.
 */
const WorkforceCard: React.FC<WorkforceCardProps> = ({
    title,
    employees,
    type,
    emptyMessage,
}) => {
    /* Quick palette helpers */
    const isWorking = type === "working";
    const gradient = isWorking
        ? "bg-gradient-to-br from-emerald-500 to-teal-500"
        : "bg-gradient-to-br from-rose-500 to-pink-500";


    return (
        <div className={`rounded-2xl shadow-xl p-6 h-full overflow-y-auto  ${gradient}`}>
            {/* Wrapper flex – stack on mobile, split on larger screens */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* ───────────────────────────────── Employee list (LEFT) */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                            {employees.length}
                        </Badge>
                    </div>

                    {employees.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-white/80">{emptyMessage}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {employees.map((employee) => (
                                <motion.div
                                    key={employee.userID}
                                    className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 hover:shadow-md transition-all cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {/* Avatar + pulse ring when working */}
                                    <div className="relative">
                                        {isWorking &&

                                            <Avatar className="h-12 w-12">
                                                {employee.workLog.logoURL && < AvatarImage src={employee.workLog.logoURL} />}
                                                <AvatarFallback>
                                                    {employee.workLog.marketNameAr.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        }
                                        {!isWorking &&

                                            <Avatar className="h-12 w-12">
                                                {employee.fullName && < AvatarImage src={employee.fullName} />}
                                                <AvatarFallback>
                                                    {employee.fullName.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        }
                                        {isWorking && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-2 border-white/30"
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-white truncate">{employee.fullName}</p>
                                        {isWorking &&
                                            <p className="font-semibold text-white truncate">{employee.workLog.ticketID}</p>
                                        }
                                    </div>
                                    {isWorking &&
                                        <>

                                            <div className="flex-1">
                                                <ArrowBigRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-white truncate">{employee.workLog.
                                                    marketName} / {employee.workLog.
                                                        HaatBussID
                                                    }</p>

                                            </div>
                                        </>
                                    }


                                    <Badge
                                        variant="secondary"
                                        className={
                                            isWorking ? "bg-emerald-400/20 text-white" : "bg-white/20 text-white"
                                        }
                                    >
                                        {isWorking ? "🟢 Working" : "⚪️ Off"}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ───────────────────────────────── Business logos (RIGHT) */}

            </div>
        </div>
    );
};

export default WorkforceCard;
