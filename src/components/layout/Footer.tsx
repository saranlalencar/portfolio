import { profile } from '@/data'
import { isFilled } from '@/lib/placeholder'
import { Brand } from '@/components/ui/Brand'
import { GitHub, LinkedIn, Mail } from '@/components/ui/Icons'
import { SmartLink } from '@/components/ui/SmartLink'
import { Pending } from '@/components/ui/Pending'
import { HorizonScene } from '@/components/decor/HorizonScene'
import { PixelSprite } from '@/components/decor/PixelSprite'

const SOCIAL_CLASSES =
  'inline-flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors duration-400 hover:text-accent-strong'

const SOCIAL_PENDING_CLASSES = 'inline-flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-subtle'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-night">
      {/*
        Assinatura visual do portfolio: a paisagem noturna fecha a narrativa da
        pagina na transicao para o rodape. Puramente decorativa.
      */}
      <div className="relative bg-gradient-to-b from-night-2 to-night">
        <HorizonScene variant="footer" />
      </div>

      <div className="container-page pb-12 pt-4 sm:pb-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Brand markClassName="size-8" />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {profile.role}
              <span aria-hidden="true" className="mx-2 text-line-strong">
                ·
              </span>
              {profile.institution}
            </p>
          </div>

          <nav aria-label="Links de contato" className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-4">
            <SmartLink
              value={profile.links.linkedin}
              className={SOCIAL_CLASSES}
              ariaLabel="Perfil no LinkedIn"
              pendingClassName={SOCIAL_PENDING_CLASSES}
              pendingContent={
                <>
                  <LinkedIn width={16} height={16} />
                  <Pending value={profile.links.linkedin} />
                </>
              }
            >
              <LinkedIn width={16} height={16} />
              LinkedIn
            </SmartLink>

            <SmartLink
              value={profile.links.email}
              kind="email"
              className={SOCIAL_CLASSES}
              ariaLabel="Enviar e-mail"
              pendingClassName={SOCIAL_PENDING_CLASSES}
              pendingContent={
                <>
                  <Mail width={16} height={16} />
                  <Pending value={profile.links.email} />
                </>
              }
            >
              <Mail width={16} height={16} />
              {isFilled(profile.links.email) ? profile.links.email : 'E-mail'}
            </SmartLink>

            <SmartLink
              value={profile.links.github}
              className={SOCIAL_CLASSES}
              ariaLabel="Perfil no GitHub"
              pendingClassName={SOCIAL_PENDING_CLASSES}
              pendingContent={
                <>
                  <GitHub width={16} height={16} />
                  <Pending value={profile.links.github} />
                </>
              }
            >
              <GitHub width={16} height={16} />
              GitHub
            </SmartLink>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {isFilled(profile.name) ? profile.name : 'Portfólio'}. Todos os direitos reservados.
          </p>
          <p className="tracking-wide">Construído com React, TypeScript, Vite e Tailwind CSS.</p>
        </div>

        {/* Ultimo detalhe da pagina: estrela, filete e folha. */}
        <div aria-hidden="true" className="mt-8 flex items-center justify-center gap-3 opacity-70">
          <PixelSprite name="estrela" size={10} />
          <span className="hairline-x h-px w-24" />
          <PixelSprite name="folha" size={12} />
          <span className="hairline-x h-px w-24" />
          <PixelSprite name="estrela" size={10} />
        </div>
      </div>
    </footer>
  )
}
