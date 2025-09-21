import React from 'react';
import WhatsappMessagingPreview from './WhatsappMessagingPreview';

interface WhatsappMessagingListProps {
    readonly messages: Array<{ text: string; time: string; isBoss: boolean }>;
}

export default function WhatsappMessagingList({ messages }: WhatsappMessagingListProps) {
    return (
        <div className="flex-1 p-4 overflow-y-auto border border-gray-200 rounded-md bg-white">
            {messages.map((message) => (
                <WhatsappMessagingPreview key={`${message.text}-${message.time}`} text={message.text} time={message.time} isBoss={message.isBoss} />
            ))}
        </div>
    );
}
