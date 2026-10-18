import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { cn } from '@/lib/cn'
import { scrollToSection } from '@/lib/scroll'
import { useTheme } from '@/lib/theme'
import { navItems } from '@/data'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useScrolled } from '@/hooks/useScrolled'
import { BrandMark, brandName } from '@/components/ui/Brand'
import { Close, Menu, MoonIcon, SunIcon } from '@/components/ui/Icons'

/**
 * Alternar entre noturno e claro.
 *
 * Com rotulo, sempre: antes isso era um clique no simbolo da marca, sem nome
 * nenhum — quem nao adivinhasse nunca descobriria. O texto anuncia o que o
 * clique FAZ ("Modo claro" quando esta escuro), e nao onde voce esta.
 *
 * `compact` deixa so o icone, para a barra do topo, onde nao ha espaco para o
 * texto; ali o nome vive no `aria-label` e no `title`.
 */
function ThemeOption({ isDark, onToggle, compact = false }: { isDark: boolean; onToggle: () => void; compact?: boolean }) {
  const label = isDark ? 'Modo claro' : 'Modo noturno'
  const Icon = isDark ? SunIcon : MoonIcon

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 text-fg transition-colors duration-400 hover:border-accent/60 hover:text-accent-strong',
        compact ? 'size-9 justify-center' : 'px-4 py-2.5 text-sm',
      )}
    >
      <Icon width={compact ? 18 : 16} height={compact ? 18 : 16} />
      {compact ? null : label}
    </button>
  )
}

/**
 * Cabecalho fixo. Todo item do menu rola ate a sua secao — nao existe mais
 * nenhuma pagina separada para navegar.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDark, toggle: toggleTheme } = useTheme()
  const scrolled = useScrolled(20)
  const panelRef = useRef<HTMLDivElement>(null)

  const sectionIds = useMemo(() => navItems.map((item) => item.id), [])
  const activeSection = useActiveSection(sectionIds)

  useScrollLock(menuOpen)
  useFocusTrap(panelRef, menuOpen)

  // Esc fecha o menu
  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  // Ao voltar para o desktop, o painel mobile nao pode continuar aberto
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    setMenuOpen(false)
    scrollToSection(id)
  }

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setMenuOpen(false)
    scrollToSection('inicio')
  }

  return (
    <header
      className={cn(
        /*
          Barra com presenca propria: fundo quase opaco, contorno visivel e
          uma sombra que a separa do conteudo. O site inteiro e escuro — com
          o fundo em 75% de opacidade ela se dissolvia no hero e ficava
          dificil de enxergar. Aqui ela e uma faixa, nao um veu.
        */
        'fixed inset-x-0 top-0 z-50 border-b border-line bg-night/95 shadow-[0_1px_24px_-8px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500',
        scrolled || menuOpen ? 'border-line-strong shadow-[0_6px_28px_-10px_rgba(0,0,0,1)]' : null,
      )}
    >
      <nav aria-label="Navegação principal" className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
        {/*
          A marca e so a marca: um unico link, que leva ao topo. Ela nao troca
          mais o tema — trocar tema clicando num simbolo sem rotulo era uma
          acao escondida; agora e uma opcao com nome, mais abaixo.
        */}
        <a
          href="#inicio"
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 rounded-lg transition-opacity duration-300 hover:opacity-80"
        >
          <BrandMark className="size-9" />
          <span className="font-display text-[1.0625rem] font-semibold tracking-tight text-fg">{brandName()}</span>
        </a>

        {/* ------------------------------- desktop ------------------------------ */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => handleNavigate(event, item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative block rounded-full px-3.5 py-2 text-sm transition-colors duration-300',
                    isActive ? 'text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-3.5 -bottom-0.5 h-px origin-center bg-accent-strong transition-transform duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)]',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        {/*
          Sem link de curriculo aqui: ele ja existe no hero ("Baixar
          curriculo") e de novo em Contato — no cabecalho seria a mesma
          informacao pela terceira vez.
        */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeOption isDark={isDark} onToggle={toggleTheme} compact />
        </div>

        {/* ------------------------------- mobile ------------------------------- */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface/60 text-fg transition-colors duration-400 hover:border-accent/60 hover:text-accent-strong"
          >
            {menuOpen ? <Close width={20} height={20} /> : <Menu width={20} height={20} />}
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id="menu-mobile"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-night/97 backdrop-blur-xl motion-safe:animate-[slide-down-panel_0.3s_cubic-bezier(0.16,1,0.3,1)] sm:top-18 md:hidden"
        >
          <div className="container-page flex min-h-full flex-col justify-between gap-10 py-8">
            {/*
              Sem numeracao aqui: as secoes ja tem a delas (01 Sobre, 02
              Projetos, 03 Contato) e numerar o menu criava uma segunda
              contagem, diferente, para as mesmas coisas.
            */}
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleNavigate(event, item.id)}
                    aria-current={activeSection === item.id ? 'true' : undefined}
                    className={cn(
                      'block rounded-xl px-2 py-3.5 font-display text-2xl font-semibold transition-colors duration-300',
                      activeSection === item.id ? 'text-accent-strong' : 'text-fg hover:text-accent-strong',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Sem atalho de curriculo aqui — ver a mesma decisao acima. */}
            <div className="space-y-4 border-t border-line pt-6">
              <p className="meta text-subtle">Aparência</p>
              <ThemeOption isDark={isDark} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
