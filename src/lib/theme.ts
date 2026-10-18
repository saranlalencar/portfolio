import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

/**
 * ============================================================================
 * TEMA — NOTURNO (padrao) E DIURNO
 * ============================================================================
 * O site inteiro troca de tema pela substituicao dos valores dos tokens de cor
 * (ver `:root[data-theme='light']` em styles/index.css). Nenhum componente
 * precisa saber qual tema esta ativo: `bg-night`, `text-fg`, `border-line` e
 * companhia continuam valendo nos dois.
 *
 * O estado vive fora do React, num store minimo lido por `useSyncExternalStore`.
 * Assim a lua do hero e o botao da navbar compartilham o mesmo estado sem
 * precisar de Context nem de prop drilling — e a preferencia e escrita no
 * <html> antes da primeira pintura (ver o script inline em index.html).
 */

export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'portfolio-tema'

/** Cor da barra do navegador em cada tema (espelha --color-night). */
const THEME_COLOR: Record<Theme, string> = {
  dark: '#0F0B1A',
  light: '#F1F0E2',
}

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    // localStorage pode estar bloqueado (modo privado, cookies desativados).
    return null
  }
}

/**
 * Tema inicial: escolha salva > noturno.
 *
 * Nao seguimos mais `prefers-color-scheme` do sistema: a identidade "Nebula
 * Noturno" (o campo de estrelas, o degrade roxo->periwinkle) so faz sentido
 * no escuro, e o tema claro ainda carrega paleta antiga ("Jardim Noturno")
 * nao migrada. Ate o claro ser redesenhado de verdade, todo mundo abre no
 * escuro por padrao — quem preferir claro troca manualmente pelo interruptor.
 */
function initialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  const attribute = document.documentElement.dataset.theme
  if (attribute === 'dark' || attribute === 'light') return attribute
  return readStored() ?? 'dark'
}

let current: Theme = initialTheme()
const listeners = new Set<() => void>()

function applyDom(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.head
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLOR[theme])
}

function commit(next: Theme) {
  current = next
  applyDom(next)
  listeners.forEach((listener) => listener())
}

/**
 * A troca de tema e cara: muda o valor de dezenas de tokens de cor, o que
 * obriga o navegador a repintar todos os gradientes, as camadas com
 * `filter: blur()` e as com `mix-blend-mode` — e ainda troca a personagem da
 * cena, montando e desmontando ~900 <rect>.
 *
 * Animar isso propriedade por propriedade (o que fazíamos antes, com
 * `transition` num seletor universal) fica pesado justamente porque cada
 * quadro da animacao repete esse trabalho todo.
 *
 * A API de View Transitions resolve de outro jeito: o navegador tira um
 * "retrato" da pagina antes e depois da mudanca e faz o cross-fade entre as
 * duas imagens, no compositor. O trabalho pesado acontece UMA vez, e a
 * transicao em si e so a fusao de dois bitmaps.
 *
 * Onde a API nao existe (Firefox, hoje), a troca acontece de uma vez — sem
 * transicao, mas tambem sem travada.
 */
export function setTheme(next: Theme) {
  if (next === current) return

  try {
    localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch {
    // Sem persistencia disponivel: o tema vale so para esta sessao.
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced || typeof document.startViewTransition !== 'function') {
    commit(next)
    return
  }

  /*
    `flushSync` e obrigatorio: o retrato do estado novo e tirado assim que o
    callback retorna. Sem ele o React ainda nao teria atualizado o DOM, e o
    navegador fotografaria a pagina antiga duas vezes.
  */
  document.startViewTransition(() => flushSync(() => commit(next)))
}

export function toggleTheme() {
  setTheme(current === 'dark' ? 'light' : 'dark')
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useTheme(): { theme: Theme; isDark: boolean; toggle: () => void } {
  const theme = useSyncExternalStore(
    subscribe,
    () => current,
    () => 'dark' as Theme,
  )

  return { theme, isDark: theme === 'dark', toggle: toggleTheme }
}
