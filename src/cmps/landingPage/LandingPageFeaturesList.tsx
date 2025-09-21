import React from 'react';
import LandingPageFeaturePreview from './LandingPageFeaturePreview';

interface Feature {
    title: string;
    description: string;
    imageUrl: string;
    altText: string;
}

interface LandingPageFeaturesListProps {
    readonly features: Feature[];
}

const LandingPageFeaturesList: React.FC<LandingPageFeaturesListProps> = ({ features }) => {
    return (
        <div>
            {features.map((feature, index) => (
                <LandingPageFeaturePreview key={index} feature={feature} isImageFirst={index % 2 === 0} />
            ))}
        </div>
    );
};

export default LandingPageFeaturesList;
