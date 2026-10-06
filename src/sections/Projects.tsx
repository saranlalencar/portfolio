import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import { FILTER_THRESHOLD, projectCategoryLabels, projects } from '@/data'
import type { ProjectCategoryId } from '@/types/content'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { FeaturedProject } from '@/components/projects/FeaturedProject'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilters, type FilterOption } from '@/components/projects/ProjectFilters'

const ALL = 'todos'

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

  const featured = visible.find((project) => project.featured)
  const others = visible.filter((project) => project !== featured)

  return (
    <Section id="projetos" tone="night-2" labelledBy="projetos-titulo">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index="03"
          label="Projetos"
          title="Projetos & Desenvolvimento"
          titleId="projetos-titulo"
          sprite="pinheiro"
          description="Projetos acadêmicos, projetos que buscam soluções reais e projetos criados por pura curiosidade."
        />

        {showFilters ? (
          <Reveal delay={100}>
            <ProjectFilters options={options} active={filter} onChange={setFilter} />
          </Reveal>
        ) : null}
      </div>

      <div className="mt-12 space-y-6 lg:mt-16">
        {featured ? (
          <Reveal>
            <FeaturedProject project={featured} onOpen={onOpenProject} />
          </Reveal>
        ) : null}

        {others.length > 0 ? (
          /* Com um unico projeto secundario, a grade de 2 colunas deixaria
             metade da linha vazia — nesse caso ele ocupa a largura toda. */
          <div className={cn('grid gap-6', others.length > 1 && 'sm:grid-cols-2')}>
            {others.map((project, index) => (
              <Reveal key={project.slug} delay={index * 90}>
                <ProjectCard project={project} onOpen={onOpenProject} />
              </Reveal>
            ))}
          </div>
        ) : null}

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line-strong bg-night/40 p-8 text-center text-sm text-subtle">
            Nenhum projeto nesta categoria por enquanto.
          </p>
        ) : null}
      </div>
    </Section>
  )
}
