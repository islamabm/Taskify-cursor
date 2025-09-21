import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";


interface TasksWidgetProps {
    readonly tasks: string[]; // Array of task names or IDs
    readonly businesses: string[]; // Array of business names or IDs
}

export default function TasksWidget({ tasks, businesses }: TasksWidgetProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 ">
            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Tasks in Progress</span>
                        <Badge variant="secondary" className="bg-white/20">
                            {tasks.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {tasks.map(business => (
                                <motion.div
                                    key={business}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Badge variant="secondary" className="bg-white/20">
                                        {business}
                                    </Badge>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>


        </div>
    );
}