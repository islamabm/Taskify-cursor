import React from 'react';

interface StatsCardProps {
    title: string;
    number: number | string;
    titleBackgroundColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, number, titleBackgroundColor }) => {
    const userTypeID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || '';

    // Conditional rendering based on userTypeID
    // if (title === "Chart" && !["5", "4", "3"].includes(userTypeID)) {
    //     return null; // Do not render anything if the conditions are not met
    // }

    return (
        <div className="border rounded-lg shadow-md overflow-hidden">
            {/* Title Section */}
            <div
                className={`${title === "TOTAL TASKS" ? "text-white" : "text-black"} text-center font-bold py-2`}
                style={{ backgroundColor: titleBackgroundColor }}
            >
                {title}
            </div>
            {/* Number Section */}
            <div className="text-center py-6 text-3xl font-semibold">{number}</div>
        </div>
    );
};

export default StatsCard;
