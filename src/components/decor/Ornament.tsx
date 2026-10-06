import { cn } from '@/lib/cn'
import { Constellation, NightSky } from './NightSky'
import { PixelSprite, type SpriteName } from './PixelSprite'

/**
 * Ornamentos de secao.
 *
 * Regra que guia todos eles: decoracao nunca disputa espaco com o conteudo.
 * Ficam em `-z-10`, com opacidade baixa, `pointer-events-none` e sempre fora
 * da arvore acessivel.
 */

/** Filete horizontal com um pequeno sprite ao centro. */
export function Divider({ sprite = 'estrela', className }: { sprite?: SpriteName; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex items-center justify-center gap-4', className)}>
      <span className="hairline-x h-px flex-1" />
      <PixelSprite name={sprite} size={12} opacity={0.75} />
      <span className="hairline-x h-px flex-1" />
    </div>
  )
}

interface SectionAuraProps {
  /** Brilho esverdeado (padrao) ou frio azul-periwinkle. */
  tone?: 'sage' | 'iris'
  /** Campo de estrelas discreto. */
  stars?: boolean
  /** Constelacao no canto superior direito. */
  constellation?: boolean
  className?: string
}

/**
 * Atmosfera de fundo de uma secao: pontos de ceu, um halo suave e — quando
 * pedido — uma constelacao. Sempre atras do conteudo.
 */
export function SectionAura({ tone = 'sage', stars = true, constellation = false, className }: SectionAuraProps) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      {stars ? <div className="starmap mask-fade-radial absolute inset-0 opacity-50" /> : null}

      <div
        className={cn(
          'glow left-1/2 top-[-8rem] size-[34rem] -translate-x-1/2',
          tone === 'sage' ? 'bg-aura-warm/10' : 'bg-aura-cool/14',
        )}
      />

      {constellation ? (
        <Constellation className="absolute right-[6%] top-16 hidden w-40 opacity-70 lg:block" />
      ) : null}
    </div>
  )
}

/**
 * Faixa de estrelas usada em blocos menores (cartao de destaque, contato).
 * Recebe uma semente propria para que dois blocos na mesma tela nao repitam
 * exatamente o mesmo desenho.
 */
export function StarPatch({ seed, className }: { seed: number; className?: string }) {
  return <NightSky count={14} seed={seed} className={cn('opacity-70', className)} />
}
