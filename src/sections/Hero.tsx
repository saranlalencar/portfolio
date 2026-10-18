import { profile } from '@/data'
import { cn } from '@/lib/cn'
import { isFilled, placeholderLabel } from '@/lib/placeholder'
import { scrollToSection } from '@/lib/scroll'
import { Button } from '@/components/ui/Button'
import { ArrowDown, ArrowRight, Download } from '@/components/ui/Icons'
import { Pending, pendingActionClasses } from '@/components/ui/Pending'
import { SmartLink } from '@/components/ui/SmartLink'
import { OrionField } from '@/components/hero/OrionField'

/**
 * Hero — a parte mais memoravel da pagina.
 *
 * O campo de estrelas (`OrionField`) cobre a secao inteira, atras do texto:
 * sem moldura, sem card — ele preenche o espaco que o texto (alinhado a
 * esquerda) deixa livre e reage ao cursor. O cinturao de Orion, desenhado
 * dentro dele, e o mesmo motivo que reaparece na marca e no rodape.
 *
 * A troca de tema (lua/sol) saiu daqui — o hero fica so com as constelacoes.
 * Quem troca o tema continua sendo a marca, na navbar (`BrandMark`).
 */
export function Hero() {
  const hasName = isFilled(profile.name)

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-svh flex-col overflow-hidden pt-28 sm:pt-32 lg:pt-36"
    >
      {/* ------------------------------ atmosfera ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-night-2 via-night to-night" />

        {/*
          Halo unico, centrado no topo — o mesmo usado nos mocks
          (radial roxo, sem manchas nos cantos).
        */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(135% 105% at 50% 8%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 62%)',
          }}
        />

        <OrionField className="absolute inset-0 size-full" />
      </div>

      <div className="container-page relative flex flex-1 flex-col justify-center">
        {/* --------------------------------- texto -------------------------------- */}
        <div className="max-w-2xl motion-safe:animate-[slide-up_0.8s_cubic-bezier(0.16,1,0.3,1)_both]">
          <p className="inline-flex items-center gap-3 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="meta text-muted">{profile.institution}</span>
            <span className="orion-belt" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </p>

          <h1 className="mt-7">
            <span className="sr-only">
              {hasName ? profile.name : 'Nome pendente de preenchimento'} — {profile.role}
            </span>

            {hasName ? (
              <span aria-hidden="true" className="text-display text-shimmer block">
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
            <Button variant="primary" size="lg" onClick={() => scrollToSection('projetos')} className="w-full sm:w-auto">
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
              /*
                O estado pendente SUBSTITUI as classes do botao real, entao
                precisa repetir a largura: sem isso, no celular, ele ficava
                estreito e desalinhado dos botoes de cima e de baixo, que
                ocupam a linha inteira.
              */
              pendingClassName={cn(pendingActionClasses, 'w-full justify-center py-3 sm:w-auto')}
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
    </section>
  )
}
