import { useEffect, useRef, type ReactNode } from 'react'
import type { Project } from '@/types/content'
import { isFilled, placeholderLabel } from '@/lib/placeholder'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrollLock } from '@/hooks/useScrollLock'
import { BadgeList } from '@/components/ui/Badge'
import { ArrowUpRight, Close, GitHub, Image as ImageIcon } from '@/components/ui/Icons'
import { Field, FieldList, Pending, pendingActionClasses } from '@/components/ui/Pending'
import { SmartLink } from '@/components/ui/SmartLink'
import { StatusPill } from '@/components/ui/StatusPill'

const TITLE_ID = 'detalhe-projeto-titulo'

/** Um bloco do case, com numeracao editorial a esquerda. */
function Block({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-8 sm:grid-cols-[10rem_1fr] sm:gap-10 sm:py-10">
      <h3 className="meta flex items-baseline gap-3 text-accent">
        <span className="text-subtle">{index}</span>
        {title}
      </h3>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

/**
 * Case completo do projeto, apresentado como camada sobreposta.
 *
 * A ordem dos blocos e a narrativa de um case de engenharia:
 * problema -> contexto -> objetivo -> solucao -> funcionalidades ->
 * tecnologias -> arquitetura -> desafios -> aprendizados -> evolucao.
 *
 * Rota por hash (#projeto/<slug>) em vez de biblioteca de rotas: o link
 * continua compartilhavel, o botao "voltar" do navegador fecha o detalhe e o
 * site permanece estatico, sem rewrite no servidor.
 */
export function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useScrollLock(true)
  useFocusTrap(containerRef, true)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      tabIndex={-1}
      className="fixed inset-0 z-70 overflow-y-auto overscroll-contain bg-night motion-safe:animate-[fade-in_0.25s_ease-out]"
    >
      <div className="sticky top-0 z-10 border-b border-line bg-night/92 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <p className="meta min-w-0 truncate text-subtle">
            Projeto
            <span aria-hidden="true" className="mx-2 text-line-strong">
              /
            </span>
            <span className="text-muted">{project.title}</span>
          </p>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 text-sm text-fg transition-colors duration-400 hover:border-accent/60 hover:text-accent-strong"
          >
            <Close width={16} height={16} aria-hidden="true" />
            Voltar
          </button>
        </div>
      </div>

      <div className="container-page pb-24 pt-10 sm:pt-14">
        <div className="mx-auto max-w-4xl">
          <header className="relative">
            <div className="flex flex-wrap items-center gap-3">
              {isFilled(project.categoryLabel) ? (
                <span className="meta text-accent">{project.categoryLabel}</span>
              ) : (
                <Pending value={project.categoryLabel} />
              )}
              <StatusPill status={project.status} />
              {isFilled(project.period) ? (
                <span className="text-xs font-medium tracking-wide text-subtle">{project.period}</span>
              ) : (
                <Pending value={project.period} />
              )}
            </div>

            <h2 id={TITLE_ID} className="text-title mt-5 text-fg">
              {project.title}
            </h2>

            <Field
              value={project.summary}
              as="p"
              className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
            />
          </header>

          <div className="mt-12">
            <Block index="01" title="Problema">
              <Field value={project.problem} as="p" className="text-[0.9375rem] leading-relaxed text-muted" />
            </Block>

            <Block index="02" title="Contexto">
              <Field value={project.context} as="p" className="text-[0.9375rem] leading-relaxed text-muted" />
            </Block>

            <Block index="03" title="Objetivo">
              <Field value={project.objective} as="p" className="text-[0.9375rem] leading-relaxed text-muted" />
            </Block>

            <Block index="04" title="Solução">
              <Field value={project.solution} as="p" className="text-[0.9375rem] leading-relaxed text-muted" />
            </Block>

            <Block index="05" title="Funcionalidades">
              <FieldList items={project.features} />
            </Block>

            <Block index="06" title="Tecnologias">
              <BadgeList items={project.technologies} />
            </Block>

            <Block index="07" title="Arquitetura">
              <Field value={project.architecture} as="p" className="text-[0.9375rem] leading-relaxed text-muted" />
            </Block>

            <Block index="08" title="Desafios">
              <FieldList items={project.challenges} />
            </Block>

            <Block index="09" title="Aprendizados">
              <FieldList items={project.learnings} />
            </Block>

            <Block index="10" title="Evolução">
              <FieldList items={project.evolution} />
            </Block>

            <Block index="11" title="Telas">
              <div className="grid gap-4 sm:grid-cols-2">
                {project.screenshots.map((shot, index) => (
                  <figure key={index} className="space-y-2">
                    {shot.src ? (
                      <img
                        src={shot.src}
                        alt={isFilled(shot.alt) ? shot.alt : 'Tela do projeto ' + project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full rounded-xl border border-line object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface/40 p-4 text-center">
                        <ImageIcon width={24} height={24} className="text-subtle" aria-hidden="true" />
                        <Pending value={shot.alt} />
                      </div>
                    )}
                    {shot.caption ? (
                      <figcaption className="text-xs text-subtle">
                        {isFilled(shot.caption) ? shot.caption : <Pending value={shot.caption} />}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </Block>

            <Block index="12" title="Links">
              <div className="flex flex-wrap gap-3">
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

                <SmartLink
                  value={project.links.demo}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-5 py-2.5 text-sm text-fg transition-colors duration-400 hover:border-accent/60 hover:text-accent-strong"
                  ariaLabel={'Demonstração do projeto ' + project.title}
                  pendingClassName={pendingActionClasses}
                  pendingContent={
                    <>
                      <ArrowUpRight width={16} height={16} aria-hidden="true" />
                      {placeholderLabel(project.links.demo)}
                    </>
                  }
                >
                  <ArrowUpRight width={16} height={16} aria-hidden="true" />
                  Demonstração
                </SmartLink>
              </div>
            </Block>
          </div>
        </div>
      </div>
    </div>
  )
}
