import { profile } from '@/data'
import { isFilled, placeholderLabel } from '@/lib/placeholder'
import { scrollToSection } from '@/lib/scroll'
import { useTheme } from '@/lib/theme'
import { Button } from '@/components/ui/Button'
import { ArrowDown, ArrowRight, Download } from '@/components/ui/Icons'
import { Pending, pendingActionClasses } from '@/components/ui/Pending'
import { SmartLink } from '@/components/ui/SmartLink'
import { HeroMedia } from '@/components/hero/HeroMedia'
import { CelestialBody, CloudBands, Constellation, NightSky } from '@/components/decor/NightSky'
import { HorizonScene } from '@/components/decor/HorizonScene'
import { PixelSprite } from '@/components/decor/PixelSprite'

/**
 * Hero — a parte mais memoravel da pagina.
 *
 * A composicao ao redor do conteudo (ceu, lua, constelacao, vegetacao e a
 * linha do horizonte que fecha a secao) e toda decorativa e vive em `-z-10`.
 * O texto continua sendo o primeiro elemento na ordem de leitura e nenhum
 * ornamento reduz o contraste do que precisa ser lido.
 *
 * A coluna da direita e o espaco reservado para foto ou animacao
 * (`HeroMedia`). O projeto em destaque continua sendo o primeiro item da
 * secao Projetos.
 *
 * A unica excecao a regra "decoracao nao interage": a lua, que troca o tema.
 */
export function Hero() {
  const hasName = isFilled(profile.name)
  const { isDark, toggle: toggleTheme } = useTheme()

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-svh flex-col overflow-hidden pt-28 sm:pt-32 lg:pt-36"
    >
      {/* ------------------------------ atmosfera ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-night-2 via-night to-night" />
        <CloudBands className="bottom-[38%]" />
        <NightSky count={46} className="bottom-[18%] opacity-90" />
        <div className="starmap mask-fade-radial absolute inset-0 opacity-40" />

        <Constellation className="absolute left-[4%] top-32 hidden w-44 opacity-60 xl:block" />

        {/* halo quente da lua e o azul do ceu, como na referencia do lago */}
        <div className="glow -left-40 top-[-8rem] size-[36rem] bg-aura-cool/14" />
        <div className="glow right-[-6rem] top-[-4rem] size-[30rem] bg-aura-warm/12" />
        <div className="glow right-[-16rem] top-24 size-[34rem] bg-aura-cool/22" />
      </div>

      {/*
        A lua e o interruptor do tema: clicando nela o site vira dia e ela vira
        sol. Fica fora da camada decorativa (que e `pointer-events-none`) por
        ser, agora, um controle de verdade. Abaixo de 640px ela encostaria no
        selo da instituicao, entao some — nessa faixa o botao da navbar assume.
      */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={!isDark}
        aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        className="group/astro absolute right-[6%] top-[4.5rem] hidden rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-safe:hover:scale-105 sm:block"
      >
        <CelestialBody
          size={160}
          className="size-28 opacity-75 transition-opacity duration-500 group-hover/astro:opacity-100 sm:size-32 lg:size-36"
        />
      </button>

      {/* pequenos detalhes pixelados, em escalas diferentes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="anim-float absolute left-[6%] top-[38%] hidden lg:block">
          <PixelSprite name="folha" size={22} opacity={0.55} />
        </span>
        <span className="anim-float absolute bottom-[26%] left-[4%] hidden xl:block" style={{ animationDelay: '-4s' }}>
          <PixelSprite name="flor" size={18} opacity={0.5} />
        </span>
        <span className="anim-twinkle absolute left-[46%] top-[14%] hidden md:block">
          <PixelSprite name="estrela" size={14} opacity={0.7} />
        </span>
      </div>

      <div className="container-page flex flex-1 flex-col justify-center">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          {/* --------------------------------- texto -------------------------------- */}
          <div className="motion-safe:animate-[slide-up_0.8s_cubic-bezier(0.16,1,0.3,1)_both]">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 backdrop-blur-sm">
              <PixelSprite name="estrela" size={11} />
              <span className="meta text-muted">{profile.institution}</span>
            </p>

            <h1 className="mt-7">
              <span className="sr-only">
                {hasName ? profile.name : 'Nome pendente de preenchimento'} — {profile.role}
              </span>

              {hasName ? (
                <span aria-hidden="true" className="text-display text-gradient block">
                  {profile.name}
                </span>
              ) : (
                <span aria-hidden="true" className="block">
                  <Pending
                    value={profile.name}
                    className="px-4 py-3 font-display text-base tracking-normal sm:text-lg"
                  />
                </span>
              )}

              <span
                aria-hidden="true"
                className="mt-5 block text-xl font-semibold leading-tight text-fg sm:text-2xl lg:text-[1.6rem]"
              >
                {profile.role}
              </span>
            </h1>

            <p className="text-serif-lead mt-6 max-w-xl text-accent-strong">{profile.tagline}</p>

            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              {profile.heroSummary}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('projetos')}
                className="w-full sm:w-auto"
              >
                Ver projetos
                <ArrowRight
                  width={18}
                  height={18}
                  className="transition-transform duration-300 motion-safe:group-hover/btn:translate-x-1"
                />
              </Button>

              <SmartLink
                value={profile.links.resume}
                kind="download"
                className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full border border-line-strong bg-surface/60 px-6 py-3 text-[0.9375rem] text-fg transition-all duration-400 hover:border-accent/60 hover:text-accent-strong motion-safe:hover:-translate-y-0.5 sm:w-auto"
                pendingClassName={pendingActionClasses}
                pendingContent={
                  <>
                    <Download width={18} height={18} aria-hidden="true" />
                    {placeholderLabel(profile.links.resume)}
                  </>
                }
              >
                <Download width={18} height={18} aria-hidden="true" />
                Baixar currículo
              </SmartLink>

              <Button variant="ghost" size="lg" onClick={() => scrollToSection('contato')} className="w-full sm:w-auto">
                Contato
              </Button>
            </div>
          </div>

          {/* ------------------------- foto / animacao ------------------------- */}
          <div className="motion-safe:animate-[slide-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.14s_both]">
            <HeroMedia />
          </div>
        </div>

        <div className="mt-10 hidden justify-center lg:flex">
          <button
            type="button"
            onClick={() => scrollToSection('sobre')}
            className="group/scroll inline-flex flex-col items-center gap-2 rounded-full p-2 text-subtle transition-colors duration-300 hover:text-accent-strong"
            aria-label="Rolar para a seção Sobre"
          >
            <span className="meta">Rolar</span>
            <ArrowDown
              width={16}
              height={16}
              className="transition-transform duration-300 motion-safe:group-hover/scroll:translate-y-1"
            />
          </button>
        </div>
      </div>

      {/* Linha do horizonte fechando a primeira tela — a assinatura aparece
          completa apenas na transicao para o rodape. */}
      <HorizonScene variant="hero" className="mt-8" />
    </section>
  )
}
