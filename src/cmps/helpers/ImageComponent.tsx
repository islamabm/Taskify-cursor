import React, { forwardRef, memo } from 'react';

type Classish = string | string[] | undefined;

const cn = (c: Classish) =>
    Array.isArray(c) ? c.filter(Boolean).join(' ') : (c ?? '');

interface ImageComponentProps {
    readonly src: string;
    readonly width: number | string;
    readonly height: number | string;
    readonly alt: string; // allow "" for decorative
    readonly imgClassName?: string | string[];
    readonly divClassName?: string | string[];
    readonly smallImageSrc?: string; // 1x
    readonly loading?: 'eager' | 'lazy';
    readonly decoding?: 'sync' | 'async' | 'auto';
    readonly onError?: React.ReactEventHandler<HTMLImageElement>;
    readonly fallbackSrc?: string;
}

export const ImageComponent = memo(forwardRef<HTMLImageElement, ImageComponentProps>(
    function ImageComponent(
        { src, width, height, alt, imgClassName, divClassName, smallImageSrc,
            loading = 'lazy', decoding = 'async', onError, fallbackSrc },
        ref
    ) {
        const divClassNames = cn(divClassName);
        const imgClassNames = cn(imgClassName);

        const style: React.CSSProperties = {
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
        };

        const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
            if (fallbackSrc) (e.currentTarget.src = fallbackSrc);
            if (process.env.NODE_ENV !== 'production') console.debug('Image load error:', src);
            onError?.(e);
        };

        return (
            <div className={`flex ${divClassNames}`} style={style}>
                <img
                    ref={ref}
                    loading={loading}
                    decoding={decoding}
                    src={src}
                    srcSet={smallImageSrc ? `${smallImageSrc} 1x, ${src} 2x` : undefined}
                    alt={alt}
                    className={`w-full h-full object-contain ${imgClassNames}`}
                    onError={handleError}
                />
            </div>
        );
    }));
