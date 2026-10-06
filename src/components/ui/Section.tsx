import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { PixelSprite, type SpriteName } from '@/components/decor/PixelSprite'
import { Reveal } from './Reveal'

/** Tom de fundo. A pagina alterna entre os dois para separar as secoes. */
type SectionTone = 'night' | 'night-2'

const TONES: Record<SectionTone, string> = {
  night: 'bg-night',
  'night-2': 'bg-night-2',
}

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  tone?: SectionTone
  /** Rotulo acessivel da <section> (usa o id do titulo visivel). */
  labelledBy?: string
}

export function Section({ id, children, className, tone = 'night', labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative isolate scroll-mt-24 py-20 sm:py-24 lg:py-32', TONES[tone], className)}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}

interface SectionHeadingProps {
  /** Numero de ordem exibido no rotulo, ex.: '02'. */
  index: string
  /** Rotulo curto do olho (eyebrow), ex.: 'Sobre'. */
  label: string
  /** Titulo do <h2>. Use `children` para um titulo com marcacao. */
  title?: string
  titleId?: string
  description?: string
  /** Pequeno sprite que acompanha o rotulo da secao. */
  sprite?: SpriteName
  className?: string
  children?: ReactNode
}

/**
 * Cabecalho de secao.
 *
 * O sprite pixelado ao lado do rotulo e o unico elemento "ludico" aqui: a
 * hierarquia continua sendo numero -> rotulo -> titulo serifado -> apoio.
 */
export function SectionHeading({
  index,
  label,
  title,
  titleId,
  description,
  sprite = 'estrela',
  className,
  children,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-2xl', className)}>
      <p className="eyebrow flex items-center gap-2.5">
        <PixelSprite name={sprite} size={11} className="shrink-0" />
        <span>
          {index}
          <span aria-hidden="true" className="mx-2 text-line-strong">
            /
          </span>
          {label}
        </span>
      </p>

      <h2 id={titleId} className="text-title mt-5 text-fg">
        {children ?? title}
      </h2>

      {description ? (
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted sm:text-base">{description}</p>
      ) : null}
    </Reveal>
  )
}
