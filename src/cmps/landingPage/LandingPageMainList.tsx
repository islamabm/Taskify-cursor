import React from 'react';
import LandingPageMainPreview from './LandingPageMainPreview';

interface LandingPageMainListProps {
    readonly features: string[];
}

const LandingPageMainList: React.FC<LandingPageMainListProps> = ({ features }) => {


    return (
        <ul className={"list-disc list-inside mb-4"}>
            {features.map((feature) => (
                <LandingPageMainPreview key={feature} label={feature} />
            ))}
        </ul>
    );
};

export default LandingPageMainList;
