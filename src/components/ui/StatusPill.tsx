import { cn } from '@/lib/cn'
import { projectStatusLabels } from '@/data'
import type { ProjectStatus } from '@/types/content'

/**
 * Selo de status do projeto.
 * A informacao nunca depende so da cor: o rotulo textual sempre acompanha o
 * indicador, e o formato do marcador muda por status.
 */
const STYLES: Record<ProjectStatus, { wrapper: string; dot: string; solid: boolean }> = {
  'em-desenvolvimento': {
    wrapper: 'border-gold/35 bg-gold/10 text-gold',
    dot: 'border-gold',
    solid: false,
  },
  concluido: {
    wrapper: 'border-leaf/35 bg-leaf/12 text-leaf',
    dot: 'bg-leaf border-leaf',
    solid: true,
  },
  planejado: {
    wrapper: 'border-line-strong bg-surface/70 text-subtle',
    dot: 'border-subtle border-dashed',
    solid: false,
  },
  pausado: {
    wrapper: 'border-line-strong bg-surface/70 text-muted',
    dot: 'border-muted',
    solid: false,
  },
}

export function StatusPill({ status, className }: { status: ProjectStatus; className?: string }) {
  const style = STYLES[status]

  return (
    <span
      className={cn(
        'meta inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1',
        style.wrapper,
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-2 rounded-full border', style.dot)} />
      {projectStatusLabels[status]}
    </span>
  )
}
