import { profile } from '@/data'
import { isFilled } from '@/lib/placeholder'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { BrandMark } from '@/components/ui/Brand'
import { Pending } from '@/components/ui/Pending'
import { PixelSprite } from '@/components/decor/PixelSprite'
import { SectionAura } from '@/components/decor/Ornament'

/** Fatos objetivos — todos verificaveis, nenhum inferido. */
const FACTS: Array<{ label: string; value: string }> = [
  { label: 'Formação', value: 'Ciência da Computação' },
  { label: 'Instituição', value: 'IFCE — Campus Maracanaú' },
  { label: 'Situação', value: 'Graduação em andamento' },
]

export function About() {
  return (
    <Section id="sobre" tone="night-2" labelledBy="sobre-titulo">
      <SectionAura tone="sage" constellation />

      <SectionHeading
        index="01"
        label="Sobre"
        title="Sobre mim"
        titleId="sobre-titulo"
        sprite="folha"
        description="Quem está por trás dos projetos e o que orienta as escolhas técnicas de cada um deles."
      />

      <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <Reveal className="space-y-5">
          {profile.bio.map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? 'text-lg leading-relaxed text-fg sm:text-xl sm:leading-relaxed'
                  : 'text-[0.9375rem] leading-relaxed text-muted sm:text-base'
              }
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal delay={120}>
          <div className="surface relative overflow-hidden p-6">
            <span aria-hidden="true" className="absolute right-5 top-5">
              <PixelSprite name="folha" size={18} opacity={0.5} />
            </span>

            <div className="relative flex items-center gap-4">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={isFilled(profile.name) ? `Foto de ${profile.name}` : 'Foto de perfil'}
                  width={72}
                  height={72}
                  loading="lazy"
                  decoding="async"
                  className="size-18 rounded-2xl border border-line object-cover"
                />
              ) : (
                <span className="flex size-18 items-center justify-center rounded-2xl border border-line bg-night">
                  <BrandMark className="size-10" />
                </span>
              )}

              <div className="min-w-0">
                {isFilled(profile.name) ? (
                  <p className="truncate font-display text-xl font-semibold text-fg">{profile.name}</p>
                ) : (
                  <Pending value={profile.name} />
                )}
                <p className="mt-1 text-sm text-muted">{profile.role}</p>
              </div>
            </div>

            <dl className="relative mt-6 space-y-4 border-t border-line pt-5">
              {FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <dt className="meta text-subtle">{fact.label}</dt>
                  <dd className="text-sm text-fg sm:text-right">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>

      <Reveal delay={80} className="mt-8 lg:mt-10">
        <div className="surface p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <PixelSprite name="broto" size={16} />
            <h3 className="text-lg text-fg">Atualmente estou explorando</h3>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Espaço reservado para os temas, tecnologias e áreas em estudo neste momento.
          </p>

          <ul className="mt-6 flex flex-wrap gap-3">
            {profile.currentlyExploring.map((item, index) => (
              <li key={index}>
                {isFilled(item) ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 text-sm text-fg transition-colors duration-400 hover:border-accent/45">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                    {item}
                  </span>
                ) : (
                  <Pending value={item} className="px-4 py-2" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
