import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Star = { x: number; y: number; vx: number; vy: number; z: number; tw: number }

/** Cinturao de Orion mapeado num retangulo no quadrante superior-direito. */
const ORION_POINTS: Array<[number, number]> = [
  [0.3, 0.1],
  [0.72, 0.15],
  [0.4, 0.5],
  [0.5, 0.55],
  [0.6, 0.6],
  [0.33, 0.94],
  [0.75, 0.9],
]
const ORION_LINKS: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 4],
  [2, 3],
  [3, 4],
  [2, 5],
  [4, 6],
]

/**
 * Campo de estrelas interativo do hero — sem moldura, sem card.
 *
 * Cobre a secao inteira, atras do texto, e reage ao cursor: as estrelas mais
 * proximas do ponteiro puxam uma linha ate ele, com um parallax leve. A
 * densidade e levemente maior do lado direito, onde o texto do hero nao
 * ocupa espaco — o campo preenche o "vazio" sem virar destaque.
 *
 * A figura fixa desenhada por cima e o cinturao de Orion (sete estrelas
 * ligadas), o mesmo motivo que aparece na marca e no rodape.
 */
export function OrionField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvasNode = canvasRef.current
    const context2d = canvasNode?.getContext('2d')
    if (!canvasNode || !context2d) return

    const canvasEl: HTMLCanvasElement = canvasNode
    const ctx: CanvasRenderingContext2D = context2d
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0
    let prev = performance.now()
    const pointer = { x: -999, y: -999, on: false }
    let stars: Star[] = []
    let anchors: Array<{ x: number; y: number }> = []

    function seed() {
      stars = []
      const push = (x: number) => {
        const z = 0.3 + Math.random() * 0.7
        stars.push({
          x,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.1 * z,
          vy: (Math.random() - 0.5) * 0.1 * z,
          z,
          tw: Math.random() * 6.28,
        })
      }
      const n = Math.round(Math.max(28, Math.min(84, (w * h) / 5400)))
      for (let i = 0; i < n; i++) push(Math.random() * w)
      for (let i = 0; i < Math.round(n * 0.4); i++) push(w * (0.5 + Math.random() * 0.5)) // reforco a direita

      const bx = w * 0.55
      const by = h * 0.08
      const bw = w * 0.4
      const bh = h * 0.46
      anchors = ORION_POINTS.map(([px, py]) => ({ x: bx + px * bw, y: by + py * bh }))
    }

    function resize() {
      const rect = canvasEl.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvasEl.width = w * dpr
      canvasEl.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      if (reduced) draw(performance.now())
    }

    function draw(now: number) {
      const ox = pointer.on ? (pointer.x - w / 2) * 0.018 : 0
      const oy = pointer.on ? (pointer.y - h / 2) * 0.018 : 0
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const sx = s.x + ox * s.z
        const sy = s.y + oy * s.z

        for (let j = i + 1; j < stars.length; j++) {
          const t = stars[j]
          const tx = t.x + ox * t.z
          const ty = t.y + oy * t.z
          const d = Math.hypot(sx - tx, sy - ty)
          if (d < 66) {
            ctx.strokeStyle = `rgba(142,150,214,${(0.09 * (1 - d / 66) * Math.min(s.z, t.z)).toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(sx, sy)
            ctx.lineTo(tx, ty)
            ctx.stroke()
          }
        }

        if (pointer.on) {
          const dp = Math.hypot(sx - pointer.x, sy - pointer.y)
          if (dp < 140) {
            ctx.strokeStyle = `rgba(196,162,255,${(0.3 * (1 - dp / 140)).toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(sx, sy)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }

        const tw = reduced ? 1 : 0.7 + 0.3 * Math.sin(now * 0.0018 + s.tw)
        const rad = s.z * 1.3 + 0.3
        if (s.z > 0.85) {
          ctx.fillStyle = `rgba(196,162,255,${(0.06 * tw).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(sx, sy, rad * 3, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(239,233,216,${((0.13 + s.z * 0.32) * tw).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(sx, sy, rad, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.strokeStyle = 'rgba(142,150,214,0.22)'
      ctx.lineWidth = 1
      for (const [a, b] of ORION_LINKS) {
        const A = anchors[a]
        const B = anchors[b]
        if (!A || !B) continue
        ctx.beginPath()
        ctx.moveTo(A.x + ox * 0.5, A.y + oy * 0.5)
        ctx.lineTo(B.x + ox * 0.5, B.y + oy * 0.5)
        ctx.stroke()
      }
      for (const a of anchors) {
        const axp = a.x + ox * 0.5
        const ayp = a.y + oy * 0.5
        ctx.fillStyle = 'rgba(239,206,140,0.85)'
        ctx.beginPath()
        ctx.arc(axp, ayp, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(239,206,140,0.12)'
        ctx.beginPath()
        ctx.arc(axp, ayp, 6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function tick(now: number) {
      const dt = Math.min(50, now - prev)
      prev = now
      for (const s of stars) {
        s.x += (s.vx * dt) / 16
        s.y += (s.vy * dt) / 16
        if (s.x < 0 || s.x > w) s.vx *= -1
        if (s.y < 0 || s.y > h) s.vy *= -1
      }
      draw(now)
      raf = requestAnimationFrame(tick)
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = canvasEl.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.on = true
      if (reduced) draw(performance.now())
    }
    function handlePointerLeave() {
      pointer.on = false
      if (reduced) draw(performance.now())
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvasEl)
    resize()

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    if (!reduced) raf = requestAnimationFrame(tick)

    return () => {
      observer.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
