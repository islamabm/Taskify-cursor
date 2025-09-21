import React from "react";
import { motion } from "framer-motion";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Shield, Clock, User2 } from "lucide-react";
import { User } from "../../types/commonTypes/commonTypes";

const typeColors: Record<string, string> = {
    "Super admin": "bg-purple-100 text-purple-700 border-purple-200",
    "Admin": "bg-blue-100 text-blue-700 border-blue-200",
    "Department admin": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Agent": "bg-green-100 text-green-700 border-green-200",
    "Regular employee": "bg-gray-100 text-gray-700 border-gray-200",
};

const statusColors: Record<string, string> = {
    "In Shift(available)": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Out of shift": "bg-gray-100 text-gray-700 border-gray-200",
    "Working(busy)": "bg-red-100 text-red-700 border-red-200",
    company: "bg-yellow-100 text-yellow-700 border-yellow-200",
};



interface UserProfileHeroProps {
    readonly user: User
}

export default function UserProfileHero({ user }: UserProfileHeroProps) {
    const getInitials = (name: string) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };




    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent dark:from-gray-900/40" />

            <Card className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-0 shadow-xl">
                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="relative"
                        >

                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-white/50 shadow-lg">
                                <span className="text-white text-2xl md:text-3xl font-bold">
                                    {getInitials(user.fullName)}
                                </span>
                            </div>

                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                <User2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        </motion.div>

                        {/* User Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex-1 space-y-4"
                        >
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {user.fullName || "Welcome"}
                                </h1>

                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Badge
                                    variant="secondary"
                                    className={`${typeColors[user.userType.userType] || typeColors["Employee"]} border px-3 py-1.5 font-medium`}
                                >
                                    <Shield className="w-4 h-4 mr-2" />
                                    {user.userType.userType}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className={`${statusColors[user.userStatus.userStatus] || statusColors["Offline"]} border px-3 py-1.5 font-medium`}
                                >
                                    <Clock className="w-4 h-4 mr-2" />
                                    {user.userStatus.userStatus}
                                </Badge>

                            </div>
                        </motion.div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}