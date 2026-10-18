import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

/**
 * Tom de fundo.
 *
 * Os dois tons COMECAM E TERMINAM na mesma cor base (`--color-night`) — a
 * diferenca esta so no meio da secao (ver `.section-ground-swell` no CSS).
 * E de proposito: emenda entre secoes nunca pode aparecer como uma linha
 * horizontal, o site tem que ler como uma peca continua.
 */
type SectionTone = 'night' | 'night-2'

const TONES: Record<SectionTone, string> = {
  night: 'section-ground',
  'night-2': 'section-ground-swell',
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
      /*
        O respiro vertical de uma secao encosta no da seguinte: com `py-32`
        dos dois lados a emenda virava 256px CONTIGUOS sem nada na tela — e
        e exatamente isso que se le como "gap entre uma pagina e outra".
        Medido no pior ponto do desktop: 329px de tela vazia. Aqui o valor e
        por BORDA, entao o que importa e o dobro dele.
      */
      /*
        Sem `scroll-mt-*` aqui: a folga da navbar ja vem do
        `scroll-padding-top` do <html> (ver index.css). As duas SOMAM — o
        padding do contentor mais a margem do alvo — e a secao parava a
        192px do topo (96 + 96) em vez de 96, deixando uma faixa vazia
        acima do titulo a cada clique no menu. Uma folga so, num lugar so.
      */
      className={cn('relative isolate py-14 sm:py-16 lg:py-20', TONES[tone], className)}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}

interface SectionHeadingProps {
  /** Titulo do <h2>. Use `children` para um titulo com marcacao. */
  title?: string
  titleId?: string
  description?: string
  className?: string
  children?: ReactNode
}

/**
 * Cabecalho de secao: titulo em gradiente e, opcionalmente, uma linha de
 * apoio. Sem rotulo numerado antes do titulo — a numeracao ("01 / Sobre")
 * era ruido editorial em cima de cada tela.
 */
export function SectionHeading({ title, titleId, description, className, children }: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-2xl', className)}>
      <h2 id={titleId} className="text-title text-gradient">
        {children ?? title}
      </h2>

      {description ? (
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted sm:text-base">{description}</p>
      ) : null}
    </Reveal>
  )
}
