import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium transition-all duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-safe:hover:-translate-y-0.5'

const VARIANTS: Record<ButtonVariant, string> = {
  // Verde principal sobre texto noturno: 5,9:1 de contraste.
  primary:
    'bg-accent text-night font-semibold hover:bg-accent-strong hover:shadow-[0_14px_44px_-16px_rgba(143,196,106,0.7)]',
  secondary:
    'border border-line-strong bg-surface/60 text-fg hover:border-accent/60 hover:bg-surface-2/70 hover:text-accent-strong',
  ghost: 'text-muted hover:text-accent-strong',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm sm:text-[0.9375rem]',
  lg: 'px-6 py-3 text-[0.9375rem] sm:text-base',
}

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className)
}

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function Button({ variant = 'primary', size = 'md', className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}

type LinkButtonProps = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>

export function LinkButton({ variant = 'primary', size = 'md', className, children, ...rest }: LinkButtonProps) {
  return (
    <a className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </a>
  )
}
