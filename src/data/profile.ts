import type { Profile } from '@/types/content'

/**
 * ============================================================================
 * DADOS PESSOAIS — EDITE ESTE ARQUIVO PRIMEIRO
 * ============================================================================
 * Tudo que aparece entre colchetes ([INSERIR ...]) e um placeholder: o site
 * detecta o formato e exibe o campo como "pendente", com aparencia tracejada.
 * Basta substituir o texto pelo conteudo real — nenhum componente precisa ser
 * alterado.
 *
 * Links com placeholder NAO viram <a>: eles sao renderizados como um elemento
 * inerte, para que nao exista link quebrado no site publicado.
 */
export const profile: Profile = {
  /** Ex.: 'Maria Silva' */
  name: 'Sara Alencar',

  /** Nome curto para navbar/rodape. Deixe vazio para reaproveitar `name`. */
  shortName: '',

  role: 'Estudante de Ciência da Computação',
  institution: 'IFCE — Campus Maracanaú',

  tagline: 'Construindo soluções através do código.',

  heroSummary:
    'Interessada em desenvolvimento de software e na criação de soluções que transformam problemas reais em sistemas eficientes.',

  /** Bio provisoria — um item do array por paragrafo. */
  bio: [
    'Estudante de Ciência da Computação no IFCE — Campus Maracanaú, interessada em desenvolvimento de software e na criação de soluções que transformam problemas reais em sistemas eficientes.',
    'Atualmente, desenvolvo projetos próprios com foco em aplicações web, sistemas de gestão e análise de dados.',
  ],

  /** Area "Atualmente estou explorando" — adicione ou remova itens livremente. */
  currentlyExploring: [
    '[ADICIONAR TEMA OU TECNOLOGIA EM ESTUDO]',
    '[ADICIONAR TEMA OU TECNOLOGIA EM ESTUDO]',
    '[ADICIONAR TEMA OU TECNOLOGIA EM ESTUDO]',
  ],

  /** Opcional. Aparece apenas na secao de contato. */
  location: 'Fortaleza — CE',

  /** Titulo e texto da secao de contato. */
  contact: {
    heading: 'Vamos construir algo?',
    message:
      'Estou aberta a novas oportunidades, conexões e projetos que permitam continuar aprendendo e construindo.',
  },

  /**
   * Foto de perfil. Coloque o arquivo em /public (ex.: '/foto.jpg') e informe
   * o caminho aqui. Mantendo `null`, exibimos a marca geometrica do portfolio.
   */
  photoUrl: null,

  /**
   * ESPACO RESERVADO DA PRIMEIRA TELA (foto ou animacao).
   *
   * Enquanto `src` for `null`, a moldura mostra a cena animada do portfolio:
   * uma coruja em pixel art num jardim noturno, com vaga-lumes, esporos e
   * aurora em verde musgo. Ela e o conteudo definitivo dessa area ate a midia
   * real existir — nao e um placeholder.
   *
   * Para trocar: coloque o arquivo em /public e aponte aqui.
   *   imagem -> '/foto.jpg' | '/retrato.webp' | '/animacao.gif'
   *   video  -> '/animacao.mp4' | '/animacao.webm'  (silencioso e em laco)
   * Pode ser o mesmo arquivo de `photoUrl`, usado na secao Sobre.
   */
  heroMedia: {
    src: null,
    alt: '[DESCREVER A FOTO OU ANIMAÇÃO]',
  },

  links: {
    /** Ex.: 'https://www.linkedin.com/in/usuario' */
    linkedin: 'https://www.linkedin.com/in/sara-alencar-7bb43022a',
    /** Somente o endereco, sem "mailto:". Ex.: 'nome@email.com' */
    email: 'saranlac1265@gmail.com',
    /** Ex.: 'https://github.com/usuario' */
    github: 'https://github.com/saranlalencar',
    /** Coloque o PDF em /public e use '/curriculo.pdf' */
    resume: '[INSERIR CURRÍCULO]',
  },

  seo: {
    titleSuffix: 'Estudante de Ciência da Computação | IFCE Campus Maracanaú',
    description:
      'Portfólio de estudante de Ciência da Computação do IFCE — Campus Maracanaú. Projetos de aplicações web, sistemas de gestão e análise de dados.',
  },
}
