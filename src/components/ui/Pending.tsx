import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { isFilled, placeholderLabel } from '@/lib/placeholder'

const PENDING_TITLE = 'Conteúdo pendente de preenchimento'

/**
 * Aparencia padrao de um *botao* cujo destino ainda nao existe (currículo,
 * repositório, demonstração). Passe como `pendingClassName` do SmartLink: ele
 * substitui as classes do botao real, para que um botao preenchido nao continue
 * parecendo clicavel quando o link ainda esta pendente.
 */
export const pendingActionClasses =
  'meta inline-flex items-center gap-2 rounded-full border border-dashed border-line-strong bg-surface/40 px-5 py-2.5 text-subtle'

/**
 * Marcador de conteudo pendente.
 *
 * Nao depende apenas de cor para se distinguir: usa borda tracejada, fonte
 * monoespacada, o proprio texto entre colchetes e um `title` descritivo.
 */
export function Pending({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-dashed border-line-strong bg-surface/70 px-2 py-1 text-[0.7rem] font-medium leading-tight tracking-wide text-subtle',
        className,
      )}
      title={PENDING_TITLE}
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-subtle" />
      {placeholderLabel(value)}
      <span className="sr-only"> — {PENDING_TITLE}</span>
    </span>
  )
}

interface FieldProps {
  value: string
  as?: ElementType
  className?: string
  pendingClassName?: string
}

/** Renderiza o conteudo real ou, se ainda for placeholder, o marcador pendente. */
export function Field({ value, as: Tag = 'p', className, pendingClassName }: FieldProps) {
  if (isFilled(value)) return <Tag className={className}>{value}</Tag>
  return (
    <Tag className={className}>
      <Pending value={value} className={pendingClassName} />
    </Tag>
  )
}

interface FieldListProps {
  items: string[]
  className?: string
  itemClassName?: string
  /** Marcador exibido antes de cada item ja preenchido. */
  marker?: ReactNode
}

/** Lista em que cada item pode estar preenchido ou pendente. */
export function FieldList({ items, className, itemClassName, marker }: FieldListProps) {
  if (items.length === 0) return null
  return (
    <ul className={cn('space-y-2.5', className)}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className={cn('flex items-start gap-2.5 text-[0.9375rem]', itemClassName)}>
          {isFilled(item) ? (
            <>
              {marker ?? <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/70" />}
              <span className="text-muted">{item}</span>
            </>
          ) : (
            <Pending value={item} />
          )}
        </li>
      ))}
    </ul>
  )
}

/** Bloco maior para areas inteiras ainda sem conteudo (ex.: categoria vazia). */
export function PendingBlock({
  label,
  hint,
  className,
  icon,
}: {
  label: string
  hint?: string
  className?: string
  icon?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-2 rounded-2xl border border-dashed border-line-strong bg-night/40 p-4',
        className,
      )}
      title={PENDING_TITLE}
    >
      <span className="meta inline-flex items-center gap-2 text-subtle">
        {icon}
        {placeholderLabel(label)}
      </span>
      {hint ? <span className="text-[0.8125rem] leading-relaxed text-subtle/90">{hint}</span> : null}
    </div>
  )
}
