import { Skeleton } from "../../components/ui/skeleton"
interface LineSkeletonProps {
    readonly width: number;
    readonly height: number;
}
export function LineSkeleton({ height, width }: LineSkeletonProps) {
    return (
        <Skeleton className={`h-${height} w-[${width}px]`} />
    )
}
