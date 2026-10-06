/**
 * Gera public/og-image.png (1200x630) usando apenas a biblioteca padrao do Node.
 *
 * A imagem e um PLACEHOLDER de marca dentro da identidade "Jardim Noturno":
 * ceu verde-escuro com estrelas, colinas ao fundo e o simbolo do portfolio
 * (lua crescente + estrela). Nao contem texto, justamente para nao inventar
 * nome ou titulo. Substitua por uma imagem definitiva quando o nome real
 * estiver disponivel (ver README, secao "SEO e Open Graph").
 *
 * Uso: npm run og
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const WIDTH = 1200
const HEIGHT = 630

/* Paleta oficial do portfolio (ver src/styles/index.css). */
const NIGHT = [0x16, 0x26, 0x1f]
const NIGHT_2 = [0x1d, 0x31, 0x28]
const SURFACE = [0x25, 0x39, 0x2e]
const SAGE = [0x8f, 0xc4, 0x6a]
const SAGE_LIGHT = [0xb6, 0xe0, 0x8c]
const MOSS = [0x5e, 0x94, 0x40]
const PLUM = [0x7b, 0x85, 0xd6] /* azul-periwinkle */
const PLUM_DEEP = [0x39, 0x40, 0x6f] /* indigo profundo */
const SAND = [0xeb, 0xd9, 0xb4]
const GOLD = [0xe0, 0xb2, 0x5c]

const pixels = new Uint8Array(WIDTH * HEIGHT * 3)

const clamp = (v, min, max) => (v < min ? min : v > max ? max : v)
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
const mix = (a, b, t) => a.map((value, i) => Math.round(value + (b[i] - value) * t))

function blend(x, y, color, alpha) {
  if (alpha <= 0 || x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return
  const a = clamp(alpha, 0, 1)
  const i = (y * WIDTH + x) * 3
  for (let c = 0; c < 3; c++) {
    pixels[i + c] = Math.round(pixels[i + c] * (1 - a) + color[c] * a)
  }
}

/** Fundo: gradiente vertical do verde-noturno mais claro para o mais escuro. */
function paintBackground() {
  for (let y = 0; y < HEIGHT; y++) {
    const t = y / HEIGHT
    const row = mix(NIGHT_2, NIGHT, smoothstep(0, 0.85, t))
    for (let x = 0; x < WIDTH; x++) {
      const i = (y * WIDTH + x) * 3
      for (let c = 0; c < 3; c++) pixels[i + c] = row[c]
    }
  }
}

/** Gerador pseudoaleatorio com semente: a imagem e sempre identica. */
function mulberry32(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Brilho radial (bem baixo) para dar profundidade. */
function paintGlow(cx, cy, radius, color, maxAlpha) {
  const minX = Math.max(0, Math.floor(cx - radius))
  const maxX = Math.min(WIDTH - 1, Math.ceil(cx + radius))
  const minY = Math.max(0, Math.floor(cy - radius))
  const maxY = Math.min(HEIGHT - 1, Math.ceil(cy + radius))
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const d = Math.hypot(x - cx, y - cy) / radius
      if (d >= 1) continue
      const falloff = (1 - d) * (1 - d)
      blend(x, y, color, maxAlpha * falloff)
    }
  }
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared === 0 ? 0 : clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1)
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

/** Traco com pontas arredondadas e anti-aliasing de 1,5px. */
function strokeSegment(x1, y1, x2, y2, thickness, color, alpha = 1) {
  const pad = thickness + 3
  const minX = Math.max(0, Math.floor(Math.min(x1, x2) - pad))
  const maxX = Math.min(WIDTH - 1, Math.ceil(Math.max(x1, x2) + pad))
  const minY = Math.max(0, Math.floor(Math.min(y1, y2) - pad))
  const maxY = Math.min(HEIGHT - 1, Math.ceil(Math.max(y1, y2) + pad))
  const half = thickness / 2
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const d = distanceToSegment(x + 0.5, y + 0.5, x1, y1, x2, y2)
      blend(x, y, color, alpha * (1 - smoothstep(half - 1, half + 0.5, d)))
    }
  }
}

function fillCircle(cx, cy, radius, color, alpha = 1) {
  const minX = Math.max(0, Math.floor(cx - radius - 2))
  const maxX = Math.min(WIDTH - 1, Math.ceil(cx + radius + 2))
  const minY = Math.max(0, Math.floor(cy - radius - 2))
  const maxY = Math.min(HEIGHT - 1, Math.ceil(cy + radius + 2))
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy)
      blend(x, y, color, alpha * (1 - smoothstep(radius - 1, radius + 0.5, d)))
    }
  }
}

/**
 * Lua crescente: interseccao entre "dentro do circulo externo" e "fora do
 * circulo interno". Desenhada por cobertura, o que mantem as bordas suaves.
 */
function fillCrescent(cx, cy, radius, offsetX, offsetY, innerRadius, color, alpha = 1) {
  const minX = Math.max(0, Math.floor(cx - radius - 2))
  const maxX = Math.min(WIDTH - 1, Math.ceil(cx + radius + 2))
  const minY = Math.max(0, Math.floor(cy - radius - 2))
  const maxY = Math.min(HEIGHT - 1, Math.ceil(cy + radius + 2))
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = x + 0.5
      const py = y + 0.5
      const outer = 1 - smoothstep(radius - 1, radius + 0.5, Math.hypot(px - cx, py - cy))
      const inner = smoothstep(innerRadius - 1, innerRadius + 0.5, Math.hypot(px - (cx + offsetX), py - (cy + offsetY)))
      blend(x, y, color, alpha * outer * inner)
    }
  }
}

/** Estrela de quatro pontas (dois tracos cruzados afinando nas pontas). */
function fillStar(cx, cy, size, color, alpha = 1) {
  const minX = Math.max(0, Math.floor(cx - size - 2))
  const maxX = Math.min(WIDTH - 1, Math.ceil(cx + size + 2))
  const minY = Math.max(0, Math.floor(cy - size - 2))
  const maxY = Math.min(HEIGHT - 1, Math.ceil(cy + size + 2))
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = Math.abs(x + 0.5 - cx) / size
      const dy = Math.abs(y + 0.5 - cy) / size
      // curva concava: soma das raizes < 1 desenha a estrela de 4 pontas
      const d = Math.sqrt(dx) + Math.sqrt(dy)
      blend(x, y, color, alpha * (1 - smoothstep(0.92, 1.02, d)))
    }
  }
}

/** Campo de estrelas discreto, concentrado na metade superior. */
function paintStars(count = 120) {
  const random = mulberry32(20260818)
  for (let i = 0; i < count; i++) {
    const x = random() * WIDTH
    const y = random() * HEIGHT * 0.72
    const radius = random() < 0.85 ? 1.2 : 2
    const tone = random()
    const color = tone < 0.55 ? SAGE_LIGHT : tone < 0.85 ? SAND : GOLD
    fillCircle(x, y, radius, color, 0.3 + random() * 0.55)
  }
}

/** Colinas em duas camadas, com uma crista suave. */
function paintHills() {
  const layers = [
    { base: 470, amp: 26, freq: 0.0042, phase: 0.6, color: PLUM_DEEP, alpha: 0.55 },
    { base: 524, amp: 20, freq: 0.0058, phase: 2.1, color: SURFACE, alpha: 0.95 },
    { base: 572, amp: 14, freq: 0.0035, phase: 4.2, color: NIGHT, alpha: 1 },
  ]

  for (const layer of layers) {
    for (let x = 0; x < WIDTH; x++) {
      const ridge =
        layer.base +
        Math.sin(x * layer.freq + layer.phase) * layer.amp +
        Math.sin(x * layer.freq * 2.7 + layer.phase * 1.7) * (layer.amp * 0.35)

      for (let y = Math.floor(ridge); y < HEIGHT; y++) {
        blend(x, y, layer.color, layer.alpha)
      }
      // filete claro na crista
      strokeSegment(x, ridge, x + 1, ridge, 1.6, MOSS, layer.alpha * 0.35)
    }
  }
}

/** Contorno de retangulo arredondado (signed distance field). */
function strokeRoundedRect(cx, cy, size, radius, thickness, colorFor, alpha = 1) {
  const half = size / 2
  const pad = thickness + 3
  for (let y = Math.floor(cy - half - pad); y <= Math.ceil(cy + half + pad); y++) {
    for (let x = Math.floor(cx - half - pad); x <= Math.ceil(cx + half + pad); x++) {
      const qx = Math.max(Math.abs(x + 0.5 - cx) - (half - radius), 0)
      const qy = Math.max(Math.abs(y + 0.5 - cy) - (half - radius), 0)
      const d = Math.abs(Math.hypot(qx, qy) - radius)
      const coverage = 1 - smoothstep(thickness / 2 - 1, thickness / 2 + 0.5, d)
      if (coverage > 0) blend(x, y, colorFor(x, y), alpha * coverage)
    }
  }
}

/** Interpola verde claro -> roxo na diagonal do simbolo. */
function markGradient(originX, originY, size) {
  return (x, y) => mix(SAGE_LIGHT, PLUM, clamp((x - originX + (y - originY)) / (size * 2), 0, 1))
}

/** Simbolo do portfolio: moldura + lua crescente + estrela. */
function paintMark(cx, cy, size) {
  const scale = size / 64
  const originX = cx - size / 2
  const originY = cy - size / 2
  const gradient = markGradient(originX, originY, size)

  strokeRoundedRect(cx, cy, size * 0.96, 18 * scale, 3 * scale, gradient, 0.55)

  // lua crescente (mesma geometria do favicon)
  fillCrescent(
    originX + 32 * scale,
    originY + 32 * scale,
    17 * scale,
    5.5 * scale,
    0,
    14 * scale,
    gradient(originX + 32 * scale, originY + 32 * scale),
    0.95,
  )

  fillStar(originX + 21.5 * scale, originY + 20.5 * scale, 7 * scale, GOLD, 0.95)
  fillCircle(originX + 20 * scale, originY + 45 * scale, 2 * scale, SAGE_LIGHT, 0.8)
}

/* ---------------------------------- PNG ---------------------------------- */

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buffer) {
  let c = ~0
  for (let i = 0; i < buffer.length; i++) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8)
  return ~c >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeAndData), 0)
  return Buffer.concat([length, typeAndData, crc])
}

function encodePng(width, height, rgb) {
  const raw = Buffer.alloc(height * (1 + width * 3))
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3)
    raw[rowStart] = 0 // filtro "None"
    Buffer.from(rgb.buffer, y * width * 3, width * 3).copy(raw, rowStart + 1)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type: truecolor
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* --------------------------------- Render -------------------------------- */

paintBackground()
paintGlow(280, 180, 540, SAGE, 0.1)
paintGlow(980, 140, 520, PLUM, 0.16)
paintStars()
paintHills()
paintMark(WIDTH / 2, HEIGHT / 2 - 40, 200)
strokeSegment(WIDTH / 2 - 90, HEIGHT / 2 + 118, WIDTH / 2 + 90, HEIGHT / 2 + 118, 4, GOLD, 0.7)

const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og-image.png')
mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, encodePng(WIDTH, HEIGHT, pixels))
console.log(`og-image.png gerado (${WIDTH}x${HEIGHT}) em ${outputPath}`)
