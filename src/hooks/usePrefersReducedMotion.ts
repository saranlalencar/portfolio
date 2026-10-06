import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * `true` quando o sistema pede menos movimento.
 *
 * O CSS ja neutraliza transicoes e animacoes sozinho; este hook existe para os
 * casos que so o CSS nao resolve — por exemplo, um video em laco, que precisa
 * deixar de iniciar sozinho e ganhar controles.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(QUERY)
    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches)

    setReduced(query.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return reduced
}
