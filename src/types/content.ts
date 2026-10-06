/**
 * Tipos do conteudo do portfolio.
 *
 * Qualquer campo do tipo `Editable` aceita tanto o conteudo real quanto um
 * placeholder no formato `[TEXTO EM MAIUSCULAS]`. A interface detecta o
 * placeholder automaticamente (ver src/lib/placeholder.ts) e o exibe com
 * aparencia de "pendente", nunca como conteudo final.
 */
export type Editable = string

/* --------------------------------- Perfil -------------------------------- */

export interface ProfileLinks {
  /** URL completa do LinkedIn ou placeholder. */
  linkedin: Editable
  /** Apenas o endereco de e-mail (sem "mailto:") ou placeholder. */
  email: Editable
  /** URL completa do GitHub ou placeholder. */
  github: Editable
  /** Caminho do PDF em /public (ex.: "/curriculo.pdf") ou placeholder. */
  resume: Editable
}

export interface Profile {
  name: Editable
  /** Nome curto usado na navbar e no rodape. Cai para `name` se vazio. */
  shortName?: Editable
  role: string
  institution: string
  /** Frase de impacto do hero. */
  tagline: string
  /** Resumo de 1 a 2 linhas exibido no hero. */
  heroSummary: string
  /** Bio completa da secao "Sobre mim", um item por paragrafo. */
  bio: string[]
  /** Itens da area "Atualmente estou explorando". */
  currentlyExploring: Editable[]
  /** Localizacao opcional exibida no contato. */
  location?: Editable
  /** Titulo e texto da secao de contato — editaveis sem tocar no componente. */
  contact: {
    heading: string
    message: string
  }
  /** Caminho de uma foto em /public. `null` exibe a marca geometrica. */
  photoUrl: string | null
  /**
   * Midia principal do hero — o espaco reservado da primeira tela.
   * Enquanto `src` for `null`, a moldura exibe a composicao animada padrao.
   */
  heroMedia: {
    /** Caminho em /public: imagem (.jpg/.png/.webp/.gif) ou video (.mp4/.webm). */
    src: string | null
    /** Descricao para leitores de tela. Obrigatoria quando houver `src`. */
    alt: Editable
  }
  links: ProfileLinks
  seo: {
    /** Usado no <title> e no Open Graph quando o nome real for preenchido. */
    titleSuffix: string
    description: string
  }
}

/* ------------------------------- Navegacao ------------------------------- */

export interface NavItem {
  id: string
  label: string
}

/* ------------------------------- Trajetoria ------------------------------ */

export type JourneyState = 'atual' | 'concluido' | 'planejado'

export interface JourneyEntry {
  id: string
  /** Rotulo curto: "Formacao", "Projetos", "Proximos passos"... */
  kind: string
  title: Editable
  subtitle?: Editable
  period: Editable
  description: Editable
  state: JourneyState
}

/* ------------------------------ Tecnologias ------------------------------ */

/**
 * Nivel opcional e textual de proposito. Nao usamos porcentagens ou barras de
 * progresso: elas transmitem precisao que nao existe.
 */
export type SkillLevel = 'Estudando' | 'Uso em projetos' | 'Confortavel'

export interface Skill {
  name: Editable
  /** Caminho de um SVG em /public ou emoji. Opcional. */
  icon?: string
  level?: SkillLevel
  description?: Editable
}

export interface SkillCategory {
  id: string
  label: string
  /** Texto curto que explica o agrupamento. */
  hint?: string
  items: Skill[]
}

/* -------------------------------- Projetos ------------------------------- */

export type ProjectCategoryId = 'frontend' | 'backend' | 'mobile' | 'sistemas' | 'academicos' | 'outros'

export type ProjectStatus = 'em-desenvolvimento' | 'concluido' | 'planejado' | 'pausado'

export interface ProjectScreenshot {
  /** Caminho da imagem em /public. `null` renderiza a moldura de placeholder. */
  src: string | null
  alt: Editable
  caption?: Editable
}

export interface ProjectLinks {
  repository: Editable
  demo: Editable
}

export interface Project {
  /** Identificador da URL: #projeto/<slug> */
  slug: string
  title: string
  /** Categoria usada pelos filtros. */
  category: ProjectCategoryId
  /** Rotulo editorial exibido no cartao ("Sistema de Gestao"). */
  categoryLabel: Editable
  status: ProjectStatus
  /** Um unico projeto deve ser o destaque da secao. */
  featured?: boolean
  period: Editable
  /** Resumo curto do cartao. */
  summary: Editable
  problem: Editable
  /** Cenario em que o problema acontece — antecede o objetivo no case. */
  context: Editable
  objective: Editable
  solution: Editable
  features: Editable[]
  technologies: Editable[]
  architecture: Editable
  challenges: Editable[]
  learnings: Editable[]
  /** Proximos passos previstos para o projeto. */
  evolution: Editable[]
  screenshots: ProjectScreenshot[]
  links: ProjectLinks
}

/* -------------------------------- Processo ------------------------------- */

export interface ProcessStep {
  /** "01", "02", ... */
  index: string
  title: string
  description: string
}

/* -------------------------------- Formacao ------------------------------- */

export interface EducationDetail {
  label: string
  value: Editable
}

export interface EducationGroup {
  label: string
  items: Editable[]
}

export interface Education {
  course: string
  institution: string
  status: string
  details: EducationDetail[]
  groups: EducationGroup[]
}
