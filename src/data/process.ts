import type { ProcessStep } from '@/types/content'

/**
 * Secao "Como transformo uma ideia em software".
 * Texto conceitual sobre metodo de trabalho — edite livremente para que soe
 * como voce. Adicionar ou remover etapas ajusta a numeracao visual sozinho.
 */
export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Entender',
    description:
      'Antes de escrever qualquer linha de código, mapeio quem é afetado, o que precisa mudar e qual resultado define sucesso.',
  },
  {
    index: '02',
    title: 'Planejar',
    description:
      'Defino escopo, prioridades e o menor recorte capaz de entregar valor real, separando o essencial do que pode esperar.',
  },
  {
    index: '03',
    title: 'Projetar',
    description:
      'Desenho os dados, os fluxos e os limites entre as partes do sistema — decidir a estrutura antes evita retrabalho depois.',
  },
  {
    index: '04',
    title: 'Construir',
    description:
      'Implemento em incrementos pequenos e verificáveis, mantendo o código legível para quem for lê-lo no futuro.',
  },
  {
    index: '05',
    title: 'Testar',
    description:
      'Valido o comportamento esperado, provoco os casos de borda e confirmo que a solução resolve o problema original.',
  },
  {
    index: '06',
    title: 'Evoluir',
    description:
      'Reviso o que ficou frágil, simplifico o que ficou complexo e registro os aprendizados para a próxima iteração.',
  },
]
