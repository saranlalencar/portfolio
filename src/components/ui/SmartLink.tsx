import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { isFilled } from '@/lib/placeholder'
import { Pending } from './Pending'

export type LinkKind = 'url' | 'email' | 'download'

interface SmartLinkProps {
  /** Valor cru vindo de src/data — pode ser uma URL real ou um placeholder. */
  value: string
  kind?: LinkKind
  className?: string
  /**
   * Classes do estado pendente. Quando informado, **substitui** `className` —
   * um botao preenchido nao deve continuar preenchido quando o link ainda nao
   * existe.
   */
  pendingClassName?: string
  children: ReactNode
  /** Conteudo alternativo no estado pendente. Padrao: o marcador de pendencia. */
  pendingContent?: ReactNode
  ariaLabel?: string
}

function buildHref(value: string, kind: LinkKind): string {
  if (kind === 'email') return `mailto:${value}`
  if (kind === 'download') return value
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

/**
 * Link que so vira <a> quando o dado ja foi preenchido.
 *
 * Enquanto o valor for um placeholder, renderiza um elemento inerte com
 * `aria-disabled` — assim o portfolio nunca publica um link quebrado nem um
 * "#" que nao leva a lugar nenhum.
 */
export function SmartLink({
  value,
  kind = 'url',
  className,
  pendingClassName,
  children,
  pendingContent,
  ariaLabel,
}: SmartLinkProps) {
  if (!isFilled(value)) {
    return (
      <span
        aria-disabled="true"
        className={cn('cursor-default', pendingClassName ?? className)}
        title="Link ainda não configurado (ver src/data/profile.ts)"
      >
        {pendingContent ?? <Pending value={value} />}
      </span>
    )
  }

  const isExternal = kind === 'url'

  return (
    <a
      href={buildHref(value, kind)}
      className={className}
      aria-label={ariaLabel}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(kind === 'download' ? { download: '' } : {})}
    >
      {children}
    </a>
  )
}
