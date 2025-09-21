import React from 'react'


interface WhatsappMessagingPreviewProps {
    readonly text: string;
    readonly time: string;
    readonly isBoss: boolean;
}

export default function WhatsappMessagingPreview({ text, time, isBoss }: WhatsappMessagingPreviewProps) {
    return (
        <div className={`flex ${isBoss ? "justify-start" : "justify-end"}`}>
            <div className={`rounded-lg px-4 py-2 max-w-[70%] shadow ${isBoss ? "bg-white" : "bg-[#dcf8c6]"}`}>
                <div className="text-gray-800">{text}</div>
                {/* <div className={`text-[11px] text-gray-500 ${isBoss ? "" : "self-end"}`}>{time}</div> */}
            </div>
        </div>
    )
}
