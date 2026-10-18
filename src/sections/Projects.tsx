import { useMemo, useState } from 'react'
import { FILTER_THRESHOLD, projectCategoryLabels, projects } from '@/data'
import type { ProjectCategoryId } from '@/types/content'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'
import { ProjectFilters, type FilterOption } from '@/components/projects/ProjectFilters'
import { CardsToTech } from '@/components/projects/CardsToTech'

const ALL = 'todos'

/**
 * Secao de Projetos — entre Sobre e Tecnologias, na mesma rolagem. Todos os
 * projetos recebem o mesmo cartao (`ProjectShowcase`) — nenhum e "o
 * principal". O ULTIMO projeto da lista nao se repete: ele proprio, de
 * verdade (cartao real, funcional), e quem desempenha o papel do cartao de
 * transicao dentro de `CardsToTech` — encolhe, gira e vira uma das categorias
 * de Tecnologias, encadeando direto na secao seguinte.
 */
export function Projects({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [filter, setFilter] = useState<string>(ALL)

  /** Somente categorias que realmente possuem projetos viram filtro. */
  const options = useMemo<FilterOption[]>(() => {
    const counts = new Map<string, number>()
    for (const project of projects) {
      counts.set(project.category, (counts.get(project.category) ?? 0) + 1)
    }

    const ids = Object.keys(projectCategoryLabels) as ProjectCategoryId[]
    const used = ids
      .filter((id) => (counts.get(id) ?? 0) > 0)
      .map((id) => ({ id, label: projectCategoryLabels[id], count: counts.get(id) ?? 0 }))

    return [{ id: ALL, label: 'Todos', count: projects.length }, ...used]
  }, [])

  /**
   * O filtro so aparece quando ha projetos suficientes para justifica-lo e
   * mais de uma categoria em uso. Com dois projetos, ele seria ruido.
   */
  const showFilters = projects.length >= FILTER_THRESHOLD && options.length > 2

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  )

  /**
   * O ultimo projeto nao entra na pilha acima: ele e renderizado dentro de
   * `CardsToTech`, no fim da secao — primeiro do jeito normal, como qualquer
   * outro projeto, e so depois encolhendo ate virar cartao de tecnologia.
   * Assim ele aparece uma vez so. Usa a lista COMPLETA, nao a filtrada, para
   * nao trocar de projeto conforme o filtro muda.
   */
  const transitionProject = projects.at(-1)
  const stacked = visible.filter((project) => project !== transitionProject)

  return (
    <Section id="projetos" tone="night-2" labelledBy="projetos-titulo">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          title="Projetos & Desenvolvimento"
          titleId="projetos-titulo"
          description="Projetos acadêmicos, projetos que buscam soluções reais e projetos criados por pura curiosidade."
        />

        {showFilters ? (
          <Reveal delay={100}>
            <ProjectFilters options={options} active={filter} onChange={setFilter} />
          </Reveal>
        ) : null}
      </div>

      <div className="mt-12 space-y-6 lg:mt-16">
        {stacked.map((project, index) => (
          <Reveal key={project.slug} delay={index * 90}>
            <ProjectShowcase project={project} onOpen={onOpenProject} />
          </Reveal>
        ))}

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line-strong bg-night/40 p-8 text-center text-sm text-subtle">
            Nenhum projeto nesta categoria por enquanto.
          </p>
        ) : null}
      </div>

      {transitionProject ? (
        <div className="mt-6">
          <CardsToTech project={transitionProject} onOpenProject={onOpenProject} />
        </div>
      ) : null}
    </Section>
  )
}
