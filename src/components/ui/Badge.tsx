import { cn } from '@/lib/utils'

type BadgeVariant = 'promo' | 'nouveau' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  label?: string
  /** Discount percentage (for promo variant). Pass e.g. 20 → shows "-20%" */
  discount?: number
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  promo:
    'bg-black text-white',
  nouveau:
    'bg-white text-black border border-black',
  default:
    'bg-gray-100 text-gray-700',
}

export default function Badge({
  variant = 'default',
  label,
  discount,
  className,
}: BadgeProps) {
  let text = label

  if (variant === 'promo' && discount !== undefined && !label) {
    text = `-${discount}%`
  } else if (variant === 'nouveau' && !label) {
    text = 'Nouveau'
  }

  if (!text) return null

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'text-[10px] font-semibold tracking-widest uppercase',
        'px-2 py-0.5 leading-none',
        variantStyles[variant],
        className
      )}
    >
      {text}
    </span>
  )
}
