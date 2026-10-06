import { useId } from 'react'
import { cn } from '@/lib/cn'
import { profile } from '@/data'
import { isFilled } from '@/lib/placeholder'
import { useTheme } from '@/lib/theme'

/**
 * Simbolo do portfolio: um corpo celeste com uma pequena estrela, dentro de uma
 * moldura arredondada. Composicao original — nao deriva de nenhuma marca
 * existente.
 *
 * O corpo celeste acompanha o tema — lua a noite, sol de dia — porque a marca
 * TAMBEM e o interruptor de tema (ver `Navbar`). Assim ela indica o estado
 * atual alem de oferecer a acao.
 */
export function BrandMark({ className }: { className?: string }) {
  const { isDark } = useTheme()
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

      {isDark ? (
        /* lua crescente */
        <path d="M39 17a17 17 0 1 0 0 30 14 14 0 1 1 0-30Z" fill={`url(#${gradientId})`} fillOpacity="0.92" />
      ) : (
        /* sol: mesmo peso visual da lua, com raios curtos */
        <g fill={`url(#${gradientId})`} fillOpacity="0.92">
          <circle cx="35" cy="32" r="10" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <rect
              key={angle}
              x="34"
              y="15.5"
              width="2"
              height="5"
              rx="1"
              transform={`rotate(${angle} 35 32)`}
            />
          ))}
        </g>
      )}

      {/* estrela de quatro pontas */}
      <path
        d="M21.5 15c.7 4.6 1.2 5.1 5.8 5.8-4.6.7-5.1 1.2-5.8 5.8-.7-4.6-1.2-5.1-5.8-5.8 4.6-.7 5.1-1.2 5.8-5.8Z"
        fill="var(--color-gold)"
      />

      {/* semente luminosa */}
      <circle cx="20" cy="45" r="2" fill="var(--color-accent-strong)" fillOpacity="0.75" />
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
