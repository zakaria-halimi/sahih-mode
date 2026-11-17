import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import LoadingSpinner from './LoadingSpinner'

type Variant = 'primary' | 'secondary' | 'whatsapp' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-black text-white hover:bg-gray-800 active:scale-95 disabled:bg-gray-300 disabled:text-gray-500',
  secondary:
    'border border-black text-black bg-transparent hover:bg-black hover:text-white active:scale-95 disabled:border-gray-300 disabled:text-gray-400',
  whatsapp:
    'bg-black text-white hover:bg-gray-900 active:scale-95 disabled:bg-gray-300 disabled:text-gray-500',
  ghost:
    'bg-transparent text-black hover:bg-gray-100 active:scale-95 disabled:text-gray-400',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-5 py-2 text-xs tracking-[0.12em]',
  md: 'px-8 py-3 text-sm tracking-widest',
  lg: 'px-10 py-4 text-sm tracking-widest',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // base
          'inline-flex items-center justify-center gap-2',
          'font-medium uppercase font-sans',
          'transition-all duration-200',
          'select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:active:scale-100',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <LoadingSpinner
            size="sm"
            inverted={variant === 'primary' || variant === 'whatsapp'}
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
