import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

export interface TicketIndicatorProps {
    label: string;
    exists: boolean;
}

const TicketIndicator: React.FC<TicketIndicatorProps> = ({ label, exists }) => (
    <div className="inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-gray-50 border">
        {exists ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
        ) : (
            <XCircle className="w-4 h-4 text-red-500" />
        )}
        <span>{label}</span>
    </div>
);

export default TicketIndicator;
