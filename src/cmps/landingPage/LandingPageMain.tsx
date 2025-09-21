import React from 'react'
import LandingPageMainList from './LandingPageMainList'
import LandingPageMainImage from './LandingPageMainImage';
interface LandingPageMainProps {
    readonly features: string[];
}

export default function LandingPageMain({ features }: LandingPageMainProps) {
    return (
        <>
            <div className="md:w-1/2 pr-4">
                <h2 className="text-xl font-semibold mb-4">Centralize Task Management</h2>
                <LandingPageMainList features={features} />
            </div>
            <LandingPageMainImage />
        </>
    )
}
