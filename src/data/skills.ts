import type { SkillCategory } from '@/types/content'

/**
 * ============================================================================
 * TECNOLOGIAS
 * ============================================================================
 * As listas abaixo vieram das tecnologias declaradas nos proprios projetos
 * (ERP para Transportadora, Projeto Angular e Análise de Combustíveis) — nada
 * aqui foi inferido.
 * Enquanto `items` estiver vazio, a categoria mostra um bloco de placeholder.
 *
 * `level` continua sem preenchimento de proposito: e uma avaliacao que so a
 * dona do portfolio pode fazer.
 *
 * Para preencher, adicione objetos em `items`:
 *
 *   { name: 'TypeScript', level: 'Uso em projetos', description: 'Tipagem estática no front e no back.' }
 *
 * Campos:
 *  - name        (obrigatorio)
 *  - level       (opcional) 'Estudando' | 'Uso em projetos' | 'Confortavel'
 *  - description (opcional) uma linha curta
 *  - icon        (opcional) caminho de um SVG em /public, ex.: '/icons/ts.svg'
 *
 * Categorias sem uso podem simplesmente ser removidas deste array.
 * Nao usamos barras de progresso ("Java 95%") por transmitirem falsa precisao.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    hint: 'Interfaces e experiência do usuário',
    items: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Angular' },
      { name: 'Tailwind CSS' },
      { name: 'Vite' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    hint: 'APIs, regras de negócio e integrações',
    items: [
      { name: 'Python' },
      { name: 'FastAPI' },
      { name: 'SQLAlchemy' },
      { name: 'JWT' },
      { name: 'bcrypt' },
    ],
  },
  {
    id: 'banco-de-dados',
    label: 'Banco de dados',
    hint: 'Modelagem, consultas e persistência',
    items: [{ name: 'PostgreSQL' }, { name: 'Supabase' }],
  },
  {
    id: 'ferramentas',
    label: 'Ferramentas',
    hint: 'Versionamento, testes e ambiente de trabalho',
    items: [{ name: 'Vercel' }],
  },
  {
    id: 'outros',
    label: 'Outros',
    hint: 'Análise de dados e áreas de interesse',
    items: [{ name: 'pandas' }, { name: 'Streamlit' }, { name: 'Plotly' }, { name: 'Matplotlib' }],
  },
]
