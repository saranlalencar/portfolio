import type { JourneyEntry } from '@/types/content'

/**
 * Linha do tempo da secao "Minha trajetória".
 * A secao foi construida para crescer: basta acrescentar novos objetos ao
 * array — na ordem em que devem aparecer (do mais recente para o mais antigo,
 * ou o contrario, como preferir).
 *
 * `state` controla apenas o visual do marcador:
 *  - 'atual'      -> marcador com anel pulsante e cor de acento
 *  - 'concluido'  -> marcador preenchido
 *  - 'planejado'  -> marcador vazado e tracejado
 */
export const journey: JourneyEntry[] = [
  {
    id: 'formacao',
    kind: 'Formação',
    title: 'Ciência da Computação',
    subtitle: 'IFCE — Campus Maracanaú',
    period: 'Em andamento',
    description: '[ADICIONAR DESCRIÇÃO DA ETAPA]',
    state: 'atual',
  },
  {
    id: 'projetos',
    kind: 'Projetos pessoais',
    title: 'Desenvolvimento de sistemas e aplicações',
    subtitle: 'Aplicações web, sistemas de gestão e análise de dados',
    period: '[ADICIONAR DATA]',
    description: '[ADICIONAR DESCRIÇÃO DA ETAPA]',
    state: 'atual',
  },
  {
    id: 'proximos-capitulos',
    kind: 'Próximos capítulos',
    title: '[ADICIONAR FUTURAMENTE]',
    period: '[ADICIONAR DATA]',
    description: '[ADICIONAR DESCRIÇÃO DA ETAPA]',
    state: 'planejado',
  },
]
