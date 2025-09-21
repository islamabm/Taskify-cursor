import React from 'react'
import { ColorsHeader } from '../ColorsHeader'

interface TableItemsNumberTitleProps {
    readonly numberOfItems: number
    readonly title: string
}

export function TableItemsNumberTitle({ numberOfItems, title }: TableItemsNumberTitleProps) {

    return (
        <div className='flex justify-center mt-5'>
            <ColorsHeader numberOfItems={numberOfItems} title={title} />
        </div>

    )
}
