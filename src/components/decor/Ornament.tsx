import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

interface SectionAuraProps {
  /** Brilho roxo (padrao) ou frio periwinkle. */
  tone?: 'accent' | 'iris'
  /** Campo de estrelas discreto. */
  stars?: boolean
  className?: string
}

/**
 * Atmosfera de fundo de uma secao: pontos de ceu e um halo suave, sempre
 * roxo/periwinkle (Nebula Noturno) — nunca ambar aqui, isso fica so para os
 * filetes e o cinturao de Orion. Sempre atras do conteudo.
 *
 * Regra que guia a decoracao do site inteiro: ela nunca disputa espaco com o
 * conteudo — fica em `-z-10`, com opacidade baixa, `pointer-events-none` e
 * sempre fora da arvore acessivel.
 */
export function SectionAura({ tone = 'accent', stars = true, className }: SectionAuraProps) {
  const primary = tone === 'accent' ? 'var(--color-accent)' : 'var(--color-aura-cool)'
  const secondary = tone === 'accent' ? 'var(--color-aura-cool)' : 'var(--color-accent)'

  return (
    /*
      Sem `overflow-hidden` aqui, de proposito: o halo tem 64px de desfoque e,
      recortado pela borda da secao, deixava um corte reto — uma linha
      horizontal exatamente na emenda entre as telas. Deixando-o transbordar,
      o brilho atravessa a fronteira e costura uma secao na outra.
    */
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-10', className)}>
      {stars ? <div className="starmap mask-fade-radial absolute inset-0 opacity-50" /> : null}

      {/*
        Duas fontes de luz, nao uma: a principal (a cor pedida por `tone`) em
        cima, e uma segunda, complementar, no canto oposto. De noite a
        segunda e discreta o bastante para nao mudar a composicao atual; de
        dia e ela que da profundidade ao halo — uma mancha so, por mais forte
        que fosse, ainda lia como cor solida.
      */}
      <div
        className="glow left-1/2 top-[-8rem] size-[34rem] -translate-x-1/2"
        style={{ '--glow-color': primary } as CSSProperties}
      />
      <div
        className="glow glow--secondary right-[-8rem] bottom-[-10rem] size-[30rem]"
        style={{ '--glow-color': secondary } as CSSProperties}
      />
    </div>
  )
}
