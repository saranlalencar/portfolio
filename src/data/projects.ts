import type { Project, ProjectCategoryId } from '@/types/content'

/**
 * ============================================================================
 * PROJETOS
 * ============================================================================
 * Para adicionar um projeto novo, copie o modelo do final deste arquivo,
 * preencha e inclua no array `projects`. O cartao, o filtro e a pagina de
 * detalhe aparecem automaticamente — nenhum componente precisa ser tocado.
 *
 * Regras da interface:
 *  - `featured: true` transforma o projeto no cartao grande de destaque.
 *    Use em apenas um projeto (o primeiro encontrado vence).
 *  - Campos com placeholder ([ADICIONAR ...]) sao exibidos como pendentes.
 *  - Links com placeholder nao viram <a> — nao existe link quebrado no site.
 *  - Os filtros so aparecem quando ha projetos suficientes (ver FILTER_THRESHOLD)
 *    e apenas para categorias que realmente possuem projetos.
 */

/** Numero minimo de projetos para os filtros aparecerem. */
export const FILTER_THRESHOLD = 4

/** Rotulos dos filtros. Adicione categorias novas tambem em ProjectCategoryId. */
export const projectCategoryLabels: Record<ProjectCategoryId, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  sistemas: 'Sistemas',
  academicos: 'Acadêmicos',
  outros: 'Outros',
}

export const projectStatusLabels: Record<Project['status'], string> = {
  'em-desenvolvimento': 'Em desenvolvimento',
  concluido: 'Concluído',
  planejado: 'Planejado',
  pausado: 'Pausado',
}

export const projects: Project[] = [
  {
    slug: 'erp-transportadora',
    title: 'ERP para Transportadora',
    category: 'sistemas',
    categoryLabel: 'Sistema de Gestão',
    status: 'em-desenvolvimento',
    featured: true,
    period: 'Jul 2026 — atual',

    summary: '[ADICIONAR RESUMO CURTO DO PROJETO — 1 OU 2 LINHAS]',

    problem: '[ADICIONAR PROBLEMA QUE O PROJETO RESOLVE]',
    context: '[ADICIONAR CONTEXTO — ONDE E PARA QUEM O PROBLEMA ACONTECE]',
    objective: '[ADICIONAR OBJETIVO DO PROJETO]',
    solution:
      'ERP que liga orçamento, operação e financeiro num só lugar: motor de orçamento com custo real e markup ajustável, agenda e mudanças, e conciliação bancária automática que casa o extrato com o financeiro sem duplicar pagamento.',

    features: [
      'Motor de orçamento com custo real e markup ajustável',
      'Dashboard operacional',
      'CRM de clientes',
      'Gestão de mudanças/OS e agenda',
      'Financeiro (contas a pagar/receber)',
      'Conciliação bancária automática',
    ],

    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'FastAPI',
      'Python',
      'SQLAlchemy',
      'PostgreSQL (Supabase)',
      'JWT/bcrypt',
      'Vercel',
    ],

    architecture: '[ADICIONAR DESCRIÇÃO DA ARQUITETURA]',

    challenges: ['[ADICIONAR DESAFIO]', '[ADICIONAR DESAFIO]'],

    learnings: ['[ADICIONAR APRENDIZADO]', '[ADICIONAR APRENDIZADO]'],

    evolution: ['[ADICIONAR PRÓXIMO PASSO DO PROJETO]', '[ADICIONAR PRÓXIMO PASSO DO PROJETO]'],

    screenshots: [
      { src: null, alt: '[ADICIONAR SCREENSHOT]', caption: '[ADICIONAR LEGENDA DA TELA]' },
      { src: null, alt: '[ADICIONAR SCREENSHOT]', caption: '[ADICIONAR LEGENDA DA TELA]' },
    ],

    links: {
      repository: '[INSERIR LINK DO GITHUB]',
      demo: '[INSERIR LINK DA DEMONSTRAÇÃO]',
    },
  },

  {
    slug: 'projeto-angular',
    title: 'Projeto Angular',
    category: 'frontend',
    categoryLabel: 'Aplicação Web',
    status: 'em-desenvolvimento',
    period: '[ADICIONAR DATA]',

    summary: '[ADICIONAR RESUMO CURTO DO PROJETO — 1 OU 2 LINHAS]',

    problem: '[ADICIONAR PROBLEMA QUE O PROJETO RESOLVE]',
    context: '[ADICIONAR CONTEXTO — ONDE E PARA QUEM O PROBLEMA ACONTECE]',
    objective: '[ADICIONAR OBJETIVO DO PROJETO]',
    solution: '[ADICIONAR DESCRIÇÃO DO PROJETO]',

    features: ['[ADICIONAR FUNCIONALIDADE]', '[ADICIONAR FUNCIONALIDADE]'],

    // 'Angular' consta do nome do projeto informado pela proprietaria.
    // As demais tecnologias devem ser adicionadas por ela.
    technologies: ['Angular', '[ADICIONAR TECNOLOGIAS]'],

    architecture: '[ADICIONAR DESCRIÇÃO DA ARQUITETURA]',

    challenges: ['[ADICIONAR DESAFIO]'],

    learnings: ['[ADICIONAR APRENDIZADO]'],

    evolution: ['[ADICIONAR PRÓXIMO PASSO DO PROJETO]'],

    screenshots: [{ src: null, alt: '[ADICIONAR SCREENSHOT]', caption: '[ADICIONAR LEGENDA DA TELA]' }],

    links: {
      repository: '[INSERIR LINK DO GITHUB]',
      demo: '[INSERIR LINK DA DEMONSTRAÇÃO]',
    },
  },
  {
    slug: 'analise-combustiveis-anp',
    title: 'Análise de Combustíveis — ANP',
    category: 'academicos',
    categoryLabel: 'Análise de Dados',
    status: 'em-desenvolvimento',
    period: '[ADICIONAR PERÍODO]',

    summary:
      'Painel interativo que explora os preços de revenda de combustíveis nos postos do Brasil, a partir da base semestral da ANP.',

    problem: '[ADICIONAR PROBLEMA QUE O PROJETO RESOLVE]',
    context: '[ADICIONAR CONTEXTO — ONDE E PARA QUEM O PROBLEMA ACONTECE]',
    objective: '[ADICIONAR OBJETIVO DO PROJETO]',

    solution:
      'Painel em Streamlit que carrega a base de preços da ANP, limpa as colunas desnecessárias e converte os valores para número. A partir dela, oferece filtros por região, estado, produto e bandeira, e gráficos que comparam o preço médio com a concorrência e com a quantidade de postos. As conclusões apontadas no próprio painel: a concorrência não apresenta forte impacto no preço médio, enquanto a quantidade de postos apresenta impacto maior.',

    features: [
      'Filtros por região, estado, produto e bandeira',
      'Indicadores de média geral, total de postos, bandeiras e região mais cara',
      'Comparação entre preço médio e concorrência por região',
      'Comparação entre preço médio e quantidade de postos',
      'Ranking das cinco maiores bandeiras',
      'Distribuição dos preços e variação por região',
      'Tabelas de maiores e menores preços médios',
    ],

    technologies: ['Python', 'Streamlit', 'pandas', 'Matplotlib', 'Plotly'],

    architecture:
      'Script único (`analiseAnp.py`) que lê o CSV semestral da ANP e monta o painel em Streamlit, com os gráficos em Plotly e Matplotlib.',

    challenges: ['[ADICIONAR DESAFIO]'],

    learnings: ['[ADICIONAR APRENDIZADO]'],

    evolution: ['[ADICIONAR PRÓXIMO PASSO DO PROJETO]'],

    screenshots: [{ src: null, alt: '[ADICIONAR SCREENSHOT]', caption: '[ADICIONAR LEGENDA DA TELA]' }],

    links: {
      repository: 'https://github.com/saranlalencar/Projeto_Integrador',
      demo: '[INSERIR LINK DA DEMONSTRAÇÃO]',
    },
  },
]

/* ============================================================================
 * MODELO PARA UM PROJETO NOVO — copie, renomeie e adicione ao array acima.
 * ============================================================================
 *
 * {
 *   slug: 'meu-projeto',                 // vira a URL: #projeto/meu-projeto
 *   title: 'Meu Projeto',
 *   category: 'frontend',                // frontend | backend | mobile | sistemas | academicos | outros
 *   categoryLabel: 'Aplicação Web',      // rótulo livre exibido no cartão
 *   status: 'em-desenvolvimento',        // em-desenvolvimento | concluido | planejado | pausado
 *   featured: false,
 *   period: '2026',
 *   summary: 'Uma ou duas linhas sobre o projeto.',
 *   problem: 'Qual problema real ele resolve.',
 *   context: 'Onde e para quem o problema acontece.',
 *   objective: 'O que o projeto se propõe a fazer.',
 *   solution: 'Como a solução foi construída.',
 *   features: ['Funcionalidade 1', 'Funcionalidade 2'],
 *   technologies: ['TypeScript', 'React'],
 *   architecture: 'Como o sistema está organizado.',
 *   challenges: ['Desafio enfrentado'],
 *   learnings: ['O que aprendi'],
 *   evolution: ['Próximo passo previsto'],
 *   screenshots: [{ src: '/screenshots/meu-projeto-1.png', alt: 'Tela inicial' }],
 *   links: { repository: 'https://github.com/usuario/repo', demo: 'https://demo.com' },
 * }
 */
