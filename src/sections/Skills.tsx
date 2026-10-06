import { skillCategories } from '@/data'
import { isFilled } from '@/lib/placeholder'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { PendingBlock } from '@/components/ui/Pending'
import { PixelSprite, type SpriteName } from '@/components/decor/PixelSprite'

/** Um sprite por categoria — detalhe de personalidade, nunca um icone de sistema. */
const CATEGORY_SPRITE: Record<string, SpriteName> = {
  frontend: 'flor',
  backend: 'pinheiro',
  'banco-de-dados': 'semente',
  ferramentas: 'folha',
  outros: 'estrela',
}

export function Skills() {
  return (
    <Section id="tecnologias" tone="night" labelledBy="tecnologias-titulo">
      <SectionHeading
        index="04"
        label="Tecnologias"
        title="Tecnologias"
        titleId="tecnologias-titulo"
        sprite="folha"
        description="Ferramentas organizadas por finalidade, e não por nível de domínio: barras de porcentagem transmitem uma precisão que não existe."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {skillCategories.map((category, index) => (
          <Reveal key={category.id} delay={index * 70}>
            <section aria-label={category.label} className="surface surface-interactive group flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg text-fg">{category.label}</h3>
                  {category.hint ? <p className="mt-1 text-sm text-muted">{category.hint}</p> : null}
                </div>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-safe:group-hover:-translate-y-1"
                >
                  <PixelSprite name={CATEGORY_SPRITE[category.id] ?? 'estrela'} size={18} opacity={0.7} />
                </span>
              </div>

              <div className="mt-6 flex-1">
                {category.items.length === 0 ? (
                  <PendingBlock
                    label="[ADICIONAR TECNOLOGIAS]"
                    hint="Edite src/data/skills.ts para listar as tecnologias desta categoria."
                  />
                ) : (
                  <ul className="space-y-3">
                    {category.items.map((skill, skillIndex) => (
                      <li
                        key={skillIndex}
                        className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line pb-3 last:border-b-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <span className="flex items-center gap-2 text-[0.9375rem] text-fg">
                            {skill.icon ? (
                              <img src={skill.icon} alt="" width={16} height={16} loading="lazy" aria-hidden="true" />
                            ) : null}
                            {skill.name}
                          </span>
                          {skill.description && isFilled(skill.description) ? (
                            <span className="mt-0.5 block text-xs leading-relaxed text-subtle">
                              {skill.description}
                            </span>
                          ) : null}
                        </div>
                        {skill.level ? (
                          <span className="meta shrink-0 rounded-full border border-line bg-surface/70 px-2.5 py-0.5 text-accent">
                            {skill.level}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
