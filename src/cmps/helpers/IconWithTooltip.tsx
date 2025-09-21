import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Icon } from './Icon';

interface IconWithTooltipProps {
    readonly iconName: string,
    readonly tooltipTitle: string,
    readonly onClick?: () => void;
}

export function IconWithTooltip({ iconName, tooltipTitle, onClick }: IconWithTooltipProps) {
    return (
        <TooltipProvider >
            <Tooltip>
                <TooltipTrigger onClick={onClick}>
                    <Icon name={iconName} />
                </TooltipTrigger>
                <TooltipContent>
                    <p >{tooltipTitle}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
