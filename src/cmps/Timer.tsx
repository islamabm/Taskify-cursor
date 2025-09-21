import React, { useEffect, useState, useRef } from 'react';

interface TimerProps {
    readonly startTime: Date | string;
    readonly paused: boolean;
}

const Timer: React.FC<TimerProps> = ({ startTime, paused }) => {
    const [timeElapsed, setTimeElapsed] = useState(0);
    const startTimeRef = useRef<Date>(new Date(startTime));  // Convert startTime to a Date object
    const pauseTimeRef = useRef<number | null>(null);

    useEffect(() => {
        // Update startTimeRef if startTime prop changes
        startTimeRef.current = new Date(startTime);
    }, [startTime]);

    useEffect(() => {
        if (paused) {
            // Store current elapsed time when paused
            pauseTimeRef.current = Date.now();
        } else {
            // Adjust startTime based on paused duration
            if (pauseTimeRef.current) {
                const pausedDuration = Date.now() - pauseTimeRef.current;
                startTimeRef.current = new Date(startTimeRef.current.getTime() + pausedDuration);
                pauseTimeRef.current = null;
            }
            const interval = setInterval(() => {
                setTimeElapsed(Date.now() - startTimeRef.current.getTime());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [paused]);

    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Ensure time is updated when startTime changes
    useEffect(() => {
        setTimeElapsed(Date.now() - startTimeRef.current.getTime());
    }, [startTime]);

    return (
        <div style={{
            padding: '8px 16px',
            background: '#f0f0f0',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            fontSize: '16px',
            display: 'inline-block'
        }}>
            {formatTime(timeElapsed)}
        </div>
    );
};

export default Timer;
