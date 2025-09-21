import React from 'react'
import { ModeToggle } from "../helpers/ModeToggle"
import AppHeaderLogoComponent from "./AppHeaderLogoComponent"
import AppHeaderLinks from "./AppHeaderLinks"
import { navigateService } from '../../services/navigate.service'
import { routeService } from '../../services/route.service'
import { useNavigate } from 'react-router-dom'

import { UserDetails } from './UserDetails'
import { LogoutValidationModal } from '../modals/LogoutValidationModal'

export function DesktopAppHeader() {
    const navigate = useNavigate()

    function handleGoToHomePage() {
        navigateService.handleNavigation(navigate, routeService.HOME)
    }

    return (
        <header className="container mx-auto flex justify-between items-center">
            {/* Use a button for clickable elements that perform actions */}
            <button
                onClick={handleGoToHomePage}
                className="cursor-pointer focus:outline-none"
                aria-label="Go to Home Page"
            >
                <AppHeaderLogoComponent />
            </button>

            <AppHeaderLinks />

            <nav className="flex items-center justify-center gap-4">
                <ModeToggle />
                <UserDetails />
                <LogoutValidationModal />
            </nav>
        </header>
    )
}
