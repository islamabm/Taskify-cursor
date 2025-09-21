import React, { useEffect } from 'react';
import { useToast } from "../../components/ui/use-toast"

interface ToastProps {
    variant: 'success' | 'destructive';
    title: string;
    description: string;
}

const ToastComponent: React.FC<ToastProps> = ({ variant, title, description }) => {
    const { toast } = useToast();

    const showToast = () => {
        if (variant === "success") {
            toast({
                title,
                description,
            });
        } else {
            toast({
                variant,
                title,
                description,
            });
        }
    };

    useEffect(() => {
        showToast();
    }, [variant, title, description, toast]);

    return null;
};

export default ToastComponent;
