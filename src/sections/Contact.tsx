import type { ReactNode } from 'react'
import { profile } from '@/data'
import { isFilled, placeholderLabel } from '@/lib/placeholder'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { ArrowUpRight, Download, GitHub, LinkedIn, Mail } from '@/components/ui/Icons'
import { Pending, pendingActionClasses } from '@/components/ui/Pending'
import { SmartLink } from '@/components/ui/SmartLink'
import { NightSky } from '@/components/decor/NightSky'
import { PixelSprite } from '@/components/decor/PixelSprite'

const CARD = 'surface surface-interactive group flex w-full items-center gap-4 p-5'

interface ChannelProps {
  value: string
  kind?: 'url' | 'email'
  label: string
  icon: ReactNode
}

/** Canal de contato. Enquanto o link for placeholder, nao vira <a>. */
function Channel({ value, kind = 'url', label, icon }: ChannelProps) {
  return (
    <SmartLink
      value={value}
      kind={kind}
      className={CARD}
      ariaLabel={label}
      pendingContent={
        <>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-night text-subtle">
            {icon}
          </span>
          <span className="min-w-0">
            <span className="meta block text-subtle">{label}</span>
            <span className="mt-1.5 block">
              <Pending value={value} />
            </span>
          </span>
        </>
      }
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-night text-accent transition-colors duration-400 group-hover:border-accent/45 group-hover:text-accent-strong">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="meta block text-subtle">{label}</span>
        <span className="mt-0.5 block truncate text-[0.9375rem] text-fg">{value.replace(/^https?:\/\//, '')}</span>
      </span>
      <ArrowUpRight
        width={18}
        height={18}
        aria-hidden="true"
        className="shrink-0 text-subtle transition-all duration-400 group-hover:text-accent-strong motion-safe:group-hover:-translate-y-0.5"
      />
    </SmartLink>
  )
}

export function Contact() {
  return (
    <Section id="contato" tone="night-2" labelledBy="contato-titulo" className="overflow-hidden">
      {/* Sem lua aqui: a paisagem do rodape vem logo abaixo e ja tem a dela —
          duas luas na mesma tela quebrariam a continuidade da cena. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <NightSky count={34} seed={31337} className="opacity-80" />
        <div className="glow left-1/2 top-[-6rem] size-[36rem] -translate-x-1/2 bg-aura-cool/18" />
      </div>

      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow flex items-center gap-2.5">
            <PixelSprite name="estrela" size={11} />
            <span>
              07
              <span aria-hidden="true" className="mx-2 text-line-strong">
                /
              </span>
              Contato
            </span>
          </p>

          <h2 id="contato-titulo" className="text-title mt-5 text-fg">
            {profile.contact.heading}
          </h2>

          <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-muted sm:text-base">
            {profile.contact.message}
          </p>

          <div className="mt-8">
            <SmartLink
              value={profile.links.resume}
              kind="download"
              className="group/btn inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[0.9375rem] font-semibold text-night transition-all duration-400 hover:bg-accent-strong hover:shadow-[0_14px_44px_-16px_rgba(143,196,106,0.7)] motion-safe:hover:-translate-y-0.5"
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
          </div>

          {profile.location ? (
            <p className="mt-8 flex flex-wrap items-center gap-2 text-sm text-subtle">
              <span className="meta">Localização</span>
              {isFilled(profile.location) ? (
                <span className="text-muted">{profile.location}</span>
              ) : (
                <Pending value={profile.location} />
              )}
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={120} className="space-y-4">
          <Channel value={profile.links.linkedin} label="LinkedIn" icon={<LinkedIn width={18} height={18} />} />
          <Channel value={profile.links.email} kind="email" label="E-mail" icon={<Mail width={18} height={18} />} />
          <Channel value={profile.links.github} label="GitHub" icon={<GitHub width={18} height={18} />} />
        </Reveal>
      </div>
    </Section>
  )
}
