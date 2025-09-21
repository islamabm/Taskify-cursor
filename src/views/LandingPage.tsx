import React from 'react';
import transition from '../transition';
import LandingPageHeader from '../cmps/landingPage/LandingPageHeader';
import LandingPageBadges from '../cmps/landingPage/LandingPageBadges';
import LandingPageMain from '../cmps/landingPage/LandingPageMain';
import LandingPageFooter from '../cmps/landingPage/LandingPageFooter';
import LandingPageFeatures from '../cmps/landingPage/LandingPageFeatures';
import { useTheme } from '../cmps/ThemeProvider';
import { getLandingPageData } from '../services/landingPage.service';

// 1) Import the utility function

/**
 * LandingPage:
 * Renders a marketing-style landing page with a header, badges, main features,
 * and a footer. Data for badges, features, and featuresData is fetched
 * from a utility file for a cleaner, more maintainable codebase.
 */
const LandingPage: React.FC = () => {
    // 2) Extract the data from the utility
    const { badges, features, featuresData } = getLandingPageData()

    // 3) Check the current theme
    const { theme } = useTheme();

    return (
        <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto p-6">
                {/* Header component */}
                <LandingPageHeader />

                {/* Badges row */}
                <div className="flex justify-center space-x-4 mb-10">
                    <LandingPageBadges badges={badges} />
                </div>

                {/* Main content area (features text) */}
                <div className="flex flex-col md:flex-row">
                    <LandingPageMain features={features} />
                </div>
            </div>

            {/* Detailed features section */}
            <LandingPageFeatures features={featuresData} />

            {/* Footer section */}
            <LandingPageFooter />
        </div>
    );
};

export default transition(LandingPage);
