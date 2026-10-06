import { useEffect, useState } from 'react'

/**
 * Retorna o id da secao atualmente em foco na viewport, para o indicador da
 * navbar. Observa uma faixa horizontal no meio da tela, o que evita que o
 * indicador fique piscando entre duas secoes durante o scroll.
 */
export function useActiveSection(ids: string[], enabled = true): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!enabled || ids.length === 0 || typeof IntersectionObserver === 'undefined') return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const { id } = entry.target
          if (entry.isIntersecting) visible.add(id)
          else visible.delete(id)
        }
        // Em caso de empate, vence a secao que vem antes na ordem da pagina.
        const next = ids.find((id) => visible.has(id))
        if (next) setActiveId(next)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids, enabled])

  return activeId
}
