
interface CheckboxHelperProps {
    readonly isWithLabel?: boolean;
    readonly label?: string;
    readonly checked: boolean;
    readonly onChange: () => void;
}

export function CheckboxHelper({ isWithLabel, label, checked, onChange }: CheckboxHelperProps) {
    const handleCheckboxChange = () => {
        onChange();  // Trigger the onChange prop from the parent
    };

    return (
        <div className="flex items-center space-x-2">
            <input type="checkbox" checked={checked} onChange={handleCheckboxChange} className="cursor-pointer w-5 h-5" />
            {isWithLabel && (
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </label>
            )}
        </div>
    );
}
