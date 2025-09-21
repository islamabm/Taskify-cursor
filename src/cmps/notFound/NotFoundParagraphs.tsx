import React from 'react'
import { useTheme } from '../ThemeProvider';

export default function NotFoundParagraphs() {
    const { theme } = useTheme();
    const textColor = theme === "light" ? "text-black" : "text-white";
    return (
        <>
            <p className={`text-center md:text-lg ${textColor}`}>The page you’re looking for doesn’t exist.</p>
            <p className={`text-center md:text-lg ${textColor}`}>Maybe you are looking for one of these pages?</p>
        </>
    )
}
