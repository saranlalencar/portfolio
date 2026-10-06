import { profile } from '@/data'
import { isFilled } from './placeholder'

function setMeta(selector: string, content: string) {
  const element = document.head.querySelector<HTMLMetaElement>(selector)
  if (element) element.content = content
}

/**
 * Atualiza titulo e metatags a partir de src/data/profile.ts.
 *
 * O index.html ja traz uma versao estatica (o que os rastreadores leem antes de
 * executar JavaScript). Aqui apenas completamos com o nome real assim que ele
 * for preenchido e absolutizamos as URLs de imagem do Open Graph, que precisam
 * ser completas.
 */
export function applySeo() {
  const hasName = isFilled(profile.name)
  const title = hasName ? `${profile.name} — ${profile.seo.titleSuffix}` : `Portfólio — ${profile.seo.titleSuffix}`

  document.title = title
  setMeta('meta[name="description"]', profile.seo.description)
  setMeta('meta[property="og:title"]', title)
  setMeta('meta[property="og:description"]', profile.seo.description)
  setMeta('meta[name="twitter:title"]', title)
  setMeta('meta[name="twitter:description"]', profile.seo.description)
  if (hasName) setMeta('meta[name="author"]', profile.name)

  const { origin } = window.location
  setMeta('meta[property="og:url"]', `${origin}/`)
  setMeta('meta[property="og:image"]', `${origin}/og-image.png`)
  setMeta('meta[name="twitter:image"]', `${origin}/og-image.png`)

  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (canonical) canonical.href = `${origin}/`

  injectStructuredData(title)
}

/** JSON-LD basico (schema.org/Person) — so com dados realmente preenchidos. */
function injectStructuredData(title: string) {
  const sameAs = [profile.links.linkedin, profile.links.github].filter(isFilled)

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    jobTitle: profile.role,
    description: profile.seo.description,
    alumniOf: { '@type': 'CollegeOrUniversity', name: profile.institution },
  }

  data.name = isFilled(profile.name) ? profile.name : title
  if (isFilled(profile.links.email)) data.email = `mailto:${profile.links.email}`
  if (sameAs.length > 0) data.sameAs = sameAs

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}
