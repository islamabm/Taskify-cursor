import React from 'react';
import LandingPageBadgesPreview from './LandingPageBadgesPreview';

interface LandingPageBadgesListProps {
    readonly badges: string[];
}

const LandingPageBadgesList: React.FC<LandingPageBadgesListProps> = ({ badges }) => {
    return (
        <div className="flex justify-center space-x-4 mb-10">
            {badges.map((badge) => (
                <LandingPageBadgesPreview key={badge} label={badge} />
            ))}
        </div>
    );
};

export default LandingPageBadgesList;
