import { createElement, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  children: ReactNode
  /** Elemento renderizado. Padrao: 'div'. */
  as?: ElementType
  /** Atraso em ms, para escalonar itens de uma lista. */
  delay?: number
  className?: string
  style?: CSSProperties
}

/**
 * Animacao de entrada ao entrar na viewport (fade + slide-up).
 * O CSS da classe `.reveal` e neutralizado por `prefers-reduced-motion`,
 * entao o conteudo aparece imediatamente para quem prefere menos movimento.
 */
export function Reveal({ children, as = 'div', delay = 0, className, style }: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>()

  return createElement(
    as,
    {
      ref,
      'data-visible': visible,
      className: cn('reveal', className),
      style: { ...style, '--reveal-delay': `${delay}ms` } as CSSProperties,
    },
    children,
  )
}
