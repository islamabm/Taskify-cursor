import React from 'react';

interface LandingPageMainPreviewProps {
    readonly label: string;
}

const LandingPageMainPreview: React.FC<LandingPageMainPreviewProps> = ({ label }) => {
    return (
        <li>
            {label}
        </li>
    );
};

export default LandingPageMainPreview;