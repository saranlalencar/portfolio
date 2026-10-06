import { processSteps } from '@/data'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { PixelSprite, type SpriteName } from '@/components/decor/PixelSprite'
import { SectionAura } from '@/components/decor/Ornament'

/**
 * "Como construo" — o percurso do problema ate a solucao em funcionamento.
 *
 * A composicao imita um pequeno caminho: uma trilha pontilhada continua liga
 * as seis etapas, e alguns elementos naturais aparecem ao longo dela. A
 * progressao tambem e sugerida pelo escalonamento da animacao de entrada —
 * nada anima em laco, o que manteria o olho preso na decoracao.
 */

/** Vegetacao pontual ao longo da trilha (indice da etapa -> sprite). */
const TRAIL_SPRITES: Record<number, SpriteName> = {
  0: 'semente',
  2: 'broto',
  4: 'folha',
  5: 'flor',
}

export function Process() {
  return (
    <Section id="processo" tone="night-2" labelledBy="processo-titulo">
      <SectionAura tone="iris" stars={false} />

      <SectionHeading
        index="05"
        label="Processo"
        title="Como construo"
        titleId="processo-titulo"
        sprite="semente"
        description="Escrever código é a quarta etapa, não a primeira. Este é o caminho que percorro do problema até a solução em funcionamento."
      />

      <ol className="relative mt-12 max-w-3xl lg:mt-16">
        <span
          aria-hidden="true"
          className="absolute bottom-10 left-[1.4375rem] top-6 w-px sm:left-[1.6875rem]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, var(--color-line-strong) 0 3px, transparent 3px 9px)',
          }}
        />

        {processSteps.map((step, index) => {
          const sprite = TRAIL_SPRITES[index]

          return (
            <Reveal as="li" key={step.index} delay={index * 90} className="relative pb-9 pl-16 last:pb-0 sm:pl-20">
              {/* marcador da etapa: numeral serifado dentro de um circulo */}
              <span
                aria-hidden="true"
                className="numeral absolute left-0 top-0 flex size-12 items-center justify-center rounded-full border border-line bg-surface font-display text-lg font-semibold text-accent sm:size-14 sm:text-xl"
              >
                {step.index}
              </span>

              {sprite ? (
                <span
                  aria-hidden="true"
                  className="anim-sway absolute left-[3.25rem] top-1 hidden sm:block"
                  style={{ animationDelay: `${index * -1.7}s` }}
                >
                  <PixelSprite name={sprite} size={13} opacity={0.6} />
                </span>
              ) : null}

              <div className="pt-1.5 sm:pt-2.5">
                <h3 className="text-lg text-fg sm:text-xl">{step.title}</h3>
                <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-muted">{step.description}</p>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
