import React from 'react';

interface LandingPageBadgesPreviewProps {
    readonly label: string;
}

const LandingPageBadgesPreview: React.FC<LandingPageBadgesPreviewProps> = ({ label }) => {
    return (
        <button className="bg-gray-100 text-black px-4 py-2 rounded-full cursor-text">
            {label}
        </button>
    );
};

export default LandingPageBadgesPreview;
