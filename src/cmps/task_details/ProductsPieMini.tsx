import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export type ProductsPieMiniProps = {
    title?: string;
    labels: string[];
    values: number[];
    className?: string;
};

const ProductsPieMini: React.FC<ProductsPieMiniProps> = ({
    title = "Statistics",
    labels,
    values,
    className = "",
}) => {
    const data = labels.map((name, i) => ({ name, value: values[i] || 0 }));
    const colors = ['#ef4444', '#10b981', '#6366f1', '#f59e0b', '#06b6d4'];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const p = payload[0];
            return (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">{p.value}</span> items
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`bg-white/60 dark:bg-gray-800/40 rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-3 ${className}`}
        >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                {title}
            </h4>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            innerRadius="55%"
                            paddingAngle={2}
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={colors[i % colors.length]} className="hover:opacity-80 transition-opacity" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {/* simple legend */}
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span
                            className="inline-block w-3 h-3 rounded"
                            style={{ backgroundColor: colors[i % colors.length] }}
                        />
                        <span className="truncate">{d.name}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default memo(ProductsPieMini);
