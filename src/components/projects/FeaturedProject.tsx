import type { Project } from '@/types/content'
import { isFilled, placeholderLabel } from '@/lib/placeholder'
import { BadgeList } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowRight, GitHub, Image as ImageIcon } from '@/components/ui/Icons'
import { Field, Pending, pendingActionClasses } from '@/components/ui/Pending'
import { SmartLink } from '@/components/ui/SmartLink'
import { StatusPill } from '@/components/ui/StatusPill'

/**
 * Cartao de destaque do projeto principal.
 *
 * A partir daqui a interface muda de tom de proposito: sem ornamentos
 * pixelados, sem estrelas, sem brilhos. O projeto e apresentado como produto
 * de software — a identidade do portfolio permanece apenas na paleta, na
 * tipografia e no ritmo do espacamento.
 */
export function FeaturedProject({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  const preview = project.screenshots[0]
  const mappedFeatures = project.features.filter(isFilled).length

  return (
    <article className="surface edge-light group relative overflow-hidden">
      {/* filete superior: o unico "brilho" desta area */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />

      <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-6 sm:p-9 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">Projeto principal</span>
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

          <dl className="mt-8 grid gap-5 border-t border-line pt-7 sm:grid-cols-2">
            <div>
              <dt className="meta text-subtle">Problema</dt>
              <Field value={project.problem} as="dd" className="mt-2 text-sm leading-relaxed text-muted" />
            </div>
            <div>
              <dt className="meta text-subtle">Solução</dt>
              <Field value={project.solution} as="dd" className="mt-2 text-sm leading-relaxed text-muted" />
            </div>
          </dl>

          <div className="mt-8">
            <p className="meta text-subtle">Tecnologias</p>
            <BadgeList items={project.technologies} className="mt-3" />
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="md" onClick={() => onOpen(project.slug)}>
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
                className="w-full rounded-xl border border-line object-cover shadow-2xl"
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
