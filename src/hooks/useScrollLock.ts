import { useEffect } from 'react'

/**
 * Trava o scroll do documento enquanto uma camada sobreposta esta aberta
 * (menu mobile / detalhe do projeto), compensando a largura da barra de
 * rolagem para o conteudo nao "pular" lateralmente.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [locked])
}
