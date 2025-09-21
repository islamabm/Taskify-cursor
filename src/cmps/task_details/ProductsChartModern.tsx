import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

export type ProductsChartModernProps = {
    title?: string;
    labels: string[];
    values: number[];
    className?: string;
};

const ProductsChartModern: React.FC<ProductsChartModernProps> = ({
    title = "Statistics Overview",
    labels,
    values,
    className = ""
}) => {
    const chartData = labels.map((label, index) => ({
        name: label,
        value: values[index] || 0,
        displayName: label.replace(/Products?/gi, '').trim() || label
    }));

    const colors = ['#ef4444', '#10b981', '#6366f1'];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">{payload[0].value}</span> items
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomizedLabel = (props: any) => {
        const { x, y, width, value } = props;
        if (!value) return null;
        return (
            <text
                x={x + width / 2}
                y={y - 4}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
            >
                {value}
            </text>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg ${className}`}
        >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
                {title}
            </h3>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                        <XAxis dataKey="displayName" tick={{ fontSize: 12 }} className="text-gray-600 dark:text-gray-400" interval={0} />
                        <YAxis tick={{ fontSize: 12 }} className="text-gray-600 dark:text-gray-400" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} label={<CustomizedLabel />}>
                            {chartData.map((_, idx) => (
                                <Cell key={idx} fill={colors[idx % colors.length]} className="hover:opacity-80 transition-opacity" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default memo(ProductsChartModern);
