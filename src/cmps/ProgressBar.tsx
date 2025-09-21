import React from 'react';

// Define a type for the component props
type ProgressBarProps = {
    readonly current: number;
    readonly total: number;
    readonly isPercentages: boolean;
};

export function ProgressBar({ current, total, isPercentages }: ProgressBarProps) {
    // Calculate the percentage
    const percentage = total > 0 ? (current / total) * 100 : 0;

    // Determine the background color based on the context and percentage
    let backgroundColor: string;

    if (percentage <= 30) {
        backgroundColor = "red";
    } else if (percentage <= 65) {
        backgroundColor = "yellow";
    } else {
        backgroundColor = "green";
    }

    // Explanatory text
    const labelText = `Processed Products: ${current} of ${total}`;

    return (
        <div className="progress-bar-wrapper">
            {/* Label to indicate what 'current' represents */}
            <div className="progress-bar__label">
                <p>{labelText}</p>
            </div>
            <div className="progress-bar__indicator">
                <p className="progress-bar__indicator-text">
                    {isPercentages ? `${percentage.toFixed(0)}%` : `${current}/${total}`}
                </p>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-bar__fill"
                    style={{ width: `${percentage}%`, background: backgroundColor }}
                ></div>
            </div>
        </div>
    );
}
