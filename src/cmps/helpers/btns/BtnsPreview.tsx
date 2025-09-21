import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from '../../../components/ui/button';

interface BtnsPreviewProps {
    readonly domName: string;
    readonly routeName: string;
    readonly queryParams?: string
    readonly closeNavBar: () => void
}

export function BtnsPreview({ domName, routeName, queryParams, closeNavBar }: BtnsPreviewProps) {
    const navigate = useNavigate();

    async function handleNavigateTo() {
        try {
            const navigateModule = await import("../../../services/navigate.service")
            const path = queryParams ? `${routeName}/?${queryParams.toString()}` : routeName;
            navigateModule.navigateService.handleNavigation(navigate, path);
            closeNavBar();
        } catch (error) {
            console.error("error", error);
        }

    }

    return (
        <Button onClick={handleNavigateTo}>{domName}</Button>
    )
}
