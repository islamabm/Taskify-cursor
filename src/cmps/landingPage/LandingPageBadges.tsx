import React from 'react'
import LandingPageBadgesList from './LandingPageBadgesList'


interface LandingPageBadgesProps {
    readonly badges: string[];
}

export default function LandingPageBadges({ badges }: LandingPageBadgesProps) {
    return (
        <LandingPageBadgesList badges={badges} />
    )
}
