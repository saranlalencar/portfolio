import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = '#projeto/'

function parseHash(hash: string): string | null {
  if (!hash.startsWith(PREFIX)) return null
  const slug = decodeURIComponent(hash.slice(PREFIX.length)).trim()
  return slug.length > 0 ? slug : null
}

/**
 * Roteamento minimo por hash para o detalhe do projeto (`#projeto/<slug>`).
 *
 * Evita uma biblioteca de rotas inteira e mantem o site 100% estatico: o link
 * de um projeto pode ser compartilhado, o botao "voltar" do navegador fecha o
 * detalhe e nenhuma configuracao de rewrite e necessaria no deploy.
 */
export function useProjectRoute() {
  const [slug, setSlug] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : parseHash(window.location.hash),
  )
  /** Marca se fomos nos que empilhamos a entrada no historico. */
  const pushedByApp = useRef(false)

  useEffect(() => {
    const handleHashChange = () => setSlug(parseHash(window.location.hash))
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const open = useCallback((nextSlug: string) => {
    pushedByApp.current = true
    window.location.hash = `${PREFIX}${encodeURIComponent(nextSlug)}`
  }, [])

  const close = useCallback(() => {
    if (pushedByApp.current) {
      pushedByApp.current = false
      window.history.back()
      return
    }
    // Acesso direto pelo link: limpamos a hash sem empilhar historico.
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    setSlug(null)
  }, [])

  return { slug, open, close }
}
