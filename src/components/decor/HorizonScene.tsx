import { cn } from '@/lib/cn'
import { CelestialBody, NightSky } from './NightSky'
import { PixelSprite, type SpriteName } from './PixelSprite'

/**
 * ============================================================================
 * PAISAGEM — ASSINATURA VISUAL DO PORTFOLIO
 * ============================================================================
 * Composicao abstrata de colinas, vegetacao e ceu. Aparece duas vezes:
 *
 *  - `variant="hero"`   apenas a linha do horizonte, bem discreta, fechando a
 *                       primeira tela;
 *  - `variant="footer"` a cena completa, na transicao para o rodape — o
 *                       fechamento da narrativa da pagina.
 *
 * Tudo e vetorial (nenhuma imagem, nenhuma requisicao) e inteiramente
 * decorativo: a arvore inteira fica fora da ordem de leitura de leitores de
 * tela.
 */

/** Silhuetas: cristas desenhadas com curvas suaves, nunca picos agressivos. */
const RIDGE_BACK =
  'M0,168 C90,150 150,120 250,124 C340,128 400,168 500,160 C610,151 660,96 760,104 C870,113 930,158 1030,152 C1130,146 1190,116 1290,122 C1360,126 1400,146 1440,140 L1440,260 L0,260 Z'

const RIDGE_MID =
  'M0,196 C120,180 200,206 300,200 C420,193 470,160 580,168 C690,176 740,212 850,206 C960,200 1010,172 1120,178 C1230,184 1300,208 1440,198 L1440,260 L0,260 Z'

const RIDGE_FRONT =
  'M0,228 C140,218 220,236 340,232 C470,228 520,210 640,216 C760,222 820,240 940,236 C1060,232 1120,214 1240,220 C1340,225 1390,236 1440,232 L1440,260 L0,260 Z'

interface Growth {
  name: SpriteName
  /** Posicao horizontal em % da largura. */
  left: number
  /** Distancia da base em % da altura. */
  bottom: number
  size: number
  opacity?: number
  sway?: boolean
}

/** Vegetacao da cena completa: agrupada em moitas, nunca distribuida por igual. */
const FOOTER_GROWTH: Growth[] = [
  { name: 'pinheiro', left: 6, bottom: 15, size: 26 },
  { name: 'pinheiro', left: 11, bottom: 13, size: 18, opacity: 0.75 },
  { name: 'pinheiro', left: 15.5, bottom: 16, size: 22, opacity: 0.85 },
  { name: 'broto', left: 23, bottom: 12, size: 14, opacity: 0.7, sway: true },
  { name: 'cogumelo', left: 31, bottom: 10, size: 12, opacity: 0.6 },
  { name: 'flor', left: 44, bottom: 11, size: 13, opacity: 0.65, sway: true },
  { name: 'broto', left: 57, bottom: 13, size: 12, opacity: 0.6, sway: true },
  { name: 'pinheiro', left: 71, bottom: 14, size: 20, opacity: 0.85 },
  { name: 'pinheiro', left: 76, bottom: 16, size: 28 },
  { name: 'folha', left: 85, bottom: 11, size: 16, opacity: 0.7 },
  { name: 'pinheiro', left: 92, bottom: 13, size: 16, opacity: 0.7 },
]

/** No hero a vegetacao e minima: dois brotos e uma folha. */
const HERO_GROWTH: Growth[] = [
  { name: 'broto', left: 11, bottom: 47, size: 14, opacity: 0.5, sway: true },
  { name: 'pinheiro', left: 16.5, bottom: 46, size: 16, opacity: 0.38 },
  { name: 'folha', left: 79, bottom: 48, size: 15, opacity: 0.42 },
  { name: 'broto', left: 88, bottom: 46, size: 12, opacity: 0.42, sway: true },
]

interface HorizonSceneProps {
  variant?: 'hero' | 'footer'
  className?: string
}

export function HorizonScene({ variant = 'footer', className }: HorizonSceneProps) {
  const isFooter = variant === 'footer'
  const growth = isFooter ? FOOTER_GROWTH : HERO_GROWTH

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none relative w-full overflow-hidden',
        isFooter ? 'h-44 sm:h-56 lg:h-64' : 'h-24 sm:h-32 lg:h-40',
        className,
      )}
    >
      {isFooter ? (
        <>
          <NightSky count={30} seed={73412} className="bottom-[38%]" />
          {/* Acompanha o tema: lua a noite, sol de dia. */}
          <CelestialBody size={92} className="absolute right-[14%] top-1 opacity-80 sm:right-[18%]" />
        </>
      ) : null}

      <svg
        viewBox={isFooter ? '0 0 1440 260' : '0 202 1440 58'}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden="true"
        focusable="false"
      >
        {/*
          Tres planos, como nas colinas da referencia do lago: o mais distante
          quase periwinkle, o do meio ja escurecendo para o indigo e o da frente
          na cor da propria pagina.
        */}
        {isFooter ? (
          <>
            <path d={RIDGE_BACK} fill="var(--color-hill-far)" fillOpacity="0.62" />
            <path
              d={RIDGE_MID}
              fill="var(--color-hill-near)"
              stroke="var(--color-moss)"
              strokeOpacity="0.4"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : null}

        {/*
          No hero o "chao" e pintado com a cor da secao seguinte: a colina
          sobe e vira o fundo da secao Sobre, sem emenda visivel entre as duas.
        */}
        <path
          d={RIDGE_FRONT}
          fill={isFooter ? 'var(--color-night)' : 'var(--color-night-2)'}
          stroke="var(--color-accent)"
          strokeOpacity={isFooter ? 0.28 : 0.22}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {growth.map((item, index) => (
        <span
          key={`${item.name}-${index}`}
          className={cn('absolute', item.sway && 'anim-sway')}
          style={{
            left: `${item.left}%`,
            bottom: `${item.bottom}%`,
            animationDelay: `${index * -1.3}s`,
          }}
        >
          <PixelSprite name={item.name} size={item.size} opacity={item.opacity} />
        </span>
      ))}
    </div>
  )
}
