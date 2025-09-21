import { Skeleton } from "../../components/ui/skeleton"
interface CircleSkeletonProps {
    readonly width: number;
    readonly height: number;
    readonly skeletonClassName?: string[];
}
export function CircleSkeleton({ height, width, skeletonClassName }: CircleSkeletonProps) {
    const skletonClassNames = skeletonClassName ? skeletonClassName.join(' ') : '';
    return (
        <Skeleton className={`w-${width} h-${height} ${skletonClassNames} rounded-full`} />
    )
}
