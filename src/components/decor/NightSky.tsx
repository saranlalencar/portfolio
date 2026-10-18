import { useMemo } from 'react'
import { cn } from '@/lib/cn'

/**
 * Ceu noturno decorativo: campo de estrelas.
 *
 * As posicoes vem de um gerador pseudoaleatorio com semente fixa, e nao de
 * Math.random(): o resultado e sempre o mesmo em qualquer render, o que evita
 * que a composicao "pule" quando o React re-renderiza a secao.
 *
 * O brilho e uma animacao CSS lenta que nunca zera a opacidade — nada pisca —
 * e some por completo sob `prefers-reduced-motion` (ver .anim-twinkle).
 */

function mulberry32(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STAR_COLORS = [
  'var(--color-accent-strong)',
  'var(--color-accent-strong)',
  'var(--color-sand)',
  'var(--color-gold)',
]

interface Star {
  left: number
  top: number
  size: number
  opacity: number
  delay: number
  color: string
}

function buildStars(count: number, seed: number): Star[] {
  const random = mulberry32(seed)

  return Array.from({ length: count }, () => {
    const size = random() < 0.82 ? 1.5 : 2.5
    return {
      left: random() * 100,
      top: random() * 100,
      size,
      opacity: 0.25 + random() * 0.5,
      delay: random() * -6,
      color: STAR_COLORS[Math.floor(random() * STAR_COLORS.length)],
    }
  })
}

interface NightSkyProps {
  count?: number
  seed?: number
  className?: string
}

export function NightSky({ count = 42, seed = 20260818, className }: NightSkyProps) {
  const stars = useMemo(() => buildStars(count, seed), [count, seed])

  return (
    /* A classe `starfield` permite ao tema diurno apagar o campo de estrelas. */
    <div
      aria-hidden="true"
      className={cn('starfield pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {stars.map((star, index) => (
        <span
          key={index}
          className="anim-twinkle absolute rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
