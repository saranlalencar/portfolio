import type { NavItem } from '@/types/content'

/**
 * Itens do menu, na ordem da rolagem. Todo id precisa existir na pagina —
 * `tecnologias` nao e uma secao, e a ancora que marca o trecho em que a
 * transicao ja virou cartoes de tecnologia (ver `CardsToTech`).
 */
export const navItems: NavItem[] = [
  { id: 'inicio', label: 'Home' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'tecnologias', label: 'Tecnologias' },
  { id: 'contato', label: 'Contato' },
]
