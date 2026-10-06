import type { Project } from '@/types/content'
import { isFilled } from '@/lib/placeholder'
import { BadgeList } from '@/components/ui/Badge'
import { ArrowRight } from '@/components/ui/Icons'
import { Field, Pending } from '@/components/ui/Pending'
import { StatusPill } from '@/components/ui/StatusPill'

/**
 * Cartao padrao de projeto.
 *
 * O titulo e um <button> com pseudo-elemento esticado (after:inset-0): o
 * cartao inteiro fica clicavel sem aninhar elementos interativos, e o nome
 * acessivel do controle continua sendo o titulo do projeto.
 */
export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  return (
    <article className="group surface surface-interactive edge-light relative flex h-full flex-col overflow-hidden p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        {isFilled(project.categoryLabel) ? (
          <span className="meta text-subtle">
            {project.categoryLabel}
          </span>
        ) : (
          <Pending value={project.categoryLabel} />
        )}
        <StatusPill status={project.status} />
      </div>

      <h3 className="mt-4 font-display text-2xl font-semibold leading-snug text-fg">
        <button
          type="button"
          onClick={() => onOpen(project.slug)}
          className="text-left transition-colors duration-400 after:absolute after:inset-0 hover:text-accent-strong"
        >
          {project.title}
        </button>
      </h3>

      <Field value={project.summary} as="p" className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted" />

      <BadgeList items={project.technologies} className="mt-5" />

      <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
        Ver detalhes
        <ArrowRight
          width={16}
          height={16}
          aria-hidden="true"
          className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"
        />
      </p>
    </article>
  )
}
