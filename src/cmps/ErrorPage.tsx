import React from 'react';
import { ColorsHeader } from './helpers/ColorsHeader';
import { Button } from '../components/ui/button';
import { AnimatedCmp } from './helpers/AnimatedCmp';
// import { useNavigate } from 'react-router-dom';
// import { navigateService } from '../services/navigate.service';
import ErrorPageAnimation from '../LottieAnimations/ErrorPageAnimation.json'

interface ErrorPageProps {
    readonly errorText?: string;
}

export default function ErrorPage({ errorText }: ErrorPageProps) {

    // const navigate = useNavigate()

    // function hanldeGoHome() {
    //     navigateService.handleNavigation(navigate, '/')

    // }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <AnimatedCmp animatedName={ErrorPageAnimation} />

            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
                <ColorsHeader title="Oops! Something went wrong" />
                <p className="text-lg text-gray-600 mt-4">
                    It looks like there's an error on our side. Please try again or contact us.
                </p>
                {errorText && (
                    <p className="mt-2 text-sm text-gray-500">
                        {errorText}
                    </p>
                )}
                <div className="mt-6 space-x-4">
                    <Button
                        onClick={() => window.location.reload()}
                    >
                        Reload page
                    </Button>
                    {/* <Button
                        onClick={hanldeGoHome}
                    >
                        Go to Home
                    </Button> */}
                </div>
            </div>
        </div>
    );
}
