import React from 'react';
import WhatsappMessagingList from './whatsapp/WhatsappMessagingList';

interface WhatsappMessagingProps {
    readonly messages: Array<{ text: string; time: string; isBoss: boolean }>;
    readonly onClose: () => void;
}

export default function WhatsappMessaging({ messages, onClose }: WhatsappMessagingProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-4 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">✖</button>
                <div className="flex flex-col h-full">
                    <h2 className="text-lg font-semibold text-center mb-4">Chat</h2>
                    <WhatsappMessagingList messages={messages} />
                </div>
            </div>
        </div>
    );
}
