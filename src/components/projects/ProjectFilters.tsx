import { cn } from '@/lib/cn'

export interface FilterOption {
  id: string
  label: string
  count: number
}

/**
 * Filtros de projeto.
 *
 * A secao so renderiza este componente quando ha projetos suficientes para
 * justifica-lo, e apenas com as categorias que realmente possuem projetos —
 * nada de filtros que devolvem uma lista vazia.
 */
export function ProjectFilters({
  options,
  active,
  onChange,
}: {
  options: FilterOption[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div role="group" aria-label="Filtrar projetos por categoria" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.id === active
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300',
              isActive
                ? 'border-accent/55 bg-accent/12 text-accent-strong'
                : 'border-line bg-surface/50 text-muted hover:border-line-strong hover:text-fg',
            )}
          >
            {option.label}
            <span className={cn('text-[0.7rem] font-medium', isActive ? 'text-accent' : 'text-subtle')}>
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
