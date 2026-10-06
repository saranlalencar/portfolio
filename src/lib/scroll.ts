/**
 * Rola ate uma secao respeitando `prefers-reduced-motion`.
 *
 * Precisamos do controle programatico (em vez de deixar o navegador seguir a
 * ancora) porque o menu mobile trava o scroll do body enquanto esta aberto:
 * fechamos o menu, esperamos o proximo quadro e so entao rolamos.
 */
export function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (!element) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
      window.history.replaceState(null, '', `#${id}`)
    })
  })
}
