import { cn } from '@/lib/utils'

/* ─── Base skeleton block ─────────────────────────────────────────────── */

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-none bg-gray-100',
        className
      )}
      aria-hidden="true"
    />
  )
}

/* ─── Product card skeleton ───────────────────────────────────────────── */

export function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col gap-3" aria-hidden="true">
      {/* Image area */}
      <Skeleton className="w-full aspect-[3/4]" />
      {/* Category */}
      <Skeleton className="h-3 w-20" />
      {/* Name */}
      <Skeleton className="h-5 w-3/4" />
      {/* Price */}
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

/* ─── Text-line skeletons ─────────────────────────────────────────────── */

export function TextSkeleton({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export default Skeleton
