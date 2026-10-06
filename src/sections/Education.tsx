import { education } from '@/data'
import { isFilled } from '@/lib/placeholder'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { FieldList, Pending } from '@/components/ui/Pending'
import { PixelSprite } from '@/components/decor/PixelSprite'
import { StarPatch } from '@/components/decor/Ornament'

export function Education() {
  return (
    <Section id="formacao" tone="night" labelledBy="formacao-titulo">
      <SectionHeading
        index="06"
        label="Formação"
        title="Formação"
        titleId="formacao-titulo"
        sprite="pinheiro"
        description="A base acadêmica em andamento e o espaço reservado para o que vier somar a ela."
      />

      <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <article className="surface relative h-full overflow-hidden p-6 sm:p-8">
            <StarPatch seed={5521} className="mask-fade-b" />

            <span aria-hidden="true" className="absolute right-6 top-6">
              <PixelSprite name="lua" size={20} opacity={0.6} />
            </span>

            <div className="relative">
              <span className="meta inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/12 px-3 py-1 text-accent-strong">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {education.status}
              </span>

              <h3 className="mt-5 font-display text-3xl font-semibold leading-tight text-fg sm:text-4xl">
                {education.course}
              </h3>
              <p className="mt-2 text-[0.9375rem] text-muted">{education.institution}</p>

              <dl className="mt-8 space-y-4 border-t border-line pt-6">
                {education.details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <dt className="meta text-subtle">{detail.label}</dt>
                    <dd className="text-sm text-fg sm:text-right">
                      {isFilled(detail.value) ? detail.value : <Pending value={detail.value} />}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </Reveal>

        <Reveal delay={110} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {education.groups.map((group) => (
            <section key={group.label} aria-label={group.label} className="surface p-6">
              <h3 className="meta text-accent">{group.label}</h3>
              <FieldList items={group.items} className="mt-4" />
            </section>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
