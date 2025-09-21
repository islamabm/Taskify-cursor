import React from 'react'
import { BtnsPreview } from './BtnsPreview';

interface BtnsListProps {
    readonly btnsArr: { domName: string; routeName: string; queryParams?: string }[];
    readonly divClassName: string,
    readonly closeNavBar?: () => void
}

export default function BtnsList({ btnsArr, divClassName, closeNavBar = () => { } }: BtnsListProps) {
    return (
        <div className={divClassName}>
            {btnsArr.map((btn) => (
                <BtnsPreview
                    key={btn.routeName}
                    domName={btn.domName}
                    routeName={btn.routeName}
                    queryParams={btn.queryParams}
                    closeNavBar={closeNavBar}
                />
            ))}
        </div>
    )
}
