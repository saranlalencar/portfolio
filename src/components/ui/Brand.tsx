import { useId } from 'react'
import { cn } from '@/lib/cn'
import { profile } from '@/data'
import { isFilled } from '@/lib/placeholder'

/**
 * Simbolo do portfolio: o cinturao de Orion — tres estrelas alinhadas, ligadas
 * por uma linha fina — dentro de uma moldura arredondada.
 *
 * E o mesmo motivo que aparece ao lado do nome, no hero e no rodape: a marca
 * fecha o sistema em vez de introduzir um desenho novo. Nao ha lua nem sol
 * aqui: a marca deixou de ser o interruptor de tema (isso agora e uma opcao
 * com nome, no menu), entao ela nao precisa mais indicar estado — precisa
 * apenas identificar.
 *
 * Composicao original, sem relacao com nenhuma marca existente.
 */
export function BrandMark({ className }: { className?: string }) {
  // O gradiente precisa de um id unico: a marca aparece mais de uma vez na pagina.
  const gradientId = useId()

  return (
    <svg viewBox="0 0 64 64" className={cn('size-9', className)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="10" y1="8" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-accent-strong)" />
          <stop offset="0.55" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-iris)" />
        </linearGradient>
      </defs>

      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="18"
        fill="var(--color-night-2)"
        stroke={`url(#${gradientId})`}
        strokeOpacity="0.5"
        strokeWidth="2.5"
      />

      {/* a linha que liga as tres estrelas — na diagonal do cinturao */}
      <path
        d="M20 43 44 21"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.55"
        fill="none"
      />

      {/* as tres estrelas: a do meio maior, como no ceu */}
      <circle cx="20" cy="43" r="3.4" fill={`url(#${gradientId})`} />
      <circle cx="32" cy="32" r="4.6" fill={`url(#${gradientId})`} />
      <circle cx="44" cy="21" r="3.4" fill={`url(#${gradientId})`} />

      {/* brilho ambar da estrela central, o unico ponto quente da marca */}
      <circle cx="32" cy="32" r="1.7" fill="var(--color-gold)" />
    </svg>
  )
}

/** Nome exibido na navbar e no rodape, com fallback claro enquanto pendente. */
export function brandName(): string {
  const short = profile.shortName?.trim()
  if (short && isFilled(short)) return short
  if (isFilled(profile.name)) return profile.name
  return 'Portfólio'
}

export function Brand({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark className={markClassName} />
      <span className="font-display text-[1.0625rem] font-semibold tracking-tight text-fg">{brandName()}</span>
    </span>
  )
}
