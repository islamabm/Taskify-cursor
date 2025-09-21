import React, { useEffect, useState } from 'react'
import { useTheme } from '../ThemeProvider';

export function Loader() {


    const { theme } = useTheme()
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    return (
        <div className="centered-container" style={{ width: dimensions.width, height: dimensions.height }}>
            <div className="loader" ></div>
        </div>
    )

}
