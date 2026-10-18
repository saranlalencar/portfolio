import { useEffect, useRef } from 'react'
import type { Project } from '@/types/content'
import { skillCategories } from '@/data'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { PendingBlock } from '@/components/ui/Pending'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'

const LEAD_TARGET = { w: 260, h: 300 }
const SATELLITE_GAP = 32

/** Deslocamento vertical da segunda fileira. */
const ROW_OFFSET = LEAD_TARGET.h + SATELLITE_GAP

/**
 * Extremos do conjunto ja formado, medidos a partir do CENTRO do cartao-lider.
 * Repare que ele nao e simetrico: nao ha fileira acima do lider, so abaixo —
 * por isso o meio do conjunto fica bem abaixo do centro do lider, e e esse
 * meio (nao o lider) que precisa ficar no centro da tela.
 */
const COMPOSITION_TOP = -LEAD_TARGET.h / 2
const COMPOSITION_BOTTOM = ROW_OFFSET + LEAD_TARGET.h / 2
const COMPOSITION_MID = (COMPOSITION_TOP + COMPOSITION_BOTTOM) / 2

/** `top` do palco grudado — precisa acompanhar o `.pin-reveal-stage` no CSS. */
const PIN_TOP = 88
/**
 * Respiro minimo entre o topo do PALCO (que ja limpa o header sozinho, via
 * `PIN_TOP`) e a fileira de cima do conjunto formado.
 *
 * BUG que isto substitui: a conta antiga era `NAV_CLEARANCE - PIN_TOP`, e
 * como NAV_CLEARANCE (84) e MENOR que PIN_TOP (88), o resultado dava -4px
 * SEMPRE que essa era a candidata vencedora — nao um caso raro, mas a conta
 * em qualquer janela de altura media (656 a 900px todas caiam nela). A
 * fileira de cima ficava colada no topo do palco, atras do proprio header.
 */
const TOP_PADDING = 24

/** Largura que os cinco cartoes finais ocupam lado a lado, sem encolher. */
const COMPOSITION_WIDTH = LEAD_TARGET.w * 3 + SATELLITE_GAP * 2

/**
 * Destino de cada satelite, saindo de tras do cartao central — todos do
 * MESMO tamanho do lider (ver `.card-morph--satellite` no CSS) e distantes o
 * suficiente pra nunca se sobrepor: duas na mesma altura do lider (esquerda/
 * direita) e duas numa segunda fileira embaixo, centralizadas entre as de
 * cima. As distancias usam a propria dimensao do cartao (`LEAD_TARGET`) mais
 * uma folga fixa, entao continuam sem sobrepor mesmo se o tamanho mudar.
 */
const SATELLITES: Array<{ x: number; y: number; rotate: number }> = [
  { x: -(LEAD_TARGET.w + SATELLITE_GAP), y: 0, rotate: 0 }, // esquerda
  { x: LEAD_TARGET.w + SATELLITE_GAP, y: 0, rotate: 0 }, // direita
  { x: -(LEAD_TARGET.w / 2 + SATELLITE_GAP / 2), y: ROW_OFFSET, rotate: 0 }, // embaixo, esquerda
  { x: LEAD_TARGET.w / 2 + SATELLITE_GAP / 2, y: ROW_OFFSET, rotate: 0 }, // embaixo, direita
]

interface CardsToTechProps {
  /** O ultimo projeto da lista — real e funcional, exibido normalmente ate encolher. */
  project: Project
  onOpenProject: (slug: string) => void
}

/**
 * Fecha a pagina de Projetos revelando Tecnologias.
 *
 * Sem cartao inventado so para a transicao: o ULTIMO projeto da lista (`
 * project`) e exibido aqui, primeiro do jeito normal — mesmo cartao, mesmos
 * botoes, tudo funcional — e so entao encolhe, gira em `rotateY` (curva de
 * seno, sobe e volta a 0deg quando termina de formar) e vira uma das
 * categorias de Tecnologias. Como ha mais categorias que cabem num cartao
 * so, as outras quatro saem de tras dele: duas para os lados (esquerda/
 * direita) e duas por baixo, como se surgissem de fora da tela.
 *
 * O cartao real e travado numa largura fixa (a que ele teria naturalmente) e
 * so recebe um `transform: scale()` — nunca reflui, entao as abas, botoes e
 * a grade interna continuam legiveis enquanto encolhe.
 *
 * `prefers-reduced-motion` pula o scrub inteiro: o projeto aparece normal,
 * por cima, e as categorias de Tecnologias aparecem logo abaixo, prontas —
 * sem giro nem deslizamento.
 */
export function CardsToTech({ project, onOpenProject }: CardsToTechProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLDivElement>(null)
  const leadContentRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const satelliteRefs = useRef<Array<HTMLDivElement | null>>([])

  const reducedMotion = usePrefersReducedMotion()
  /**
   * So `prefers-reduced-motion` desliga a transicao — nao existe mais um
   * corte de largura minima. Antes, abaixo de 1024px ela virava uma lista
   * simples inteira: qualquer janela nao maximizada (comum em notebook) caia
   * nesse corte e perdia o efeito por completo. Agora o fator `fit` (ver
   * `measure`) encolhe os cinco cartoes o quanto for preciso para caberem —
   * na LARGURA tambem, nao so na altura — entao a transicao roda em qualquer
   * tamanho de tela, so ajustando a escala.
   */
  const morphs = !reducedMotion

  const categories = skillCategories.slice(0, 5)
  const [lead, ...satellites] = categories

  useEffect(() => {
    if (!morphs) return

    const wrap = wrapRef.current
    const stage = stageRef.current
    const lead = leadRef.current
    const leadContent = leadContentRef.current
    const anchor = anchorRef.current
    if (!wrap || !stage || !lead || !leadContent || !anchor) return

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

    // A rolagem usada para animar (`ANIMATION_SPAN`) e o tamanho TOTAL do
    // wrap NAO podem ser a mesma coisa: se forem, o momento em que os cinco
    // cartoes terminam de se alinhar (p=1) coincide exatamente com o
    // instante em que o cartao gruda deixa de ficar preso na tela — ele
    // nunca chega a ficar parado, visivel, antes de ser levado embora pelo
    // resto da rolagem. `HOLD_SPAN` e essa folga: rolagem extra em que o
    // grid ja pronto so fica parado na tela, dando tempo de ve-lo.
    //
    // Precisa ser curta de proposito: nada mais muda na tela enquanto ela
    // dura, entao rolagem demais aqui vira so uma sensacao de tela vazia
    // antes de Tecnologias/Contato aparecerem — o oposto do que a folga
    // deveria dar.
    const ANIMATION_SPAN = 1300
    const HOLD_SPAN = 300

    /** Folga entre a base do conjunto formado e o fim do palco. */
    const BOTTOM_SAFE = 56
    /** Respiro abaixo do conjunto, dentro da janela. */
    const BOTTOM_MARGIN = 24
    /**
     * Em que ponto da animacao o assunto deixa de ser Projetos e passa a ser
     * Tecnologias — ou seja, onde comeca a ancora `#tecnologias`.
     *
     * 0,95: depois de os cinco cartoes ja estarem praticamente nos lugares.
     * Antes disso o que se ve na tela ainda e um projeto encolhendo, e o
     * indicador do menu tem que continuar dizendo "Projetos".
     */
    const TECH_ANCHOR_AT = 0.95

    let naturalW = 0
    let naturalH = 0
    let pinHeight = 0
    /** Onde o centro do cartao-lider repousa depois de formado (ver `measure`). */
    let settledCenterY = 0
    /**
     * Fator de encaixe: 1 quando o conjunto cabe na janela, menor quando nao
     * cabe (notebook de tela curta). Multiplica TUDO do estado final —
     * tamanho dos cartoes e distancias — para o conjunto continuar inteiro na
     * tela em vez de ter a fileira de baixo cortada.
     */
    let fit = 1

    /**
     * Mede o projeto real na largura natural e trava essa largura em px —
     * daqui em diante ele so recebe `scale()`, nunca reflui. Aqui tambem se
     * decide a altura do palco, e ela tem que satisfazer DUAS coisas ao mesmo
     * tempo: caber o projeto inteiro no comeco e caber o conjunto de cinco
     * cartoes no fim.
     */
    function measure() {
      // Largura vem do proprio palco (independente do cartao-lider, que
      // ainda nao tem tamanho proprio nesse momento) — evita um ciclo onde
      // um dependeria do outro para saber sua propria largura.
      naturalW = stage!.offsetWidth
      leadContent!.style.width = `${naturalW}px`
      naturalH = leadContent!.offsetHeight

      // Cabe inteiro na janela? Se nao couber — na ALTURA (notebook de tela
      // curta) ou na LARGURA (celular, janela nao maximizada) — tudo do
      // estado final encolhe junto, na mesma proporcao. E por isso que a
      // transicao nunca precisa desligar: ela so fica menor.
      const availableH = window.innerHeight - TOP_PADDING - BOTTOM_MARGIN
      const neededH = COMPOSITION_BOTTOM - COMPOSITION_TOP
      const fitH = availableH / neededH
      const fitW = naturalW / COMPOSITION_WIDTH
      fit = Math.min(1, fitH, fitW)

      // Onde o conjunto formado deve repousar: com o MEIO dele (nao o centro
      // do lider — o conjunto e assimetrico, so tem fileira embaixo) no meio
      // da janela, mas NUNCA mais perto do topo do palco do que
      // `TOP_PADDING` — e essa segunda candidata que faltava antes.
      settledCenterY = Math.max(
        TOP_PADDING - COMPOSITION_TOP * fit,
        window.innerHeight / 2 - PIN_TOP - COMPOSITION_MID * fit,
      )

      // Os satelites nascem do tamanho final (so a posicao e a opacidade
      // mudam na rolagem), entao o tamanho deles e definido aqui, uma vez.
      const satW = LEAD_TARGET.w * fit
      const satH = LEAD_TARGET.h * fit
      satelliteRefs.current.forEach((el) => {
        if (!el) return
        el.style.width = `${satW.toFixed(0)}px`
        el.style.height = `${satH.toFixed(0)}px`
        el.style.marginTop = `${(-satH / 2).toFixed(0)}px`
        el.style.marginLeft = `${(-satW / 2).toFixed(0)}px`
      })

      // O palco precisa CONTER o conjunto formado — NAO o projeto real
      // (`naturalH`) por si so. Antes media os dois e usava o maior; numa
      // janela estreita o projeto reflui pra uma coluna so e fica bem mais
      // alto que o proprio conjunto de cinco cartoes, e essa diferenca
      // inteira virava caixa vazia: o palco fica alto, o conteudo visivel
      // ocupa so uma fatia pequena no topo dele, e depois que o "grude"
      // solta, esse resto vazio ainda precisa ser rolado ate a secao
      // seguinte aparecer — e ISSO que lia como "pagina em branco".
      // Sem `overflow: hidden` no palco (ver o CSS), o projeto real pode
      // ultrapassar essa altura tranquilamente — nada e cortado.
      pinHeight = settledCenterY + COMPOSITION_BOTTOM * fit + BOTTOM_SAFE
      stage!.style.height = `${pinHeight}px`
      wrap!.style.height = `${pinHeight + ANIMATION_SPAN + HOLD_SPAN}px`

      // A ancora `#tecnologias` comeca no ponto da rolagem em que os cartoes
      // ja estao formados e vai ate o fim do bloco. O `+ innerHeight / 2`
      // existe porque quem decide a secao ativa e a FAIXA CENTRAL da janela
      // (ver `useActiveSection`): a ancora precisa cruzar essa faixa
      // exatamente quando os cartoes aparecem, nao quando o bloco comeca.
      anchor!.style.top = `${(TECH_ANCHOR_AT * ANIMATION_SPAN + window.innerHeight / 2).toFixed(0)}px`
    }

    function apply(p: number) {
      const textP = clamp01(p / 0.3)
      // 0,70 e nao 0,62: o lider chegava pequeno cedo demais e ficava
      // esperando os satelites, sozinho no meio da tela.
      const shrinkP = clamp01(p / 0.7)
      const inP = clamp01((p - 0.35) / 0.5)

      leadContent!.style.opacity = String(1 - textP)

      // O conjunto sobe enquanto encolhe: comeca com o projeto ocupando o
      // topo do palco e termina com os cinco cartoes centrados na JANELA.
      // Sem isso o conjunto ficava centrado no palco — que tem a altura do
      // cartao de projeto inteiro — sobrando um vazio enorme em cima e
      // jogando a fileira de baixo para fora da tela.
      const centerY = naturalH / 2 + (settledCenterY - naturalH / 2) * shrinkP

      const w = naturalW - (naturalW - LEAD_TARGET.w * fit) * shrinkP
      const h = naturalH - (naturalH - LEAD_TARGET.h * fit) * shrinkP
      lead!.style.width = `${w.toFixed(0)}px`
      lead!.style.height = `${h.toFixed(0)}px`
      // Mesma amarra dos satelites (top em px + margem negativa da metade do
      // tamanho) — nunca centralizacao por flexbox nem `top: 50%`. Os dois
      // precisam usar EXATAMENTE a mesma conta, senao um desalinha do outro.
      lead!.style.top = `${centerY.toFixed(0)}px`
      lead!.style.marginTop = `${(-h / 2).toFixed(0)}px`
      lead!.style.marginLeft = `${(-w / 2).toFixed(0)}px`
      const rotation = Math.sin(shrinkP * Math.PI) * 24
      lead!.style.transform = `rotateY(${rotation.toFixed(1)}deg)`
      lead!.classList.toggle('is-framed', shrinkP > 0.5)

      // O projeto real fica travado na largura natural — so o `scale()`
      // muda, acompanhando a mesma curva do cartao que o envolve.
      const contentScale = naturalW > 0 ? w / naturalW : 1
      leadContent!.style.transform = `scale(${contentScale.toFixed(3)})`
      leadContent!.style.pointerEvents = textP > 0.6 ? 'none' : 'auto'

      const inNode = lead!.querySelector<HTMLElement>('.card-morph-cover')
      if (inNode) {
        inNode.style.opacity = String(inP)
        inNode.style.transform = `translateY(${((1 - inP) * 18).toFixed(1)}px)`
        inNode.style.pointerEvents = inP > 0.6 ? 'auto' : 'none'
      }

      satelliteRefs.current.forEach((el, i) => {
        if (!el) return
        const target = SATELLITES[i]
        // Comecam atras do cartao central (0,0) e deslizam ate a posicao
        // final, cada um com um pequeno atraso — mas o INICIO de cada um e
        // que atrasa, nunca a chegada: todos terminam exatamente em p=1,
        // bem alinhados, nenhum ficando "preso" a meio caminho.
        // Comecam CEDO, ainda durante o encolhimento do lider. Antes era
        // 0,55 — depois que o lider ja tinha terminado de encolher (0,62) —
        // e isso abria um buraco: por quase um terco da rolagem havia so um
        // cartao pequeno sozinho numa tela do tamanho da janela. Medido:
        // 390px de tela vazia (48%) no pior ponto. Comecando junto, a
        // composicao se preenche enquanto o lider diminui.
        const satStart = 0.38 + i * 0.05
        const localP = clamp01((p - satStart) / (1 - satStart))
        el.style.opacity = String(localP)
        el.style.top = `${centerY.toFixed(0)}px`
        const tx = target.x * fit * localP
        const ty = target.y * fit * localP
        el.style.transform = `translate(${tx.toFixed(0)}px, ${ty.toFixed(0)}px) rotate(${(target.rotate * localP).toFixed(1)}deg) scale(${(0.6 + 0.4 * localP).toFixed(2)})`
        el.style.pointerEvents = localP > 0.7 ? 'auto' : 'none'
      })
    }

    function progress() {
      const rect = wrap!.getBoundingClientRect()
      if (rect.top > 0) return 0
      return clamp01(-rect.top / ANIMATION_SPAN)
    }

    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        apply(progress())
        ticking = false
      })
    }

    function onResize() {
      measure()
      onScroll()
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onScroll()

    /*
      Medir de novo quando as webfonts entrarem.
      `measure()` na montagem le a altura do projeto ainda com a fonte de
      RESERVA; quando a Space Grotesk/Manrope troca, o texto reflui, a altura
      muda e a altura do bloco inteiro (que sai daquela medida) fica errada.
      Efeito real: o documento crescia 71px DEPOIS que a rolagem suave ja
      tinha sido calculada, entao clicar em "Contato" no menu parava 212px do
      topo em vez de 96 — o alvo tinha descido no meio do caminho.
    */
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (cancelled) return
      measure()
      onScroll()
    })

    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [morphs])

  function renderCategoryContent(category: (typeof categories)[number]) {
    return (
      <>
        <span className="meta text-iris">Tecnologias</span>
        <h4 className="mt-2.5 font-display text-lg font-semibold text-fg sm:text-xl">{category.label}</h4>
        {category.hint ? <p className="mt-1 text-xs text-subtle">{category.hint}</p> : null}
        <div className="mt-3 flex-1 overflow-y-auto">
          {category.items.length === 0 ? (
            <PendingBlock label="[ADICIONAR TECNOLOGIAS]" hint="Edite src/data/skills.ts." className="p-3" />
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {category.items.map((skill, i) => (
                <li key={i} className="meta rounded-full border border-line bg-surface/70 px-2 py-1 text-muted">
                  {skill.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    )
  }

  /*
    Tela estreita (ou movimento reduzido): sem encolher, sem girar. O projeto
    real aparece do jeito normal e as tecnologias logo abaixo, numa grade que
    se adapta — uma coluna no celular, duas no tablet, tres no desktop.
  */
  if (!morphs) {
    return (
      <div className="space-y-6">
        <ProjectShowcase project={project} onOpen={onOpenProject} />

        {/* Sem animacao, a ancora fica onde as tecnologias comecam de fato.
            Sem `scroll-mt-*`: a folga da navbar ja vem do `scroll-padding-top`
            do <html> — as duas somariam e a ancora pararia 192px do topo. */}
        <div id="tecnologias" />

        {/* `items-start`: cartao com uma tecnologia so nao e esticado ate a
            altura do mais cheio da fileira. */}
        <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="surface flex flex-col p-6">
              {renderCategoryContent(category)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="pin-reveal-wrap" style={{ minHeight: '260vh' }}>
      {/*
        A ancora de Tecnologias. Nao e uma secao visivel: e uma faixa
        invisivel que comeca no ponto da rolagem em que os cartoes ja estao
        formados e vai ate o fim do bloco (posicao definida em `measure`).

        E ela quem responde por "#tecnologias": o item do menu rola ate aqui —
        e a rolagem suave atravessa a transicao, entao da pra ver os cartoes
        surgindo — e o indicador do menu passa a marcar Tecnologias so a
        partir daqui. Antes disso o que esta na tela ainda e um projeto, e o
        menu continua, corretamente, em Projetos.
      */}
      <div ref={anchorRef} id="tecnologias" className="pointer-events-none absolute inset-x-0 bottom-0" />

      {/* Sem clique proprio: isto e uma transicao, nao um destino. */}
      <div ref={stageRef} className="pin-reveal-stage">
        {/* satelites: saem de tras do cartao central — dois para os lados, dois por baixo */}
        {satellites.map((category, i) => (
          <div
            key={category.id}
            ref={(el) => {
              satelliteRefs.current[i] = el
            }}
            className="card-morph card-morph--satellite"
            style={{ opacity: 0 }}
          >
            <div className="card-morph-cover" style={{ position: 'relative', opacity: 1 }}>
              {renderCategoryContent(category)}
            </div>
          </div>
        ))}

        {/*
          o cartao central: o ULTIMO projeto de verdade, virando a categoria
          "lider". `.card-morph-out` e o proprio `ProjectShowcase` — travado
          na largura natural e so escalado (`scale()`), nunca reflui — e vai
          sumindo (`textP`) bem quando o giro comeca, dando lugar ao
          `.card-morph-cover` de Tecnologias.
        */}
        <div ref={leadRef} className="card-morph card-morph--lead">
          <div ref={leadContentRef} className="card-morph-out" onClick={(event) => event.stopPropagation()}>
            <ProjectShowcase project={project} onOpen={onOpenProject} />
          </div>

          <div className="card-morph-cover">{renderCategoryContent(lead)}</div>
        </div>
      </div>
    </div>
  )
}
