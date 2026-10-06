import { cn } from '@/lib/cn'
import { isFilled } from '@/lib/placeholder'
import { Pending } from './Pending'

/**
 * Etiqueta usada para tecnologias e rotulos curtos.
 * Se o valor ainda for placeholder, cai para o marcador de pendencia.
 */
export function Badge({ value, className }: { value: string; className?: string }) {
  if (!isFilled(value)) return <Pending value={value} />

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-line bg-surface/80 px-3 py-1 text-[0.75rem] font-medium tracking-wide text-muted transition-colors duration-400 hover:border-accent/45 hover:text-accent-strong',
        className,
      )}
    >
      {value}
    </span>
  )
}

export function BadgeList({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>
          <Badge value={item} />
        </li>
      ))}
    </ul>
  )
}
