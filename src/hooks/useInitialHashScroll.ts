import { useEffect } from 'react'

/**
 * Rola ate a secao indicada na URL quando a pagina abre com uma ancora.
 *
 * O navegador tenta resolver a ancora durante o parse do HTML, quando o React
 * ainda nao renderizou nada — entao um link compartilhado como
 * "site.com/#projetos" cairia no topo da pagina. Aqui refazemos o salto depois
 * da primeira renderizacao, sem animacao (o usuario nao pediu uma rolagem, ele
 * pediu um destino).
 */
export function useInitialHashScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const id = window.location.hash.replace(/^#/, '')
    if (!id || id.includes('/')) return

    const element = document.getElementById(decodeURIComponent(id))
    if (!element) return

    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }, [enabled])
}
