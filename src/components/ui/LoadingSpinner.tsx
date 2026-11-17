import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Optionally invert colour for use on dark backgrounds */
  inverted?: boolean
}

const sizeMap = {
  sm: 'w-4 h-4 border-[1.5px]',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
}

export default function LoadingSpinner({
  size = 'md',
  className,
  inverted = false,
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Chargement…"
      className={cn(
        'inline-block rounded-full animate-spin',
        sizeMap[size],
        inverted
          ? 'border-white/30 border-t-white'
          : 'border-black/20 border-t-black',
        className
      )}
    />
  )
}
