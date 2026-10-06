import { useMemo } from 'react'
import { cn } from '@/lib/cn'

/**
 * ============================================================================
 * PIXEL SPRITES ORIGINAIS
 * ============================================================================
 * Pequenos detalhes de personalidade — uma estrela, uma folha, um broto — em
 * estetica pixelada, desenhados especificamente para este portfolio.
 *
 * Regras de uso (conscientes e importantes):
 *  - pixel art aparece SOMENTE como ornamento;
 *  - nunca em botoes, textos, menus, cartoes de projeto ou formularios;
 *  - todo sprite e decorativo, portanto `aria-hidden`.
 *
 * Cada sprite e uma matriz de caracteres. Cada caractere aponta para uma cor
 * da paleta; o ponto (.) e transparente. Celulas vizinhas de mesma cor sao
 * fundidas em um unico <rect>, o que mantem o DOM pequeno.
 */

export type SpriteName =
  | 'estrela'
  | 'folha'
  | 'broto'
  | 'flor'
  | 'lua'
  | 'cogumelo'
  | 'pinheiro'
  | 'semente'
  | 'galho'
  | 'coruja'
  | 'coruja-piscando'
  | 'raposa'
  | 'raposa-piscando'

interface Sprite {
  rows: string[]
  colors: Record<string, string>
}

const SPRITES: Record<SpriteName, Sprite> = {
  /* Brilho de quatro pontas. */
  estrela: {
    rows: ['...a...', '...b...', '..aba..', 'abbcbba', '..aba..', '...b...', '...a...'],
    colors: {
      a: 'color-mix(in srgb, var(--color-gold) 55%, transparent)',
      b: 'var(--color-gold)',
      c: 'var(--color-sand)',
    },
  },

  /* Folha com nervura central e talo. */
  folha: {
    rows: ['......bb', '....bbbb', '..bbbbcb', '.bbbbcbb', '.bbbcbb.', '.abbcb..', '.aabb...', 'aa......'],
    colors: {
      a: 'var(--color-moss)',
      b: 'var(--color-accent)',
      c: 'var(--color-accent-strong)',
    },
  },

  /* Broto de duas folhas. */
  broto: {
    rows: ['.b...b.', 'bbb.bbb', '.bbabb.', '...a...', '...a...', '...a...', '..aaa..'],
    colors: {
      a: 'var(--color-moss)',
      b: 'var(--color-accent-strong)',
    },
  },

  /* Flor de cinco petalas com miolo dourado. */
  flor: {
    rows: ['..aaa..', '.abbba.', 'aabcbaa', '.abbba.', '..ada..', '...d...', '..ddd..'],
    colors: {
      a: 'var(--color-iris)',
      b: 'var(--color-sand)',
      c: 'var(--color-gold)',
      d: 'var(--color-moss)',
    },
  },

  /* Lua crescente. */
  lua: {
    rows: ['...bab...', '..aa.....', '.aa......', '.aa......', 'aa.......', '.aa......', '.aa......', '..aa.....', '...bab...'],
    colors: {
      a: 'var(--color-sand)',
      b: 'var(--color-gold)',
    },
  },

  /* Cogumelo de tampa vermelha, como os das referencias em /fotos. */
  cogumelo: {
    rows: ['..aaa..', '.abaaba', 'aaaaaaa', '..bbb..', '..bbb..', '..bbb..'],
    colors: {
      a: 'var(--color-berry)',
      b: 'var(--color-sand)',
    },
  },

  /* Pinheiro — usado na paisagem do rodape. */
  pinheiro: {
    rows: [
      '....a....',
      '...aaa...',
      '..aaaaa..',
      '...aaa...',
      '..aaaaa..',
      '.aaaaaaa.',
      '..aaaaa..',
      '.aaaaaaa.',
      'aaaaaaaaa',
      '....b....',
      '....b....',
    ],
    colors: {
      a: 'var(--color-moss)',
      b: 'var(--color-indigo)',
    },
  },

  /*
    Coruja — a personagem da primeira tela. Desenhada especificamente para este
    portfolio: ave noturna, coerente com o jardim noturno e com o gesto de
    estudar de madrugada. Dois quadros: olhos abertos e olhos fechados; a
    troca entre eles e o piscar (ver .anim-blink-* em styles/index.css).
  */
  coruja: {
    rows: [
      '.......o...........o......',
      '......obo.........obo.....',
      '.....obbbo.......obbbo....',
      '.....obbbbo.....obbbbo....',
      '....obbbbbooooooobbbbbo...',
      '....obbbbbobbbbbobbbbbo...',
      '.....oooobbbbbbbbboooo....',
      '......obbbbbcccbbbbbo.....',
      '......obbbcccccccbbbo.....',
      '.....obbbcccccccccbbbo....',
      '.....obbceeeccceeecbbo....',
      '....obbcepppcccpppecbbo...',
      '....obbcepppecepppecbbo...',
      '....obbcepppcccpppecbbo...',
      '.....obbceeeccceeecbbo....',
      '.....owwccccddcccccwwo....',
      '....owwwwcccddccccwwwwo...',
      '....owwwwwcccdcccwwwwwo...',
      '...owwwwwwcccccccwwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '....owwwwcccccccccwwwwo...',
      '....owwwwbcccccccbwwwwo...',
      '.....owwbbbcccccbbbwwo....',
      '......oobbbbbbbbbbboo.....',
      '........ooddbbbddoo.......',
      '..........ooooooo.........',
    ],
    colors: {
      /*
        A ave e escura sobre o verde vivo da cena — a mesma relacao das
        referencias em /fotos, onde o animal azul-violeta se destaca contra a
        vegetacao clara. Peito e disco facial em creme, olhos ambar.

        Cores FIXAS, de proposito: a coruja e uma personagem, nao um elemento de
        interface. Ela e a mesma de dia e de noite — o que muda em volta dela e
        a cena. (Por isso nao usa os tokens que trocam com o tema.)
      */
      o: '#1e2450',
      b: '#39406f',
      w: '#2a3059',
      c: 'var(--color-cream)',
      e: '#e0b25c',
      p: '#141a18',
      d: '#e0b25c',
    },
  },

  'coruja-piscando': {
    rows: [
      '.......o...........o......',
      '......obo.........obo.....',
      '.....obbbo.......obbbo....',
      '.....obbbbo.....obbbbo....',
      '....obbbbbooooooobbbbbo...',
      '....obbbbbobbbbbobbbbbo...',
      '.....oooobbbbbbbbboooo....',
      '......obbbbbcccbbbbbo.....',
      '......obbbcccccccbbbo.....',
      '.....obbbcccccccccbbbo....',
      '.....obbcccccccccccbbo....',
      '....obbcccccccccccccbbo...',
      '....obbcooooocooooocbbo...',
      '....obbcccccccccccccbbo...',
      '.....obbcccccccccccbbo....',
      '.....owwccccddcccccwwo....',
      '....owwwwcccddccccwwwwo...',
      '....owwwwwcccdcccwwwwwo...',
      '...owwwwwwcccccccwwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '...owwwwwcccccccccwwwwwo..',
      '....owwwwcccccccccwwwwo...',
      '....owwwwbcccccccbwwwwo...',
      '.....owwbbbcccccbbbwwo....',
      '......oobbbbbbbbbbboo.....',
      '........ooddbbbddoo.......',
      '..........ooooooo.........',
    ],
    colors: {
      /*
        A ave e escura sobre o verde vivo da cena — a mesma relacao das
        referencias em /fotos, onde o animal azul-violeta se destaca contra a
        vegetacao clara. Peito e disco facial em creme, olhos ambar.

        Cores FIXAS, de proposito: a coruja e uma personagem, nao um elemento de
        interface. Ela e a mesma de dia e de noite — o que muda em volta dela e
        a cena. (Por isso nao usa os tokens que trocam com o tema.)
      */
      o: '#1e2450',
      b: '#39406f',
      w: '#2a3059',
      c: 'var(--color-cream)',
      e: '#e0b25c',
      p: '#141a18',
      d: '#e0b25c',
    },
  },

  raposa: {
    rows: [
      '........oko.........oko.............',
      '........oko.........oko.............',
      '.......okbbo.......obbko............',
      '.......okbbo.......obbko............',
      '......okbbbbooooooobbbbko...........',
      '......okbbbbooobooobbbbko...........',
      '.....okbbbbblllllllbbbbbko..........',
      '.....okbbbblllllllllbbbbko..........',
      '.....okbbblllllllllllbbbko..........',
      '......ooolllllllllllllooo...........',
      '......ooblllllllllllllboo...........',
      '......oobbleellllleelbboo...........',
      '......oobbbeellllleebbboo...........',
      '......oocccblllllllbcccoo...........',
      '......ooccbbcccccccbbccoooooo.......',
      '.......oobbbcccccccbbboooooooo......',
      '.......oobbbccnnnccbbboosssssoo.....',
      '........oobbbccnccbbboosssssssoo....',
      '.........ooobbbbbbboooosssssssoo....',
      '........oobbooobooobbbbosssssssoo...',
      '........oobbocccccobbbbosssssssoo...',
      '.......oobbbocccccobbbbbossssssoo...',
      '.......oobbbocccccobbbbbossssssoo...',
      '.......oobbocccccccossbbossssssoo...',
      '.......obbbocccccccosssooossssoo....',
      '.......oobbocccccccosoocccoossoo....',
      '.......oobbbocccccossocccccosoo.....',
      '.......ooooooccccoooocccccccooo.....',
      '.......ookkkoccccokkkocccccosoo.....',
      '.......ookkkooocookkkoocccoosoo.....',
      '.......ookkkobbobokkkooooossoo......',
      '.......ookkkobbbbokkkooosoooo.......',
      '.......ooooooooooooooooooooo........',
      '........oooooooooooooo..............',
    ],
    colors: {
      /*
        Raposa — personagem do modo diurno, desenhada a partir das tres
        referencias em /fotos: focinho de frente e bochechas separadas (do
        grafico do rosto), laranja avermelhado com contorno quase preto e as
        "meias" pretas nas pernas (da raposa no bosque), pose sentada com a
        cauda em arco e ponta creme (da raposa na grama).

        Cores FIXAS, como as da coruja: e personagem, nao interface.
      */
      o: '#3b1e10', /* contorno              */
      k: '#241109', /* orelhas e meias       */
      b: '#c0562a', /* laranja do corpo      */
      l: '#d2662f', /* topo da cabeca        */
      s: '#a34a22', /* sombra e cauda        */
      c: 'var(--color-cream)',
      e: '#1c1109',
      n: '#1c1109',
    },
  },

  'raposa-piscando': {
    rows: [
      '........oko.........oko.............',
      '........oko.........oko.............',
      '.......okbbo.......obbko............',
      '.......okbbo.......obbko............',
      '......okbbbbooooooobbbbko...........',
      '......okbbbbooobooobbbbko...........',
      '.....okbbbbblllllllbbbbbko..........',
      '.....okbbbblllllllllbbbbko..........',
      '.....okbbblllllllllllbbbko..........',
      '......ooolllllllllllllooo...........',
      '......ooblllllllllllllboo...........',
      '......oobblbblllllbblbboo...........',
      '......oobbboollllloobbboo...........',
      '......oocccblllllllbcccoo...........',
      '......ooccbbcccccccbbccoooooo.......',
      '.......oobbbcccccccbbboooooooo......',
      '.......oobbbccnnnccbbboosssssoo.....',
      '........oobbbccnccbbboosssssssoo....',
      '.........ooobbbbbbboooosssssssoo....',
      '........oobbooobooobbbbosssssssoo...',
      '........oobbocccccobbbbosssssssoo...',
      '.......oobbbocccccobbbbbossssssoo...',
      '.......oobbbocccccobbbbbossssssoo...',
      '.......oobbocccccccossbbossssssoo...',
      '.......obbbocccccccosssooossssoo....',
      '.......oobbocccccccosoocccoossoo....',
      '.......oobbbocccccossocccccosoo.....',
      '.......ooooooccccoooocccccccooo.....',
      '.......ookkkoccccokkkocccccosoo.....',
      '.......ookkkooocookkkoocccoosoo.....',
      '.......ookkkobbobokkkooooossoo......',
      '.......ookkkobbbbokkkooosoooo.......',
      '.......ooooooooooooooooooooo........',
      '........oooooooooooooo..............',
    ],
    colors: {
      /*
        Raposa — personagem do modo diurno, desenhada a partir das tres
        referencias em /fotos: focinho de frente e bochechas separadas (do
        grafico do rosto), laranja avermelhado com contorno quase preto e as
        "meias" pretas nas pernas (da raposa no bosque), pose sentada com a
        cauda em arco e ponta creme (da raposa na grama).

        Cores FIXAS, como as da coruja: e personagem, nao interface.
      */
      o: '#3b1e10', /* contorno              */
      k: '#241109', /* orelhas e meias       */
      b: '#c0562a', /* laranja do corpo      */
      l: '#d2662f', /* topo da cabeca        */
      s: '#a34a22', /* sombra e cauda        */
      c: 'var(--color-cream)',
      e: '#1c1109',
      n: '#1c1109',
    },
  },

  /*
    Galho — o poleiro da coruja. A madeira quente vem da mesa de madeira da
    referencia em /fotos. Cores fixas, como as da coruja: fazem parte da cena
    da personagem, nao da interface.
  */
  galho: {
    rows: [
      '..aaaaaaaaaaaaaaaaaaaa..',
      '.aabbbbbbbbbbbbbbbbbbaa.',
      'abbbbbbbbbbbbbbbbbbbbbba',
      'abbbbcbbbbbcbbbbbcbbbbba',
      '.acccccccccccccccccccca.',
      '..cccccccccccccccccccc..',
    ],
    colors: {
      a: '#c08a52',
      b: '#a0703f',
      c: '#6d4529',
    },
  },

  /* Semente / particula luminosa. */
  semente: {
    rows: ['..a..', '.aba.', 'abbba', '.aba.', '..a..'],
    colors: {
      a: 'color-mix(in srgb, var(--color-accent-strong) 45%, transparent)',
      b: 'var(--color-accent-strong)',
    },
  },
}

interface Run {
  x: number
  y: number
  width: number
  fill: string
}

/** Funde celulas horizontais de mesma cor em um unico retangulo. */
function toRuns(sprite: Sprite): Run[] {
  const runs: Run[] = []

  sprite.rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const char = row[x]
      if (char === '.') {
        x += 1
        continue
      }
      let width = 1
      while (x + width < row.length && row[x + width] === char) width += 1
      runs.push({ x, y, width, fill: sprite.colors[char] ?? 'currentColor' })
      x += width
    }
  })

  return runs
}

interface PixelSpriteProps {
  name: SpriteName
  /** Largura final em pixels CSS. A altura segue a proporcao da matriz. */
  size?: number
  className?: string
  /** Opacidade aplicada ao grupo inteiro. */
  opacity?: number
}

export function PixelSprite({ name, size = 16, className, opacity }: PixelSpriteProps) {
  const sprite = SPRITES[name]
  const runs = useMemo(() => toRuns(sprite), [sprite])

  const columns = sprite.rows[0].length
  const lines = sprite.rows.length

  return (
    <svg
      viewBox={`0 0 ${columns} ${lines}`}
      width={size}
      height={(size * lines) / columns}
      shapeRendering="crispEdges"
      className={cn('pointer-events-none block', className)}
      style={opacity === undefined ? undefined : { opacity }}
      aria-hidden="true"
      focusable="false"
    >
      {runs.map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} fill={run.fill} />
      ))}
    </svg>
  )
}
