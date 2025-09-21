import React from 'react'



interface ColorsHeaderProps {
    readonly numberOfItems?: number
    readonly title: string
}

export function ColorsHeader({ numberOfItems, title }: ColorsHeaderProps) {
    return (
        <h1 className=" font-bold text-2xl">{numberOfItems} {title} </h1>

    )
}
