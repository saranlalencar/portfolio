import { cn } from '@/lib/cn'
import { profile } from '@/data'
import { isFilled } from '@/lib/placeholder'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useTheme } from '@/lib/theme'
import { Constellation } from '@/components/decor/NightSky'
import { PixelSprite, type SpriteName } from '@/components/decor/PixelSprite'

/**
 * ============================================================================
 * ESPACO RESERVADO DA PRIMEIRA TELA — FOTO OU ANIMACAO
 * ============================================================================
 * A moldura e sempre a mesma; so o conteudo dela muda:
 *
 *   profile.heroMedia.src = null            -> a cena animada (padrao)
 *   profile.heroMedia.src = '/foto.jpg'     -> <img>
 *   profile.heroMedia.src = '/animacao.mp4' -> <video> silencioso, em laco
 *
 * Assim a troca pela midia real nao mexe em layout, moldura, ornamentos nem
 * espacamento — nada da interface precisa ser reconstruido.
 *
 * A cena padrao e um jardim habitado: a CORUJA no tema noturno, a RAPOSA no
 * diurno. O animal pisca e se ajeita no tronco, e ao redor dele ha vaga-lumes
 * vagando, esporos subindo da vegetacao e uma aurora que se remistura devagar.
 * Tudo em CSS/SVG: nenhuma imagem, nenhuma requisicao, nenhuma biblioteca.
 */

const VIDEO_PATTERN = /\.(mp4|webm|ogv)$/i

/** Vaga-lumes: posicoes fixas, para a cena nunca "pular" entre renders. */
const FIREFLIES: Array<{ left: number; top: number; size: number; delay: number; gold?: boolean }> = [
  { left: 16, top: 24, size: 5, delay: 0 },
  { left: 72, top: 18, size: 4, delay: -3.5, gold: true },
  { left: 38, top: 34, size: 3, delay: -1.8 },
  { left: 84, top: 40, size: 4, delay: -5.2 },
  { left: 24, top: 44, size: 3, delay: -2.6, gold: true },
  { left: 62, top: 30, size: 5, delay: -6.4 },
  { left: 9, top: 38, size: 3, delay: -4.1 },
  { left: 78, top: 58, size: 3, delay: -7.3, gold: true },
  { left: 30, top: 16, size: 4, delay: -8.6 },
  { left: 54, top: 50, size: 3, delay: -10.2 },
  { left: 88, top: 26, size: 3, delay: -12.4 },
]

/** Esporos que sobem da vegetacao — o gesto que mais da vida a cena. */
const SPORES: Array<{ left: number; size: number; delay: number; duration: number }> = [
  { left: 12, size: 3, delay: 0, duration: 16 },
  { left: 26, size: 2, delay: -6, duration: 19 },
  { left: 41, size: 3, delay: -11, duration: 14 },
  { left: 57, size: 2, delay: -3, duration: 21 },
  { left: 69, size: 3, delay: -14, duration: 17 },
  { left: 83, size: 2, delay: -8, duration: 15 },
  { left: 94, size: 3, delay: -17, duration: 20 },
]

interface Growth {
  name: SpriteName
  left: number
  size: number
  opacity: number
  delay: number
}

/** Vegetacao ao fundo: menor, mais apagada, balanco mais lento. */
const BACK_GROWTH: Growth[] = [
  { name: 'pinheiro', left: 4, size: 18, opacity: 0.4, delay: 0 },
  { name: 'pinheiro', left: 13, size: 14, opacity: 0.32, delay: -3.4 },
  { name: 'broto', left: 33, size: 11, opacity: 0.38, delay: -5.1 },
  { name: 'pinheiro', left: 79, size: 16, opacity: 0.36, delay: -1.9 },
  { name: 'folha', left: 90, size: 13, opacity: 0.34, delay: -6.7 },
]

/** Vegetacao a frente: maior e mais nitida, emoldurando a coruja. */
const FRONT_GROWTH: Growth[] = [
  { name: 'broto', left: 5, size: 18, opacity: 0.75, delay: -2.2 },
  { name: 'flor', left: 16, size: 15, opacity: 0.7, delay: -4.5 },
  { name: 'cogumelo', left: 26, size: 13, opacity: 0.62, delay: -0.8 },
  { name: 'folha', left: 74, size: 19, opacity: 0.68, delay: -1.4 },
  { name: 'broto', left: 85, size: 16, opacity: 0.72, delay: -5.8 },
  { name: 'flor', left: 94, size: 12, opacity: 0.6, delay: -7.3 },
]

function MediaContent() {
  const { src, alt } = profile.heroMedia
  const prefersReducedMotion = usePrefersReducedMotion()

  if (!src) return <NightGardenScene />

  // Sem descricao preenchida, o nome ainda produz uma alternativa util.
  const description = isFilled(alt) ? alt : isFilled(profile.name) ? `Foto de ${profile.name}` : ''

  if (VIDEO_PATTERN.test(src)) {
    return (
      <video
        src={src}
        // Em "menos movimento" o video nao inicia sozinho e ganha controles.
        autoPlay={!prefersReducedMotion}
        loop={!prefersReducedMotion}
        controls={prefersReducedMotion}
        muted
        playsInline
        preload="metadata"
        aria-label={description || undefined}
        className="size-full object-cover"
      />
    )
  }

  return <img src={src} alt={description} loading="eager" decoding="async" className="size-full object-cover" />
}

/**
 * A personagem da cena — e ela tambem muda com o tema.
 *
 * A CORUJA e noturna; quando o sol nasce quem aparece no tronco e a RAPOSA.
 * As duas seguem a mesma mecanica: dois quadros de pixel art empilhados
 * (olhos abertos / olhos fechados), e a troca entre eles e o piscar.
 *
 * O `anim-sway` do quadro de fora e o peso do corpo mudando de lugar. Como as
 * animacoes usam `transform`, o posicionamento (`-translate-x-1/2`) fica num
 * elemento separado: senao uma sobrescreveria a outra.
 */
function SceneAnimal() {
  const { isDark } = useTheme()
  const idle = isDark ? 'coruja' : 'raposa'
  const blinking = isDark ? 'coruja-piscando' : 'raposa-piscando'

  /*
    Cada personagem ocupa a fracao da moldura que iguala o TAMANHO DO PIXEL das
    duas. Com a moldura em 400px: a coruja tem 26 celulas em 56% (~8,6px por
    celula) e a raposa, 36 celulas em 70% (~7,8px). Assim a grade parece a
    mesma nos dois temas, e ambas terminam com ~260px de altura.
  */
  return (
    <span
      className={cn(
        'absolute left-1/2 -translate-x-1/2',
        /* a raposa sobe um pouco mais: senao o tronco esconde as meias pretas */
        isDark ? 'bottom-[15%] w-[56%]' : 'bottom-[19%] w-[70%]',
      )}
    >
      {/* halo atras do animal, para ele se destacar do fundo */}
      <span aria-hidden="true" className="anim-breathe absolute -inset-6 rounded-full bg-accent-strong/12 blur-2xl" />

      <span className="anim-sway relative block">
        <span className="anim-blink-open block">
          <PixelSprite name={idle} size={480} className="h-auto w-full" />
        </span>
        <span className="anim-blink-closed absolute inset-0 block">
          <PixelSprite name={blinking} size={480} className="h-auto w-full" />
        </span>
      </span>
    </span>
  )
}

/** Cena exibida enquanto nao existe foto ou video. */
function NightGardenScene() {
  return (
    <div aria-hidden="true" className="media-wash absolute inset-0">
      {/*
        Manchas de luz que se deslocam devagar e remisturam o campo de cor.
        Usam os tokens `wash-*`, que trocam de sentido com o tema: a noite
        mistura verdes sobre indigo; o dia, relva ao sol sobre ceu azul.
      */}
      <span className="aurora left-[-18%] top-[-12%] size-[68%] bg-wash-1/55" style={{ animationDuration: '26s' }} />
      <span
        className="aurora bottom-[-12%] right-[-12%] size-[68%] bg-wash-4/45"
        style={{ animationDuration: '34s', animationDelay: '-8s' }}
      />
      <span
        className="aurora left-[32%] top-[26%] size-[52%] bg-wash-2/32"
        style={{ animationDuration: '30s', animationDelay: '-14s' }}
      />
      <span
        className="aurora right-[-8%] top-[16%] size-[46%] bg-wash-3/45"
        style={{ animationDuration: '22s', animationDelay: '-5s' }}
      />
      <span
        className="aurora bottom-[26%] left-[-10%] size-[50%] bg-wash-4/28"
        style={{ animationDuration: '38s', animationDelay: '-19s' }}
      />

      {/* dois aneis, em sentidos opostos, dando profundidade ao ceu */}
      <svg
        viewBox="0 0 100 100"
        className="anim-orbit absolute left-1/2 top-[36%] size-[135%] -translate-x-1/2 -translate-y-1/2 opacity-40"
        fill="none"
      >
        <ellipse
          cx="50"
          cy="50"
          rx="34"
          ry="34"
          stroke="var(--color-accent-strong)"
          strokeOpacity="0.5"
          strokeWidth="0.35"
          strokeDasharray="1.5 4"
        />
        <circle cx="84" cy="50" r="1.1" fill="var(--color-gold)" fillOpacity="0.9" />
      </svg>
      <svg
        viewBox="0 0 100 100"
        className="anim-orbit-reverse absolute left-1/2 top-[36%] size-[168%] -translate-x-1/2 -translate-y-1/2 opacity-25"
        fill="none"
      >
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="30"
          stroke="var(--color-sand)"
          strokeOpacity="0.4"
          strokeWidth="0.3"
          strokeDasharray="1 6"
        />
      </svg>

      <Constellation className="absolute right-3 top-4 w-24 opacity-50" />

      {/* vaga-lumes: o span externo vagueia, o interno acende e apaga */}
      {FIREFLIES.map((fly, index) => (
        <span
          key={index}
          className="anim-wander absolute"
          style={{ left: `${fly.left}%`, top: `${fly.top}%`, animationDelay: `${fly.delay}s` }}
        >
          <span
            className="anim-twinkle block rounded-full"
            style={{
              width: `${fly.size}px`,
              height: `${fly.size}px`,
              backgroundColor: fly.gold ? 'var(--color-gold)' : 'var(--color-accent-strong)',
              boxShadow: `0 0 ${fly.size * 2.5}px ${fly.gold ? 'var(--color-gold)' : 'var(--color-accent-strong)'}`,
              animationDelay: `${fly.delay * 0.6}s`,
            }}
          />
        </span>
      ))}

      {/* terreno em duas camadas, na mesma linguagem da paisagem do rodape */}
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[30%] w-full">
        <path
          d="M0,46 C56,26 98,58 150,50 C212,41 244,18 304,30 C346,38 372,52 400,44 L400,120 L0,120 Z"
          fill="var(--color-night)"
          fillOpacity="0.55"
          stroke="var(--color-moss)"
          strokeOpacity="0.5"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0,82 C48,70 92,90 148,84 C206,78 250,62 300,70 C344,77 374,86 400,80 L400,120 L0,120 Z"
          fill="var(--color-night)"
          fillOpacity="0.95"
          stroke="var(--color-moss)"
          strokeOpacity="0.38"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {BACK_GROWTH.map((item, index) => (
        <span key={`back-${index}`} className="absolute bottom-[19%]" style={{ left: `${item.left}%` }}>
          <span className="anim-sway block" style={{ animationDelay: `${item.delay}s`, animationDuration: '13s' }}>
            <PixelSprite name={item.name} size={item.size} opacity={item.opacity} />
          </span>
        </span>
      ))}

      {/* poleiro: a madeira quente da mesa da referencia, sob os pes da ave */}
      <span className="absolute bottom-[13%] left-1/2 w-[76%] -translate-x-1/2">
        <PixelSprite name="galho" size={480} className="h-auto w-full" />
      </span>

      <SceneAnimal />

      {FRONT_GROWTH.map((item, index) => (
        <span key={`front-${index}`} className="absolute bottom-[7%]" style={{ left: `${item.left}%` }}>
          <span className="anim-sway block" style={{ animationDelay: `${item.delay}s` }}>
            <PixelSprite name={item.name} size={item.size} opacity={item.opacity} />
          </span>
        </span>
      ))}

      {/* esporos subindo da vegetacao */}
      {SPORES.map((spore, index) => (
        <span key={`spore-${index}`} className="absolute bottom-[10%]" style={{ left: `${spore.left}%` }}>
          <span
            className="anim-rise block rounded-full bg-accent-strong"
            style={{
              width: `${spore.size}px`,
              height: `${spore.size}px`,
              animationDelay: `${spore.delay}s`,
              animationDuration: `${spore.duration}s`,
            }}
          />
        </span>
      ))}
    </div>
  )
}

export function HeroMedia() {
  return (
    <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-[22rem] lg:max-w-[25rem]">
      {/* pequenos detalhes fora da moldura */}
      <span aria-hidden="true" className="anim-twinkle absolute -left-6 top-10 hidden sm:block">
        <PixelSprite name="estrela" size={13} opacity={0.75} />
      </span>
      <span
        aria-hidden="true"
        className="anim-float absolute -bottom-4 -right-5 hidden sm:block"
        style={{ animationDelay: '-5s' }}
      >
        <PixelSprite name="folha" size={20} opacity={0.6} />
      </span>

      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_50px_130px_-70px_rgba(57,64,111,0.95)]">
        <MediaContent />

        {/* vinheta: aproxima a moldura do fundo da pagina, sem escurecer o centro */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_60px_20px_rgba(22,38,31,0.5)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-accent-strong/10"
        />
      </div>
    </div>
  )
}
