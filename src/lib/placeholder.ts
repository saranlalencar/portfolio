/**
 * Deteccao de placeholders.
 *
 * Convencao unica do projeto: qualquer texto no formato `[ALGUMA COISA]` e
 * tratado como conteudo pendente. A interface o exibe com estilo tracejado e
 * um rotulo "pendente", nunca como conteudo final — e links pendentes nao
 * viram <a>, o que evita links quebrados no site publicado.
 */
const PLACEHOLDER_PATTERN = /^\s*\[[^\]]+\]\s*$/

/** `true` quando o valor esta vazio ou ainda e um placeholder. */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return true
  const trimmed = value.trim()
  if (trimmed.length === 0) return true
  return PLACEHOLDER_PATTERN.test(trimmed)
}

/** `true` quando o valor ja foi preenchido com conteudo real. */
export function isFilled(value: string | null | undefined): value is string {
  return !isPlaceholder(value)
}

/** Mantem apenas os itens ja preenchidos de uma lista. */
export function filledItems(items: readonly string[] | undefined): string[] {
  return (items ?? []).filter(isFilled)
}

/** `true` quando pelo menos um item da lista ja foi preenchido. */
export function hasFilledItem(items: readonly string[] | undefined): boolean {
  return filledItems(items).length > 0
}

/** Remove os colchetes para uso em atributos (title, aria-label...). */
export function placeholderLabel(value: string): string {
  return value.trim().replace(/^\[|\]$/g, '')
}
