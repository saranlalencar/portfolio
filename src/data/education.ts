import type { Education } from '@/types/content'

/**
 * Secao "Formação".
 * `details` sao pares rotulo/valor exibidos em grade.
 * `groups` sao listas (disciplinas, atividades, certificações...).
 * Grupos e detalhes ainda nao informados permanecem como placeholder.
 */
export const education: Education = {
  course: 'Ciência da Computação',
  institution: 'IFCE — Campus Maracanaú',
  status: 'Em andamento',

  details: [
    { label: 'Período', value: '[ADICIONAR PERÍODO]' },
    { label: 'Previsão de conclusão', value: '[ADICIONAR PREVISÃO DE CONCLUSÃO]' },
  ],

  groups: [
    {
      label: 'Disciplinas relevantes',
      items: ['[ADICIONAR DISCIPLINA RELEVANTE]'],
    },
    {
      label: 'Atividades acadêmicas',
      items: ['[ADICIONAR ATIVIDADE ACADÊMICA]'],
    },
    {
      label: 'Cursos e certificações',
      items: ['[ADICIONAR CURSO OU CERTIFICAÇÃO]'],
    },
  ],
}
