import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    estimatedTime: number;
    setEstimatedTime: React.Dispatch<React.SetStateAction<number>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState(0);

    const value = useMemo(() => ({
        isLoading,
        setIsLoading,
        estimatedTime,
        setEstimatedTime
    }), [isLoading, estimatedTime]);

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};
