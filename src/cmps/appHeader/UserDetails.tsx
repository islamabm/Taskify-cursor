import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar"
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
export function UserDetails() {
    const username = localStorage.getItem('fullName_TASKIFY')?.replace(/^"|"$/g, '') ?? '';

    return (


        <TooltipProvider >
            <Tooltip>
                <TooltipTrigger >
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{username}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
