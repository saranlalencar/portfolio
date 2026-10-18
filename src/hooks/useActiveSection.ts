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
        /*
          Em caso de empate, vence a ULTIMA na ordem da pagina.

          Importa porque nem toda ancora e uma secao irma das outras:
          `#tecnologias` fica DENTRO de `#projetos` (ela marca o trecho da
          rolagem em que a transicao ja virou cartoes de tecnologia). As duas
          cruzam a faixa central ao mesmo tempo, e a de dentro — a mais
          especifica, que vem depois na pagina — e a resposta certa. Entre
          secoes irmas o empate so acontece na fronteira, e ali preferir a
          seguinte e justamente o que se espera ao descer a pagina.
        */
        let next = ''
        for (const id of ids) if (visible.has(id)) next = id
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
