import { NavigateFunction } from 'react-router-dom';

export const navigateService = {
    handleNavigation,
}

function handleNavigation(navigate: NavigateFunction, destination: string) {
    navigate(destination);
}
