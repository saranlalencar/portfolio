import { journey } from '@/data'
import { cn } from '@/lib/cn'
import { isFilled } from '@/lib/placeholder'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Field, Pending } from '@/components/ui/Pending'
import { PixelSprite, type SpriteName } from '@/components/decor/PixelSprite'
import type { JourneyState } from '@/types/content'

const MARKER: Record<JourneyState, string> = {
  atual: 'border-accent bg-accent/25 ring-4 ring-accent/10',
  concluido: 'border-accent bg-accent',
  planejado: 'border-dashed border-subtle bg-night',
}

/** Cada etapa ganha um sprite proprio — a metafora do crescimento. */
const SPRITE: Record<JourneyState, SpriteName> = {
  atual: 'broto',
  concluido: 'folha',
  planejado: 'semente',
}

export function Journey() {
  return (
    <Section id="trajetoria" tone="night" labelledBy="trajetoria-titulo">
      <SectionHeading
        index="02"
        label="Trajetória"
        title="Minha trajetória"
        titleId="trajetoria-titulo"
        sprite="broto"
        description="Uma linha do tempo em construção: cada etapa registra o que foi estudado, praticado e entregue ao longo do caminho."
      />

      <ol className="relative mt-12 lg:mt-16">
        {/*
          Trilha pontilhada em vez de uma barra continua: o traco irregular
          conversa com o restante da identidade sem roubar atencao do texto.
        */}
        <span
          aria-hidden="true"
          className="absolute bottom-8 left-[0.4375rem] top-4 w-px"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, var(--color-line-strong) 0 3px, transparent 3px 9px)',
          }}
        />

        {journey.map((entry, index) => (
          <Reveal as="li" key={entry.id} delay={index * 90} className="relative pb-11 pl-10 last:pb-0 sm:pl-12">
            <span
              aria-hidden="true"
              className={cn('absolute left-0 top-2.5 size-3.5 rounded-full border-2', MARKER[entry.state])}
            />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="meta inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-accent">
                <PixelSprite name={SPRITE[entry.state]} size={10} />
                {entry.kind}
              </span>
              {isFilled(entry.period) ? (
                <span className="text-xs font-medium tracking-wide text-subtle">{entry.period}</span>
              ) : (
                <Pending value={entry.period} />
              )}
            </div>

            <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-fg sm:text-[1.75rem]">
              {isFilled(entry.title) ? entry.title : <Pending value={entry.title} className="text-sm" />}
            </h3>

            {entry.subtitle ? <Field value={entry.subtitle} as="p" className="mt-1.5 text-sm text-muted" /> : null}

            <Field
              value={entry.description}
              as="p"
              className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted"
            />
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
