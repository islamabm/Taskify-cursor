import React from 'react';
import { motion } from 'framer-motion';

export default function TaskStatsHeader({ stats }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <motion.div
                className="
          stats-grid               /* <— NEW */
          grid gap-4
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
        "
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={`${stat.title}-${index}`}
                        variants={cardVariants}
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        className="group"
                    >
                        <div className="rounded-2xl bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/10">
                            {/* Title Bar */}
                            <div
                                className="px-3 py-2 text-center"
                                style={{ backgroundColor: stat.titleBackgroundColor }}
                            >
                                <h3 className="text-xs text-white font-bold uppercase tracking-wider truncate">
                                    {stat.title}
                                </h3>
                            </div>

                            {/* Number Display */}
                            <div className="py-6 px-4 text-center">
                                <div className="text-3xl font-bold text-black leading-none">
                                    {typeof stat.number === 'number'
                                        ? stat.number.toLocaleString()
                                        : stat.number
                                    }
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}