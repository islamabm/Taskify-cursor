import * as React from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface ToggleTasksShowProps {
    readonly view: string;
    readonly onChange: (event: React.MouseEvent<HTMLElement>, nextView: string) => void;
}

export default function ToggleTasksShow({ view, onChange }: ToggleTasksShowProps) {
    return (
        <ToggleButtonGroup
            orientation="horizontal"
            value={view}
            exclusive
            onChange={onChange}
        >
            <ToggleButton value="list" aria-label="list">
                <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
                <ViewModuleIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
