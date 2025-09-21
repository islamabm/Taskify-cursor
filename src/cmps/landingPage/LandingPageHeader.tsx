import { TypewriterEffect } from '../../components/ui/typewriter-effect';
import React from 'react'


export default function LandingPageHeader() {
    const words = [
        {
            text: "Taskify:",
        },
        {
            text: "streamline",
        },
        {
            text: "your",
        },
        {
            text: "team's",
        },
        {
            text: "workflow.",
            className: "text-blue-500 dark:text-blue-500",
        },
    ];
    return (
        <TypewriterEffect words={words} />
    )
}



