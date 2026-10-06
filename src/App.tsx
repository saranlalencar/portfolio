import { useMemo } from 'react'
import { projects } from '@/data'
import { useInitialHashScroll } from '@/hooks/useInitialHashScroll'
import { useProjectRoute } from '@/hooks/useProjectRoute'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProjectDetail } from '@/components/projects/ProjectDetail'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Journey } from '@/sections/Journey'
import { Projects } from '@/sections/Projects'
import { Skills } from '@/sections/Skills'
import { Process } from '@/sections/Process'
import { Education } from '@/sections/Education'
import { Contact } from '@/sections/Contact'

export default function App() {
  const { slug, open, close } = useProjectRoute()

  const activeProject = useMemo(
    () => (slug ? (projects.find((project) => project.slug === slug) ?? null) : null),
    [slug],
  )

  const detailOpen = activeProject !== null

  useInitialHashScroll(!detailOpen)

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-4 z-100 -translate-y-20 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-night transition-transform duration-200 focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>

      {/* Enquanto o detalhe do projeto esta aberto, o restante da pagina fica
          inerte: nem foco de teclado, nem leitura por leitores de tela. */}
      <div inert={detailOpen || undefined}>
        <Navbar />

        <main id="conteudo">
          <Hero />
          <About />
          <Journey />
          <Projects onOpenProject={open} />
          <Skills />
          <Process />
          <Education />
          <Contact />
        </main>

        <Footer />
      </div>

      {activeProject ? <ProjectDetail project={activeProject} onClose={close} /> : null}
    </>
  )
}
