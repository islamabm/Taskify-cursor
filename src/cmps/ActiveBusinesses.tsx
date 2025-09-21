import React from 'react'

interface ActiveBusinessesProps {
    readonly businessLogos: string[]; // Array of business logo URLs
}

export default function ActiveBusinesses({ businessLogos }: ActiveBusinessesProps) {
    if (businessLogos.length === 0) return null;

    return (
        <div className="flex gap-1">
            <div className="w-full">
                {/* <h3 className="mb-4 text-lg font-semibold ">Active businesses</h3> */}
                {/* Six logos per row */}
                <div className="flex flex-wrap gap-4">
                    {businessLogos.map((src) => (
                        <img
                            key={src}
                            src={src}
                            alt="Business logo"
                            className="h-[100px] w-[100px]  object-contain  p-2 shadow-md rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div >
    );
}
