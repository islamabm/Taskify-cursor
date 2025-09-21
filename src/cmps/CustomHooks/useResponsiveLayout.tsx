import { useEffect, useState } from 'react';

const useResponsiveLayout = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

export default useResponsiveLayout;
