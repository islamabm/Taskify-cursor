import React from 'react';

interface Feature {
    title: string;
    description: string;
    imageUrl: string;
    altText: string;
}

interface LandingPageFeaturePreviewProps {
    readonly feature: Feature;
    readonly isImageFirst: boolean;
}

const LandingPageFeaturePreview: React.FC<LandingPageFeaturePreviewProps> = ({ feature, isImageFirst }) => {


    return (
        <div className="flex justify-center items-center special-background p-3 gap-8">
            {isImageFirst && (
                <div className="w-[450px] h-[450px]">
                    <img
                        src={feature.imageUrl}
                        alt={feature.altText}
                        className="rounded-lg"
                    />
                </div>
            )}
            <div className="mt-4 md:mt-0 md:ml-6">
                <h2 className={`text-2xl font-semibold  text-black `}>{feature.title}</h2>
                <hr className={`my-2 border-gray-500`} />
                <p className={`text-lg text-black`}> {feature.description}</p>
            </div>
            {
                !isImageFirst && (
                    <div className="w-[450px] h-[450px]">
                        <img
                            src={feature.imageUrl}
                            alt={feature.altText}
                            className="rounded-lg"
                        />
                    </div>
                )
            }
        </div >
    );
};

export default LandingPageFeaturePreview;
