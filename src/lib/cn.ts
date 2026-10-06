/** Junta classes ignorando valores falsy. Evita uma dependencia so para isso. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
