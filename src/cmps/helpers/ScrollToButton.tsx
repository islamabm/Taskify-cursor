import React from 'react';
import { IconWithTooltip } from './IconWithTooltip';
import { Button } from '../../components/ui/button';

interface ScrollButtonProps {
    readonly direction: string;
}

export default function ScrollToButton({ direction }: ScrollButtonProps) {

    const handleScroll = () => {
        if (direction === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (direction === 'bottom') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    };

    const ariaLabel = direction === 'top' ? 'Scroll to top' : 'Scroll to bottom';
    const iconName = direction === 'top' ? 'ArrowUpToLine' : 'ArrowDownToLine';
    const tooltipTitle = direction === 'top' ? 'Scroll to top' : 'Scroll to bottom';

    return (
        <Button
            onClick={handleScroll}
            className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-1000"
            aria-label={ariaLabel}
        >
            <IconWithTooltip iconName={iconName} tooltipTitle={tooltipTitle} />
        </Button>
    );
}
