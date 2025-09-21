import React from 'react';
import { LinksPreview } from './LinksPreview';

interface Link {
    domName: string;
    routeName: string;
    queryParams?: URLSearchParams;
}

interface LinksListProps {
    readonly linksArr: Link[];
}

export default function LinksList({ linksArr }: LinksListProps) {
    return (
        <div className="flex items-center gap-6">
            {linksArr.map((link) => (
                <LinksPreview
                    key={link.routeName}
                    domName={link.domName}
                    routeName={link.routeName}
                    queryParams={link.queryParams}
                />
            ))}
        </div>
    );
}
