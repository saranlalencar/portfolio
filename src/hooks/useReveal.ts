import { useEffect, useRef, useState } from 'react'

/**
 * Revela um elemento quando ele entra na viewport, uma unica vez.
 *
 * Usa IntersectionObserver (nativo, sem dependencia externa) e desconecta apos
 * a primeira intersecao — nenhum listener de scroll fica ativo depois disso.
 * Se o navegador nao suportar a API, o conteudo aparece imediatamente.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [visible])

  return { ref, visible }
}
