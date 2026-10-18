import { useEffect, useId, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { Project } from '@/types/content'
import { cn } from '@/lib/cn'
import { isFilled, placeholderLabel } from '@/lib/placeholder'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { BadgeList } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowRight, GitHub, Image as ImageIcon } from '@/components/ui/Icons'
import { Field, FieldList, Pending, pendingActionClasses } from '@/components/ui/Pending'
import { SmartLink } from '@/components/ui/SmartLink'
import { StatusPill } from '@/components/ui/StatusPill'

const STEPS = ['problema', 'solucao', 'aprendizado'] as const
type Step = (typeof STEPS)[number]

const STEP_LABEL: Record<Step, string> = {
  problema: 'Problema',
  solucao: 'Solução',
  aprendizado: 'Aprendizado',
}

const AUTO_ADVANCE_MS = 3800

/**
 * Cartao de projeto — usado para TODOS os projetos, igualmente. Nao existe
 * mais um projeto "principal" ou "em destaque": cada um recebe exatamente o
 * mesmo tratamento, so muda o conteudo.
 *
 * A partir daqui a interface muda de tom de proposito: sem ornamentos
 * pixelados, sem estrelas, sem brilhos gratuitos. O projeto e apresentado
 * como produto de software — a identidade do portfolio permanece na paleta,
 * na tipografia e no ritmo do espacamento.
 *
 * A interatividade "tech-premium" mora aqui: um brilho que segue o cursor
 * (`spotlight`), um botao primario magnetico, e as abas Problema/Solução/
 * Aprendizado avancando sozinhas.
 */
export function ProjectShowcase({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  const preview = project.screenshots[0]
  const mappedFeatures = project.features.filter(isFilled).length
  const reducedMotion = usePrefersReducedMotion()
  const showLearnings = project.learnings.length > 0

  const [step, setStep] = useState<Step>('problema')
  const [hovering, setHovering] = useState(false)
  const tabPanelId = useId()

  useEffect(() => {
    if (reducedMotion || hovering) return
    const id = window.setInterval(() => {
      setStep((current) => STEPS[(STEPS.indexOf(current) + 1) % STEPS.length])
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [step, reducedMotion, hovering])

  const handleSpotlight = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  const handleMagnetMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    event.currentTarget.style.transform = `translate(${(dx * 6).toFixed(1)}px, ${(dy * 5).toFixed(1)}px)`
  }
  const handleMagnetLeave = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.transform = 'translate(0, 0)'
  }

  return (
    <article
      className="surface edge-light spotlight group relative overflow-hidden"
      onPointerMove={handleSpotlight}
    >
      {/* filete superior: o unico "brilho" fixo desta area */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />

      <div className="relative z-10 grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-6 sm:p-9 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={project.status} />
          </div>

          <h3 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] text-fg sm:text-[2.75rem]">
            {project.title}
          </h3>

          <p className="mt-3">
            {isFilled(project.categoryLabel) ? (
              <span className="meta text-accent">{project.categoryLabel}</span>
            ) : (
              <Pending value={project.categoryLabel} />
            )}
          </p>

          <Field
            value={project.summary}
            as="p"
            className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-muted sm:text-base"
          />

          {/* -------- abas: Problema / Solução / Aprendizado, avancando sozinhas -------- */}
          <div
            className="mt-8 border-t border-line pt-2"
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            /*
              O foco pausa igual ao ponteiro: quem navega por teclado nao tem
              hover, e sem isto o conteudo trocava sozinho embaixo da aba que
              a pessoa acabou de focar, sem nenhuma forma de parar.
            */
            onFocusCapture={() => setHovering(true)}
            onBlurCapture={() => setHovering(false)}
          >
            <div className="tabbar-head" role="tablist" aria-label="Problema, solução e aprendizado do projeto">
              {STEPS.filter((id) => id !== 'aprendizado' || showLearnings).map((id) => (
                <button
                  key={id}
                  type="button"
                  id={`${tabPanelId}-tab-${id}`}
                  role="tab"
                  aria-selected={step === id}
                  aria-controls={`${tabPanelId}-panel`}
                  className="tabbar-btn"
                  onClick={() => setStep(id)}
                >
                  <span className="meta text-inherit">{STEP_LABEL[id]}</span>
                  {step === id ? (
                    <span
                      key={id}
                      className="tabbar-bar"
                      style={{ animation: `tabbar-fill ${AUTO_ADVANCE_MS}ms linear forwards` }}
                    />
                  ) : null}
                </button>
              ))}
            </div>

            {/*
              Os tres conteudos ficam SEMPRE na mesma celula da grade, um por
              cima do outro — so a visibilidade muda.

              Antes so o conteudo da aba ativa era montado, e como os textos
              tem tamanhos diferentes o cartao mudava de altura a cada troca.
              Com as abas girando sozinhas (ver o `setInterval` acima) e
              varios cartoes girando em paralelo, a PAGINA INTEIRA mudava de
              altura o tempo todo: media +70px de crescimento em `#projetos`
              sem ninguem tocar em nada. Isso derrubava a rolagem por ancora
              (clicar em "Contato" parava a 212px do topo em vez de 96,
              porque o alvo descia no meio da rolagem) e fazia o texto pular
              durante a leitura.

              `invisible` (visibility: hidden) e nao `hidden`: a caixa
              continua ocupando espaco, entao a altura passa a ser a do maior
              conteudo e nunca mais muda. Tambem tira o item da arvore de
              acessibilidade, entao o leitor de tela so anuncia a aba ativa.
            */}
            <div
              id={`${tabPanelId}-panel`}
              role="tabpanel"
              aria-labelledby={`${tabPanelId}-tab-${step}`}
              className="grid pt-5"
            >
              <div
                className={cn(
                  '[grid-area:1/1] transition-opacity duration-300',
                  step === 'problema' ? 'visible opacity-100' : 'invisible opacity-0',
                )}
              >
                <Field value={project.problem} as="p" className="text-sm leading-relaxed text-muted sm:text-[0.9375rem]" />
              </div>

              <div
                className={cn(
                  '[grid-area:1/1] transition-opacity duration-300',
                  step === 'solucao' ? 'visible opacity-100' : 'invisible opacity-0',
                )}
              >
                <Field value={project.solution} as="p" className="text-sm leading-relaxed text-muted sm:text-[0.9375rem]" />
              </div>

              {showLearnings ? (
                <div
                  className={cn(
                    '[grid-area:1/1] transition-opacity duration-300',
                    step === 'aprendizado' ? 'visible opacity-100' : 'invisible opacity-0',
                  )}
                >
                  <FieldList items={project.learnings} itemClassName="leading-relaxed" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-8">
            <p className="meta text-subtle">Tecnologias</p>
            <BadgeList items={project.technologies} className="mt-3" />
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              className="magnetic"
              onClick={() => onOpen(project.slug)}
              onPointerMove={handleMagnetMove}
              onPointerLeave={handleMagnetLeave}
            >
              Ver projeto completo
              <ArrowRight
                width={18}
                height={18}
                aria-hidden="true"
                className="transition-transform duration-300 motion-safe:group-hover/btn:translate-x-1"
              />
            </Button>

            <SmartLink
              value={project.links.repository}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-5 py-2.5 text-sm text-fg transition-colors duration-400 hover:border-accent/60 hover:text-accent-strong"
              ariaLabel={'Repositório do projeto ' + project.title}
              pendingClassName={pendingActionClasses}
              pendingContent={
                <>
                  <GitHub width={16} height={16} aria-hidden="true" />
                  {placeholderLabel(project.links.repository)}
                </>
              }
            >
              <GitHub width={16} height={16} aria-hidden="true" />
              Repositório
            </SmartLink>
          </div>
        </div>

        <div className="relative border-t border-line bg-night/40 p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
          <div className="relative flex h-full flex-col justify-center">
            {preview?.src ? (
              <img
                src={preview.src}
                alt={isFilled(preview.alt) ? preview.alt : 'Tela do projeto ' + project.title}
                loading="lazy"
                decoding="async"
                /*
                  `aspect-[16/10]` e a MESMA proporcao da moldura de reserva
                  logo abaixo: com ou sem imagem, o espaco ocupado e
                  identico. Sem isso a imagem entrava com altura zero e so
                  empurrava a pagina ao terminar de carregar — e como a
                  rolagem ate uma ancora e calculada antes disso, o clique no
                  menu parava no lugar errado.
                */
                className="aspect-[16/10] w-full rounded-xl border border-line object-cover shadow-2xl"
              />
            ) : (
              /* Moldura de aplicacao: deixa claro que ali entra uma tela real. */
              <div className="overflow-hidden rounded-xl border border-dashed border-line-strong bg-night/70">
                <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
                  <span aria-hidden="true" className="size-2 rounded-full bg-line-strong" />
                  <span aria-hidden="true" className="size-2 rounded-full bg-line-strong" />
                  <span aria-hidden="true" className="size-2 rounded-full bg-line-strong" />
                </div>
                <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 p-6 text-center">
                  <ImageIcon width={26} height={26} className="text-subtle" aria-hidden="true" />
                  <Pending value={preview?.alt ?? '[ADICIONAR SCREENSHOT]'} />
                  <p className="max-w-[16rem] text-xs leading-relaxed text-subtle">
                    As telas reais do sistema entram aqui assim que estiverem disponíveis.
                  </p>
                </div>
              </div>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
              <div>
                <dt className="meta text-subtle">Período</dt>
                <dd className="mt-1.5 text-sm text-muted">
                  {isFilled(project.period) ? project.period : <Pending value={project.period} />}
                </dd>
              </div>
              <div>
                <dt className="meta text-subtle">Funcionalidades</dt>
                <dd className="mt-1.5 text-sm text-muted">
                  {mappedFeatures > 0 ? mappedFeatures + ' mapeadas' : <Pending value="[ADICIONAR FUNCIONALIDADES]" />}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </article>
  )
}
