import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { cn } from '@/lib/cn'
import { placeholderLabel } from '@/lib/placeholder'
import { scrollToSection } from '@/lib/scroll'
import { useTheme } from '@/lib/theme'
import { navItems, profile } from '@/data'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useScrolled } from '@/hooks/useScrolled'
import { BrandMark, brandName } from '@/components/ui/Brand'
import { Close, Download, Menu } from '@/components/ui/Icons'
import { pendingActionClasses } from '@/components/ui/Pending'
import { SmartLink } from '@/components/ui/SmartLink'

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

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled || menuOpen
          ? 'border-b border-line bg-night/88 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav aria-label="Navegação principal" className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
        {/*
          A marca acumula duas funcoes, de proposito: o SIMBOLO troca o tema
          (lua a noite, sol de dia) e o NOME leva ao topo. Sao dois controles
          separados no DOM, cada um com seu rotulo — nunca um botao dentro de
          um link.
        */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={!isDark}
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="rounded-2xl transition-transform duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-safe:hover:scale-105"
          >
            <BrandMark className="size-9" />
          </button>

          <a
            href="#inicio"
            onClick={(event) => handleNavigate(event, 'inicio')}
            className="rounded-lg font-display text-[1.0625rem] font-semibold tracking-tight text-fg transition-opacity duration-300 hover:opacity-80"
          >
            {brandName()}
          </a>
        </div>

        {/* ------------------------------- desktop ------------------------------ */}
        <ul className="hidden items-center gap-1 lg:flex">
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

        <div className="hidden items-center gap-3 lg:flex">
          <SmartLink
            value={profile.links.resume}
            kind="download"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-4 py-2 text-sm text-fg transition-colors duration-400 hover:border-accent/60 hover:text-accent-strong"
            pendingClassName={cn(pendingActionClasses, 'px-4 py-2')}
            pendingContent={
              <>
                <Download width={16} height={16} aria-hidden="true" />
                {placeholderLabel(profile.links.resume)}
              </>
            }
          >
            <Download width={16} height={16} aria-hidden="true" />
            Currículo
          </SmartLink>
        </div>

        {/* --------------------------- tema + mobile --------------------------- */}
        <div className="flex items-center gap-2 lg:hidden">
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
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-night/97 backdrop-blur-xl motion-safe:animate-[slide-down-panel_0.3s_cubic-bezier(0.16,1,0.3,1)] sm:top-18 lg:hidden"
        >
          <div className="container-page flex min-h-full flex-col justify-between gap-10 py-8">
            <ul className="flex flex-col gap-1">
              {navItems.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleNavigate(event, item.id)}
                    aria-current={activeSection === item.id ? 'true' : undefined}
                    className={cn(
                      'flex items-baseline gap-4 rounded-xl px-2 py-3.5 font-display text-2xl font-semibold transition-colors duration-300',
                      activeSection === item.id ? 'text-accent-strong' : 'text-fg hover:text-accent-strong',
                    )}
                  >
                    <span aria-hidden="true" className="meta text-subtle">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-line pt-6">
              <p className="meta text-subtle">Atalhos</p>
              <div className="flex flex-wrap gap-3">
                <SmartLink
                  value={profile.links.resume}
                  kind="download"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-4 py-2.5 text-sm text-fg"
                  pendingClassName={pendingActionClasses}
                  pendingContent={
                    <>
                      <Download width={16} height={16} aria-hidden="true" />
                      {placeholderLabel(profile.links.resume)}
                    </>
                  }
                >
                  <Download width={16} height={16} aria-hidden="true" />
                  Baixar currículo
                </SmartLink>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
