import { useId, useMemo } from 'react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/lib/theme'

/**
 * Ceu noturno decorativo: campo de estrelas + pequenas constelacoes.
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

/**
 * Faixas de nuvem.
 *
 * A referencia do lago noturno e quase toda ceu carregado: nuvens alongadas,
 * periwinkle, com as mais proximas da lua iluminadas de ambar. Sao elipses
 * borradas com posicao fixa — nada aqui e aleatorio.
 *
 * Usam os tokens de atmosfera, entao acompanham o tema: periwinkle e ambar a
 * noite, azul de ceu e luz de sol no modo diurno.
 */
const CLOUDS: Array<{
  left: number
  top: number
  width: number
  height: number
  opacity: number
  warm?: boolean
  delay: number
}> = [
  { left: -8, top: 4, width: 52, height: 16, opacity: 0.26, delay: 0 },
  { left: 34, top: 1, width: 44, height: 12, opacity: 0.2, warm: true, delay: -22 },
  { left: 56, top: 13, width: 58, height: 18, opacity: 0.28, delay: -46 },
  { left: 2, top: 24, width: 44, height: 11, opacity: 0.18, delay: -12 },
  { left: 22, top: 36, width: 66, height: 14, opacity: 0.14, delay: -60 },
  { left: 68, top: 31, width: 38, height: 10, opacity: 0.22, warm: true, delay: -34 },
  { left: 12, top: 46, width: 50, height: 10, opacity: 0.1, delay: -70 },
]

export function CloudBands({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {CLOUDS.map((cloud, index) => (
        <span
          key={index}
          className={cn('cloud', cloud.warm ? 'bg-aura-warm' : 'bg-aura-cool')}
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            width: `${cloud.width}%`,
            height: `${cloud.height}%`,
            opacity: cloud.opacity,
            animationDelay: `${cloud.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Constelacao abstrata: pontos ligados por linhas finissimas.
 * O desenho e inventado — nao reproduz nenhuma constelacao real nem simbolo
 * de terceiros.
 */
const CONSTELLATION_POINTS: Array<[number, number]> = [
  [8, 46],
  [30, 22],
  [52, 40],
  [74, 16],
  [88, 52],
  [58, 72],
]

export function Constellation({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 88"
      className={cn('pointer-events-none', className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <polyline
        points={CONSTELLATION_POINTS.map(([x, y]) => `${x},${y}`).join(' ')}
        stroke="var(--color-gold)"
        strokeOpacity="0.28"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {CONSTELLATION_POINTS.map(([x, y], index) => (
        <circle
          key={index}
          cx={x}
          cy={y}
          r={index % 3 === 0 ? 1.7 : 1.1}
          fill={index % 3 === 0 ? 'var(--color-sand)' : 'var(--color-gold)'}
          fillOpacity={index % 3 === 0 ? 0.85 : 0.6}
        />
      ))}
    </svg>
  )
}

/**
 * Lua: circulo com gradiente frio e um leve halo.
 * Desenhada em SVG (sem imagem) para nao custar requisicao nem bytes de rede.
 */
export function Moon({ className, size = 128 }: { className?: string; size?: number }) {
  const id = useId()

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('pointer-events-none', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Lua quente, como a da referencia do lago: nucleo creme, borda ambar. */}
        <radialGradient id={`${id}-body`} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor="var(--color-cream)" />
          <stop offset="52%" stopColor="var(--color-sand)" />
          <stop offset="100%" stopColor="var(--color-gold)" />
        </radialGradient>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="30%" stopColor="var(--color-aura-warm)" stopOpacity="0.3" />
          <stop offset="70%" stopColor="var(--color-aura-cool)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-aura-cool)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill={`url(#${id}-halo)`} />
      <circle cx="50" cy="50" r="26" fill={`url(#${id}-body)`} fillOpacity="0.95" />

      {/* crateras discretas */}
      <circle cx="42" cy="43" r="4.5" fill="var(--color-indigo)" fillOpacity="0.16" />
      <circle cx="58" cy="55" r="3" fill="var(--color-indigo)" fillOpacity="0.13" />
      <circle cx="49" cy="62" r="2" fill="var(--color-indigo)" fillOpacity="0.12" />
    </svg>
  )
}

/**
 * Sol: o correspondente diurno da lua, no mesmo tamanho e na mesma posicao.
 * Os raios sao curtos e assimetricos — desenho proprio, sem o "sol de escola"
 * de raios iguais em volta.
 */
export function Sun({ className, size = 128 }: { className?: string; size?: number }) {
  const id = useId()
  const rays = [0, 45, 90, 135, 180, 225, 270, 315]

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('pointer-events-none', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-body`} cx="40%" cy="36%" r="70%">
          <stop offset="0%" stopColor="var(--color-cream)" />
          <stop offset="45%" stopColor="var(--color-aura-warm)" />
          <stop offset="100%" stopColor="var(--color-gold)" />
        </radialGradient>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="40%" stopColor="var(--color-aura-warm)" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--color-aura-warm)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="49" fill={`url(#${id}-halo)`} />

      {rays.map((angle, index) => (
        <line
          key={angle}
          x1="50"
          y1="50"
          x2="50"
          y2={index % 2 === 0 ? 12 : 17}
          stroke="var(--color-gold)"
          strokeOpacity={index % 2 === 0 ? 0.7 : 0.45}
          strokeWidth="2.4"
          strokeLinecap="round"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}

      <circle cx="50" cy="50" r="24" fill={`url(#${id}-body)`} />
    </svg>
  )
}

/**
 * Corpo celeste do tema atual: lua a noite, sol de dia.
 * Usado tanto na decoracao quanto no botao que troca o tema.
 */
export function CelestialBody(props: { className?: string; size?: number }) {
  const { isDark } = useTheme()
  return isDark ? <Moon {...props} /> : <Sun {...props} />
}
