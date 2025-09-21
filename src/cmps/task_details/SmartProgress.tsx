import React, { memo } from 'react';
import { motion } from 'framer-motion';

export type SmartProgressProps = {
    current: number;
    total: number;
    showPercent?: boolean;
    label?: string;
    className?: string;
    /** Adjust the height of the bar via tailwind class (e.g. 'h-2', 'h-3') */
    barHeightClass?: string;
};

const SmartProgress: React.FC<SmartProgressProps> = ({
    current,
    total,
    showPercent = true,
    label,
    className = "",
    barHeightClass = "h-2",
}) => {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const isComplete = percentage >= 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-full ${className}`}
        >
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {current} of {total}
                    </span>
                </div>
            )}

            <div className="relative">
                <div
                    className={`${barHeightClass} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner`}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progress: ${percentage}% complete`}
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={`h-full rounded-full relative overflow-hidden ${isComplete
                                ? 'bg-gradient-to-r from-green-400 to-green-500'
                                : 'bg-gradient-to-r from-blue-400 to-blue-500'
                            }`}
                    >
                        {/* gloss */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/10 rounded-full" />
                        {/* shine sweep */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
                            className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                        />
                    </motion.div>
                </div>

                {showPercent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1"
                    >
                        <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${isComplete
                                    ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
                                    : 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'
                                }`}
                        >
                            {percentage}%
                        </span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default memo(SmartProgress);
