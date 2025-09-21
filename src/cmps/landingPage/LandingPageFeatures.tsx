import React from 'react'
import LandingPageFeaturesList from './LandingPageFeaturesList';
interface Feature {
    title: string;
    description: string;
    imageUrl: string;
    altText: string;
}

interface LandingPageFeaturesProps {
    readonly features: Feature[];
}
export default function LandingPageFeatures({ features }: LandingPageFeaturesProps) {
    return (
        <LandingPageFeaturesList features={features} />
    )
}
