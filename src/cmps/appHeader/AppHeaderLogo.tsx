import { memo } from 'react';
import { ImageComponent } from '../helpers/ImageComponent';

type Props = Readonly<{
    readonly src?: string;
    readonly size?: number;
    readonly alt?: string;
    readonly className?: string;
    readonly asLinkTo?: string; // e.g., "/"
    readonly fallbackSrc?: string;
}>;

export const AppHeaderLogo = memo(function AppHeaderLogo({
    src = 'https://haatdaas.lan-wan.net/daas/images/drLogo.png',
    size = 80,
    alt = 'Haat Delivery logo',
    className = '',
    asLinkTo,
    fallbackSrc = '/logo-fallback.svg',
}: Props) {
    const wrapperClass = `flex items-center shrink-0 ${className}`;
    const imgClass = 'rounded-full';

    const img = (
        <ImageComponent
            src={src}
            width={size}
            height={size}
            alt={alt}
            imgClassName={imgClass}
            divClassName={wrapperClass}
            loading="eager"
            decoding="async"
            onError={(e: any) => (e.currentTarget.src = fallbackSrc)}
        />
    );
    return asLinkTo ? (
        <a href={asLinkTo} aria-label="Home" className={wrapperClass}>
            {img}
        </a>
    ) : (
        img
    );
});

