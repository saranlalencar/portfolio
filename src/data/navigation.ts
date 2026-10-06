import type { NavItem } from '@/types/content'

/**
 * Itens da navbar. O `id` precisa ser igual ao `id` da <section> correspondente
 * — e o mesmo valor usado pelo indicador de secao ativa.
 */
export const navItems: NavItem[] = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'tecnologias', label: 'Tecnologias' },
  { id: 'formacao', label: 'Formação' },
  { id: 'contato', label: 'Contato' },
]

/**
 * Trajetoria e Processo nao entram no menu de proposito: a navegacao fica com
 * cinco destinos, e as duas secoes sao encontradas naturalmente durante a
 * leitura da pagina. Para exibi-las, basta acrescentar
 * { id: 'trajetoria', label: 'Trajetória' } ao array acima.
 */
